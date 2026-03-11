import { Module } from '@nestjs/common';
import { BranchManagementModule } from './branch-management/branch-management.module';
import { UserManagementModule } from './user-management/user-management.module';
import { InvoiceManagementModule } from './invoice-management/invoice-management.module';
import { DashboardTemplateModule } from './dashboard-template/dashboard-template.module';


@Module({
  controllers: [],
  providers: [],
  imports: [BranchManagementModule, UserManagementModule, InvoiceManagementModule, DashboardTemplateModule],
})
export class ClientAdminModule {}
