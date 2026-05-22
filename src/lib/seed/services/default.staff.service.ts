import { UserEnum } from '@/common/enum/user.enum';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { AuthUtilsService } from '@/lib/utils/services/auth-utils.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DefaultUsersService implements OnModuleInit {
  private readonly logger = new Logger(DefaultUsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly authUtils: AuthUtilsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultUsers();
  }

  private async seedDefaultUsers(): Promise<void> {
    const users = [
      {
        name: 'StaffOne',
        email: 'staff@gmail.com',
        password: '12345678',
        role: 'STAFF',
        profilePicture: 'https://i.pravatar.cc/200?img=12',
        phone: '123538545329899',
      },
      {
        name: 'CLEINT ADMIN',
        email: 'executive@gmail.com',
        password: '12345678',
        role: 'CLIENT_ADMIN',
        profilePicture: 'https://i.pravatar.cc/200?img=59',
        phone: '123869322899',
      },

      {
        name: 'EXECUTIVE',
        email: 'executive@gmail.com',
        password: '12345678',
        role: 'EXECUTIVE',
        profilePicture: 'https://i.pravatar.cc/200?img=59',
        phone: '123869322899',
      },
      {
        name: 'MANAGER',
        email: 'manager@gmail.com',
        password: '12345678',
        role: 'MANAGER',
        profilePicture: 'https://i.pravatar.cc/200?img=59',
        phone: '1238656922899',
      },
      {
        name: 'TAINER',
        email: 'trainer@gmail.com',
        password: '12345678',
        role: 'TAINER',
        profilePicture: 'https://i.pravatar.cc/200?img=59',
        phone: '1238656922899',
      },
    ];
    for (const user of users) {
      const exists = await this.prisma.client.user.findFirst({
        where: { email: user.email },
      });

      if (!exists) {
        await this.prisma.client.user.create({
          data: {
            name: user.name,
            email: user.email,
            password: await this.authUtils.hash(user.password),
            role: user.role as UserEnum,
            isVerified: true,
            lastLoginAt: new Date(),
            lastActiveAt: new Date(),
          },
        });

        this.logger.log(`[CREATE] User created: ${user.email}`);
      } else {
        await this.prisma.client.user.update({
          where: { email: user.email },
          data: {
            role: user.role as UserEnum,
            isVerified: true,
            lastActiveAt: new Date(),
          },
        });

        this.logger.log(`[UPDATE] User updated: ${user.email}`);
      }
    }
  }
}
