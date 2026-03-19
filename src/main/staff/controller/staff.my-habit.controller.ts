import { GetUser, ValidateInternalUser } from '@/core/jwt/jwt.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HuddleFilterDto } from '../dto/huddle-filter.dto';
import { StaffMySessionsService } from '../service/staff.my-sessions.service';

import { MyHabitsSearchDto } from '../dto/my-habits.search.dto';
import { StaffHabitsService } from '../service/staff.habits.service';

@ApiTags('Staff ---------------------- My Habits')
@Controller('staff-habits')
export class StaffMyHabitsController {
  constructor(
    private readonly staffMyHabitsService: StaffHabitsService,
  ) {}

  // -------------GET MY Habits  --------------------
  @ApiOperation({ summary: 'Get My Habits All roles supported this api' })
  @ValidateInternalUser()
  @ApiBearerAuth()
  @Get('get-my-habits')
  async getMyHabits(
    @GetUser('sub') staffId: string,
    @Query() filterDto: MyHabitsSearchDto,
  ) {
    return await this.staffMyHabitsService.getMyHabits(staffId, filterDto);
  }
}
