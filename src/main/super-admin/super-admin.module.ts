import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/tenant.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { GlobalTemplateModule } from './global-template/global-template.module';
import { PlatformRevenueModule } from './platform-revenue/platform-revenue.module';
@Module({
  controllers: [],
  providers: [],
  imports: [TenantModule,SubscriptionPlanModule, GlobalTemplateModule, PlatformRevenueModule]
})
export class SuperAdminModule {}
