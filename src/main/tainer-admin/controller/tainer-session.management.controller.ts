import { GetUser, ValidateTraniner } from '@/core/jwt/jwt.decorator';
import { ManagerCreateSessionDto } from '@/main/meneger/meneger-dashboard/dto/meneger.session-crearte.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TainerSessionManagementService } from '../service/tainer-session.management.service';
import { GetUpcomingSessionsDto } from '../dto/upcomming-session.dto';

@ApiTags('Tainer Admin ---------- Session Management')
@Controller('tainer-session-management')
export class TainerSessionManagementController {
  constructor(
    private readonly tainerSessionManagementService: TainerSessionManagementService,
  ) {}

  // ----------create session  ---------------------
  @ApiOperation({
    summary:
      'Create a Session || speaker wise branch wise || sesssionparticipant must be in same branch || sessionparticipent user must be client admin created user id use',
  })
  @Post('create')
  @ApiBearerAuth()
  @ValidateTraniner()
  async createSessionTainer(
    @GetUser('sub') speakerId: string,
    @Body() dto: ManagerCreateSessionDto,
  ) {
    return await this.tainerSessionManagementService.createSessionTainer(
      speakerId,
      dto,
    );
  }

  // ----------------------get upcoming session----------------------
  // Updated Controller
  @ApiOperation({
    summary:
      'Get upcoming session || access trainer || this api use also trainer flow',
  })
  @ValidateTraniner()
  @ApiBearerAuth()
  @Get('upcoming-sessions')
  getUpcomingSessions(
    @GetUser('sub') trainerId: string,
    @Query() dto: GetUpcomingSessionsDto,
  ) {
    return this.tainerSessionManagementService.getUpcomingSessions(
      trainerId,
      dto.page,
      dto.limit,
      dto.search,
    );
  }
}
