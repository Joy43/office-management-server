import { MailService } from '@/lib/mail/mail.service';
import { AccountConfirmationTemplate } from '@/lib/mail/templates/acount-confimation.template';
import { Module } from '@nestjs/common';
import { TenantManageService } from './service/tenant.manage.service';
import { TenantService } from './service/tenant.service';
import { TenantController } from './tenant.controller';

@Module({
  controllers: [TenantController],
  providers: [
    TenantService,
    MailService,
    AccountConfirmationTemplate,
    TenantManageService
  ],
})
export class TenantModule {}
