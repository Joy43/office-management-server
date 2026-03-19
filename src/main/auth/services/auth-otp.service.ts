import { UserResponseDto } from '@/common/dto/user-response.dto';
import { successResponse, TResponse } from '@/common/response/response.util';
import { AppError } from '@/core/error/handle-error.app';
import { HandleError } from '@/core/error/handle-error.decorator';
import { AuthMailService } from '@/lib/mail/services/auth-mail.service';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { AuthUtilsService } from '@/lib/utils/services/auth-utils.service';
import { Injectable } from '@nestjs/common';
import { OtpType, Prisma } from '@prisma';
import { ResendOtpDto, VerifyOTPDto } from '../dto/otp.dto';

@Injectable()
export class AuthOtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: AuthUtilsService,
    private readonly authMailService: AuthMailService,
  ) {}

  @HandleError('Failed to resend OTP')
  async resendOtp({ email, type }: ResendOtpDto): Promise<TResponse<any>> {
    // ------------------ find user by email ------------------
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user) throw new AppError(404, 'User not found');

    if (user.isVerified && type === OtpType.VERIFICATION) {
      throw new AppError(400, 'User is already verified');
    }

    // ------------------ delete existing unexpired OTPs of this type ------------------
    await this.prisma.client.userOtp.deleteMany({
      where: {
        userId: user.id,
        type,
        expiresAt: { gt: new Date() },
      },
    });

    // ------------------ generate new OTP and hash ------------------
    const otp = await this.utils.generateOTPAndSave(user.id, type);

    // ------------------ send email ------------------
    try {
      if (type === OtpType.VERIFICATION) {
        await this.authMailService.sendVerificationCodeEmail(
          email,
          otp.toString(),
          {
            subject: 'Your OTP Code',
            message: `Here is your OTP code. It will expire in 5 minutes.`,
          },
        );
      }

      if (type === OtpType.RESET) {
        await this.authMailService.sendResetPasswordCodeEmail(
          email,
          otp.toString(),
          {
            subject: 'Your OTP Code',
            message: `Here is your OTP code. It will expire in 5 minutes.`,
          },
        );
      }
    } catch (err) {
      console.error(err);

      await this.prisma.client.userOtp.deleteMany({
        where: { userId: user.id, type },
      });
      throw new AppError(
        500,
        'Failed to send OTP email. Please try again later.',
      );
    }

    return successResponse(null, `${type} OTP sent successfully`);
  }

  // ------------------ verify OTP ------------------
  @HandleError('OTP verification failed', 'User')
  async verifyOTP(
    dto: VerifyOTPDto,
    type: OtpType = OtpType.VERIFICATION,
  ): Promise<TResponse<any>> {
    const { email, otp } = dto;

    // ------------------ Find user ----------------------
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user) throw new AppError(404, 'User not found');

    // ------------------ Find latest OTP for user and type ------------------
    const userOtp = await this.prisma.client.userOtp.findFirst({
      where: { userId: user.id, type },
      orderBy: { createdAt: 'desc' },
    });

    if (!userOtp)
      throw new AppError(400, 'OTP is not set. Please request a new one.');

    if (userOtp.expiresAt < new Date()) {
      // ------------------ Expired -> delete ------------------
      await this.prisma.client.userOtp.delete({ where: { id: userOtp.id } });
      throw new AppError(400, 'OTP has expired. Please request a new one.');
    }

    const isCorrectOtp = await this.utils.compare(otp, userOtp.code);
    if (!isCorrectOtp) throw new AppError(400, 'Invalid OTP');

    // ------------------ OTP verified -> delete OTP ------------------
    await this.prisma.client.userOtp.deleteMany({
      where: { userId: user.id, type },
    });

    // ------------------ Mark user verified if verification OTP ------------------
    const updateData: Prisma.UserUpdateInput = {
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),
    };
    if (type === OtpType.VERIFICATION) {
      updateData.isVerified = true;
    }
    // -----------also tenent verified if user is tenant------------
    if (type === OtpType.VERIFICATION && user.role === 'CLIENT_ADMIN') {
      updateData.tenant = {
        update: {
          isVerified: true,
        },
      };
    }

    const updatedUser = await this.prisma.client.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // ------------------ Generate token ------------------
    const token = await this.utils.generateTokenPairAndSave({
      sub: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    return successResponse(
      {
        user: await this.utils.sanitizeUser<UserResponseDto>(
          updatedUser as any,
        ),
        token,
      },
      'OTP verified successfully',
    );
  }
}
