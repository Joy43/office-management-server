import { GetUser, ValidateStaff } from '@/core/jwt/jwt.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MyHabitsFilterDto } from '../dto/my-habits-filter.dto';
import { StaffHabitsService } from '../service/staff.habits.service';

@ApiTags('Staff-------------My Habits')
@Controller('staff/my-habits')
export class StaffHabitsController {
  constructor(private readonly staffHabitsService: StaffHabitsService) {}

  @ApiOperation({
    summary: 'Get My Assigned Habits',
    description:
      'Get all habits assigned to the staff member, grouped by coaches/assigners',
  })
  @ValidateStaff()
  @ApiBearerAuth()
  @Get()
  async getMyHabits(
    @GetUser('sub') staffId: string,
    @Query() filterDto: MyHabitsFilterDto,
  ) {
    return this.staffHabitsService.getMyHabits(staffId, filterDto);
  }

  @ApiOperation({
    summary: 'Get Habits Assigned by Specific Coach',
    description: 'Get all habits assigned by a specific coach/assigner',
  })
  @ValidateStaff()
  @ApiBearerAuth()
  @Get('coach/:coachId')
  async getHabitsByCoach(
    @GetUser('sub') staffId: string,
    @Param('coachId') coachId: string,
  ) {
    return this.staffHabitsService.getHabitsByCoach(staffId, coachId);
  }

  @ApiOperation({
    summary: 'Mark Habit as Completed',
    description: 'Mark a habit as completed for today',
  })
  @ValidateStaff()
  @ApiBearerAuth()
  @Post(':habitId/complete')
  async markHabitCompleted(
    @GetUser('sub') staffId: string,
    @Param('habitId') habitId: string,
    @Body('proofUrl') proofUrl?: string,
  ) {
    return this.staffHabitsService.markHabitCompleted(
      staffId,
      habitId,
      proofUrl,
    );
  }

  @ApiOperation({
    summary: 'Unmark Habit (Mark as Incomplete)',
    description: 'Mark a habit as incomplete for today',
  })
  @ValidateStaff()
  @ApiBearerAuth()
  @Patch(':habitId/uncomplete')
  async unmarkHabitCompleted(
    @GetUser('sub') staffId: string,
    @Param('habitId') habitId: string,
  ) {
    return this.staffHabitsService.unmarkHabitCompleted(staffId, habitId);
  }
}
