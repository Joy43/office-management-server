import { GetUser, ValidateInternalUser } from '@/core/jwt/jwt.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HuddleFilterDto } from '../dto/huddle-filter.dto';
import { StaffMySessionsService } from '../service/staff.my-sessions.service';

@ApiTags('Staff-------------My Sessions')
@Controller('staff-sessions')
export class StaffMySessionsController {
  constructor(
    private readonly staffMySessionsService: StaffMySessionsService,
  ) {}

  // -------------GET MY Haddle  --------------------
  @ApiOperation({ summary: 'Get My Huddle All roles supported this api' })
  @ValidateInternalUser()
  @ApiBearerAuth()
  @Get('get-my-huddles')
  async getMyHaddle(
    @GetUser('sub') staffId: string,
    @Query() filterDto: HuddleFilterDto,
  ) {
    return await this.staffMySessionsService.getMyHaddle(staffId, filterDto);
  }
}
