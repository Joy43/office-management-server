import {
  GetUser,
  ValidateInternalUser,
  ValidateMANAGER,
} from '@/core/jwt/jwt.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  MANAGERHuddlesCreateDto,
  MANAGERHuddlesUpdateDto,
} from '../dto/meneger-huddles-create';
import { MANAGERHuddlesQueryDto } from '../dto/meneger-huddles-query.dto';
import { MANAGERDashboardHuddlesService } from '../service/Huddles.service';
@ApiTags('MANAGER ---------- Huddle Management')
@Controller('MANAGER-dashboard')
export class MANAGERDashboardHuddlesController {
  constructor(
    private readonly MANAGERDashboardHuddlesService: MANAGERDashboardHuddlesService,
  ) {}

  // ----------create Huddle  ----------
  @ApiOperation({ summary: 'Create a Huddle' })
  @ValidateMANAGER()
  @ApiBearerAuth()
  @Post('create-huddles')
  async createHuddle(
    @GetUser('sub') creatorId: string,
    @Body() dto: MANAGERHuddlesCreateDto,
  ) {
    return this.MANAGERDashboardHuddlesService.createHuddle(creatorId, dto);
  }
  // ---------  get all Huddles  ----------

  @ApiOperation({
    summary: 'Get all Huddles with pagination, filter and search',
  })
  @Get('get-all-huddles')
  async getAllHuddles(@Query() query: MANAGERHuddlesQueryDto) {
    return this.MANAGERDashboardHuddlesService.getAllHuddles(query);
  }

  // -----------get huddle by id -----------
  @ApiOperation({ summary: 'Get Huddle by ID' })
  @Get('get-huddles/:id')
  async getHuddleById(@Param('id') id: string) {
    return this.MANAGERDashboardHuddlesService.getHuddleById(id);
  }
  //  --------  update Huddle  ----------
  @ApiOperation({ summary: 'Update a Huddle STATUS to completed MANAGER' })
  @ValidateMANAGER()
  @ApiBearerAuth()
  @Patch('update-huddles/:id')
  async updateHuddle(
    @Param('id') id: string,
    @Body() dto: MANAGERHuddlesUpdateDto,
  ) {
    return this.MANAGERDashboardHuddlesService.updateHuddle(id, dto);
  }

  //  --------  delete Huddle  ----------
  @ApiOperation({ summary: 'Delete a Huddle' })
  @ValidateMANAGER()
  @ApiBearerAuth()
  @Delete('delete-huddles/:id')
  async deleteHuddle(@Param('id') id: string) {
    return this.MANAGERDashboardHuddlesService.deleteHuddle(id);
  }

  /**
   * Complete own huddle
   * Any participant or creator can mark their huddle as complete
   */
  @ApiOperation({ summary: 'Complete own Huddle | only access by user' })
  @ValidateInternalUser()
  @ApiBearerAuth()
  @Patch('complete-own-huddles/:id')
  async completeOwnHuddle(
    @GetUser('sub') userId: string,
    @Param('id') huddleId: string,
  ) {
    return this.MANAGERDashboardHuddlesService.completeOwnHuddle(
      userId,
      huddleId,
    );
  }
  // -------------------- get my Huddles  -------------- only access by user----------------------
  @ApiOperation({
    summary: 'Get my Huddles | only access by user || get their own huddles',
  })
  @ValidateInternalUser()
  @ApiBearerAuth()
  @Get('my-huddles')
  async getMyHuddles(@GetUser('sub') userId: string) {
    return this.MANAGERDashboardHuddlesService.getMyHuddles(userId);
  }

  // ---------GET ALL USER Huddles INCLUDED   ----------
  @ApiOperation({
    summary:
      'Get all Huddles for ALL user Included Huddle | only access by MANAGER || using this api employee management will get all huddles',
  })
  @ValidateMANAGER()
  @ApiBearerAuth()
  @Get('get-all-user-huddles')
  async getAllUserHuddles() {
    return this.MANAGERDashboardHuddlesService.getAllUserHuddles();
  }
}
