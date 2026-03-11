import { Module } from '@nestjs/common';
import { DashboardTemplateService } from './dashboard-template.service';
import { DashboardTemplateController } from './dashboard-template.controller';

@Module({
  controllers: [DashboardTemplateController],
  providers: [DashboardTemplateService],
})
export class DashboardTemplateModule {}
