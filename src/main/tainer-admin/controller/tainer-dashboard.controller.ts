import { Controller, Get } from '@nestjs/common';

import { GetUser, ValidateTraniner } from '@/core/jwt/jwt.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TainerAdminDashboardService } from '../service/tainer-dashboard.service';

@ApiTags('Tainer Admin ----------------------Dashboard Management')
@Controller('tainer-admin-dashboard')
export class TainerAdminDashboardController {
  constructor(
    private readonly tainerAdminDashboardService: TainerAdminDashboardService,
  ) {}

  @ApiOperation({
    summary:
      'Get  getTainerDashboardOverview || access trainer || this api use also trainer flow',
  })
  @ValidateTraniner()
  @ApiBearerAuth()
  @Get()
  getTainerDashboardOverview(@GetUser('sub') trainerId: string) {
    return this.tainerAdminDashboardService.getTainerDashboardOverview(
      trainerId,
    );
  }

  
}
