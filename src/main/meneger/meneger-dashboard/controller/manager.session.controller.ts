import {
  GetUser,
  ValidateInternalUser,
  ValidateMANAGER,
  ValidateTraninerMANAGER,
} from '@/core/jwt/jwt.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManagerEmployeeFilterDto } from '../dto/manager-employee-filter.dto';
import { ManagerCreateSessionDto } from '../dto/meneger.session-crearte.dto';
import { ManagerUpdateSessionStatusDto } from '../dto/meneger.update-session-status.dto';
import { MANAGERDashboarSessionService } from '../service/meneger.session.service';
import { GetAllSessionsDto } from '../dto/get-all-session.filter';

@ApiTags('MANAGER ---------- Session Management')
@Controller('MANAGER-dashboard')
export class MANAGERDashboardSessionController {
  constructor(
    private readonly MANAGERDashboardSessionService: MANAGERDashboarSessionService,
  ) {}

  // ----------create session  ---------------------
  @ApiOperation({
    summary:
      'Create a Session || speaker wise branch wise || sesssionparticipant must be in same branch || sessionparticipent user must be client admin created user id use',
  })
  @Post('session-create')
  @ApiBearerAuth()
  @ValidateMANAGER()
  async createSession(
    @GetUser('sub') speakerId: string,
    @Body() dto: ManagerCreateSessionDto,
  ) {
    return await this.MANAGERDashboardSessionService.createSession(
      speakerId,
      dto,
    );
  }

  // ----------------------- Manager manage employee orgnization straff role---
  @ApiOperation({
    summary:
      'Manager manage employee organization staff role || access manager',
  })
  @Get('get-manager-employee')
  @ApiBearerAuth()
  @ValidateMANAGER()
  async getManagerEmployee(
    @GetUser('sub') tenantId: string,
    @Query() filterDto: ManagerEmployeeFilterDto,
  ) {
    return await this.MANAGERDashboardSessionService.getManagerEmployee(
      tenantId,
      filterDto,
    );
  }

  // ---------get all sessions  ----------
 // Updated Controller
@ApiOperation({ summary: 'Get all Sessions with pagination and search' })
@Post('get-all-sessions')
@ApiBearerAuth()
@ValidateInternalUser()
async getAllSessions(
  @GetUser('sub') speakerId: string,
  @Body() dto: GetAllSessionsDto,
) {
  return await this.MANAGERDashboardSessionService.getAllSessions(
    speakerId,
    dto.page,
    dto.limit,
    dto.search,
    dto.status,
    dto.sessionType,
  );
}

  // ------------------get session by id --------------------
  @ApiOperation({ summary: 'Get Session by ID || access all roles' })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Get('get-session-by-id')
  async getSessionById(@Query('id') id: string) {
    return await this.MANAGERDashboardSessionService.getSessionById(id);
  }
  // ------------- get their own sessions  --------------------
  @ApiOperation({
    summary:
      'Get own Sessions || access manager & trainer || TWO role access it || also staff use it',
  })
  @ApiBearerAuth()
  @ValidateInternalUser()
  @Get('get-own-sessions')
  async getOwnSessions(@GetUser('sub') userId: string) {
    return await this.MANAGERDashboardSessionService.getOwnSessions(userId);
  }

  // ----------- updateSession ------------
  @ApiOperation({
    summary:
      'Update a Session || access manager & trainer || TWO role access it ||this api use also trainer flow and manager flow || speaker wise branch wise || sesssionparticipant must be in same branch || sessionparticipent user must be client admin created user id use',
  })
  @ApiBearerAuth()
  @ValidateTraninerMANAGER()
  @Patch('update-session')
  async updateSession(
    @Query('id') id: string,
    @Body() dto: ManagerCreateSessionDto,
  ) {
    return await this.MANAGERDashboardSessionService.updateSession(id, dto);
  }
  // ------------------  update session status --------------------
  @ApiOperation({
    summary:
      'Update Session Status || any role based access Their own sessions update || this api use also trainer flow and manager flow',
  })
  @ApiBearerAuth()
  @ApiBearerAuth()
  @Patch('update-session-status')
  async updateSessionStatus(
    @Query('id') id: string,
    @Body() dto: ManagerUpdateSessionStatusDto,
  ) {
    return await this.MANAGERDashboardSessionService.updateSessionStatus(
      id,
      dto,
    );
  }
  // -------------- delete session  --------------------
  @ApiOperation({
    summary:
      'Delete A Session ||access manager & trainer ||this api use also trainer flow and manager flow',
  })
  @ApiBearerAuth()
  @ValidateTraninerMANAGER()
  @Delete('delete-session')
  async deleteSession(@Query('id') id: string) {
    return await this.MANAGERDashboardSessionService.deleteSession(id);
  }
}
