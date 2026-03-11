import { Module } from '@nestjs/common';
import { PlatformRevenueService } from './platform-revenue.service';
import { PlatformRevenueController } from './platform-revenue.controller';

@Module({
  controllers: [PlatformRevenueController],
  providers: [PlatformRevenueService],
})
export class PlatformRevenueModule {}
