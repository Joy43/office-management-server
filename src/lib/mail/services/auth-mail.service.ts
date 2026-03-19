import { ENVEnum } from '@/common/enum/env.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as he from 'he';
import * as nodemailer from 'nodemailer';
import { MailService } from '../mail.service';
import { AccountConfirmationTemplate } from '../templates/acount-confimation.template';
import { otpTemplate } from '../templates/otp.template';
import { passwordResetConfirmationTemplate } from '../templates/reset-password-confirm.template';

interface EmailOptions {
  subject?: string;
  message?: string;
}

@Injectable()
export class AuthMailService {
  private accountConfirmationTemplate = new AccountConfirmationTemplate();

  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
  ): Promise<nodemailer.SentMessageInfo> {
    return this.mailService.sendMail({ to, subject, html, text });
  }

  private sanitize(input: string) {
    return he.encode(input);
  }

  async sendVerificationCodeEmail(
    to: string,
    code: string,
    options: EmailOptions = {},
  ): Promise<nodemailer.SentMessageInfo> {
    const message = this.sanitize(options.message || 'Verify your account');
    const safeCode = this.sanitize(code);
    const subject = options.subject || 'Verification Code';

    return this.sendEmail(
      to,
      subject,
      otpTemplate({
        logoUrl: this.configService.get<string>(ENVEnum.EMAIL_LOGO_URL) || '',
        companyName: 'DABUEK GYEDU',
        title: '🔑 Verify Your Account',
        message,
        code: safeCode,
        validityMinutes: 10,
        footer:
          'If you did not request this code, you can safely ignore this email.',
        supportEmail: this.configService.get<string>(ENVEnum.MAIL_USER),
      }),
      `${message}\nYour verification code: ${code}`,
    );
  }

  async sendResetPasswordCodeEmail(
    to: string,
    code: string,
    options: EmailOptions = {},
  ): Promise<nodemailer.SentMessageInfo> {
    const message = this.sanitize(options.message || 'Password Reset Request');
    const safeCode = this.sanitize(code);
    const subject = options.subject || 'Password Reset Code';

    return this.sendEmail(
      to,
      subject,
      otpTemplate({
        logoUrl: this.configService.get<string>(ENVEnum.EMAIL_LOGO_URL) || '',
        companyName: 'DABUEK GYEDU',
        title: '🔒 Password Reset Request',
        message,
        code: safeCode,
        validityMinutes: 10,
        footer:
          'If you didnt request a password reset, you can safely ignore this email.',
        supportEmail: this.configService.get<string>(ENVEnum.MAIL_USER),
      }),
      `${message}\nYour password reset code: ${code}\n\nIf you did not request this, please ignore this email.`,
    );
  }

  async sendPasswordResetConfirmationEmail(
    to: string,
    options: EmailOptions = {},
  ): Promise<nodemailer.SentMessageInfo> {
    const message = this.sanitize(
      options.message || 'Password Reset Confirmation',
    );
    const subject = options.subject || 'Password Reset Confirmation';

    return this.sendEmail(
      to,
      subject,
      passwordResetConfirmationTemplate(
        message,
        this.configService.get<string>(ENVEnum.EMAIL_LOGO_URL) || '',
      ),
      message,
    );
  }

  async sendWelcomeEmail(
    to: string,
    name: string,
    password: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = 'Welcome to Our Platform - Your Account Details';
    const html = this.accountConfirmationTemplate.generateTemplate({
      clientName: this.sanitize(name),
      clientEmail: this.sanitize(to),
      password: this.sanitize(password),
      logoUrl: this.configService.get<string>(ENVEnum.EMAIL_LOGO_URL) || '',
    });
    const text = `Welcome ${name}!\n\nYour account has been created.\nEmail: ${to}\nPassword: ${password}\n\nPlease change your password after your first login.`;

    return this.sendEmail(to, subject, html, text);
  }
}
