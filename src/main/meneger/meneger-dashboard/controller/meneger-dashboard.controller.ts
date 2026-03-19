import {
  ValidateInternalUser,
  ValidateMANAGER,
} from '@/core/jwt/jwt.decorator';
import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MANAGERDashboardService } from '../service/meneger-dashboard.service';

@ApiTags('MANAGER--------------------------- Dashboard Management')
@Controller('MANAGER-dashboard')
export class MANAGERDashboardController {
  constructor(
    private readonly MANAGERDashboardService: MANAGERDashboardService,
  ) {}

  // -----------------manager dashboard organization overview----------------------

  // @ApiOperation({ summary: 'Get Manager Dashboard' })
  // @ValidateMANAGER()
  // @ApiBearerAuth()
  // @Get('get-manager-dashboard')
  // async getDashboardOrganizationOverview(@GetUser('sub') tenentId: string) {
  //   return this.MANAGERDashboardService.getDashboardOrganizationOverview();
  // }

  // ----------- create huddle alert----------
  @ApiOperation({ summary: 'GetCreate Huddle Alert' })
  @ValidateMANAGER()
  @ApiBearerAuth()
  @Get('get-huddle-alert')
  async GetcreateHuddleAlert() {
    return this.MANAGERDashboardService.GetcreateHuddleAlert();
  }

  // ----------------GET Recent Sessions------------------------
  @ApiOperation({
    summary: 'Get Recent Coaching Logs || access manager & trainer ',
  })
  @ValidateInternalUser()
  @ApiBearerAuth()
  @Get('get-recent-coaching-logs || use it also for trainer flow also')
  async getRecentSessions() {
    return this.MANAGERDashboardService.getRecentSessions();
  }

  // -------------Coaching Logs overview--------------------
  @ApiOperation({ summary: 'Get Coaching Logs Overview' })
  @ValidateMANAGER()
  @ApiBearerAuth()
  @Get('get-coaching-logs-overview')
  async getCoachingLogsOverview() {
    return this.MANAGERDashboardService.getCoachingLogsOverview();
  }

  // ------------- Organization Overview -----------------
  @ApiOperation({ summary: 'Get Organization Overview' })
  @ApiBearerAuth()
  @ValidateMANAGER()
  @Get('get-organization-overview')
  async getOrganizationOverview(@Req() req: any) {
    return this.MANAGERDashboardService.getOrganizationOverview(
      req.user.tenantId,
    );
  }
}
