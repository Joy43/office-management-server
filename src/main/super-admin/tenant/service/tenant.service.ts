import { MailService } from '@/lib/mail/mail.service';
import { AccountConfirmationTemplate } from '@/lib/mail/templates/acount-confimation.template';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateTenantDto } from '../dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly accountConfirmationTemplate: AccountConfirmationTemplate,
  ) {}

async createTenant(createTenantDto: CreateTenantDto) {
  const [emailExists, subdomainExists] = await Promise.all([
    this.prisma.client.tenant.findUnique({
      where: { companyEmail: createTenantDto.companyEmail },
    }),
    this.prisma.client.tenant.findUnique({
      where: { subdomain: createTenantDto.subdomain },
    }),
  ]);

  if (emailExists) {
    throw new BadRequestException('Tenant already exists with this email');
  }

  if (subdomainExists) {
    throw new BadRequestException(
      'Tenant already exists with this subdomain',
    );
  }

  const password = randomBytes(8).toString('hex');
  const hashedPassword = await bcrypt.hash(password, 10);

  let createdUser;

  try {
    createdUser = await this.prisma.client.$transaction(async (trx) => {
      
      const user = await trx.user.create({
        data: {
          email: createTenantDto.companyEmail,
          password: hashedPassword,
          role: UserRole.CLIENT_ADMIN,
          name: createTenantDto.companyName,
          tenant: {
            create: {
              subdomain: createTenantDto.subdomain,
              companyEmail: createTenantDto.companyEmail,
              companyName: createTenantDto.companyName,
            },
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          tenant: {
            select: {
              id: true,
              subdomain: true,
            },
          },
        },
      });

     
      const plan = await trx.subscription.findFirst({
        where: {
          id: createTenantDto.planId,
        },
      });

      if (!plan) {
        throw new BadRequestException('Your selected plan does not exist');
      }

      const invoice = await trx.invoice.create({
        data: {
          tenantId: user.tenant!.id,
          subscriptionId: createTenantDto.planId,
          status: 'pending',
          amount: plan.amount!,
          paidAt: new Date(),
          currency: 'USD',
          dueDate: new Date(),
        },
      });

      await trx.revenue.create({
        data: {
          invoiceId: invoice.id,
          amount: plan.amount!,
          currency: 'USD',
          source: 'invoice',
          receivedAt: new Date(),
        },
      });

      return user;
    });

    await this.mailService.sendMail({
      to: createTenantDto.companyEmail,
      subject: 'Account Confirmation',
      text: 'Account Confirmation',
      html: await this.accountConfirmationTemplate.generateTemplate({
        clientName: createTenantDto.companyName,
        clientEmail: createTenantDto.companyEmail,
        password,
      }),
    });

    return createdUser;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new BadRequestException('Tenant already exists');
    }
    
    throw error;
  }
}
}
