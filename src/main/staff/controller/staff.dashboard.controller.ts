import { GetUser, ValidateStaff } from '@/core/jwt/jwt.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HabitAnalysisFilterDto } from '../dto/habit-analysis-filter.dto';
import { StaffDashboardService } from '../service/staff.dashboard.service';

@ApiTags('Staff-------------Dashboard')
@Controller('staff/dashboard')
export class StaffDashboardController {
  constructor(private readonly staffDashboardService: StaffDashboardService) {}

  @ApiOperation({ summary: 'Get Dashboard Data' })
  @ValidateStaff()
  @ApiBearerAuth()
  @Get()
  async getStaffDashboardData(@GetUser('sub') staffId: string) {
    return this.staffDashboardService.getStaffDashboardData(staffId);
  }

  // --------- habit analysis data graph-----------------
  @ApiOperation({
    summary: 'Get Habit Analysis Graph Data',
    description:
      'Get habit analytics with filtering by period (Weekly, Monthly, Yearly)',
  })
  @ValidateStaff()
  @ApiBearerAuth()
  @Get('habit-analysis')
  async getHabitAnalysisGraphData(
    @GetUser('sub') staffId: string,
    @Query() filterDto: HabitAnalysisFilterDto,
  ) {
    return this.staffDashboardService.getHabitAnalysisGraphData(
      staffId,
      filterDto,
    );
  }

  //  ----------- TODAY huddle only assined my assinged huddle -----
  @ApiOperation({ summary: 'Get Today Huddle Data' })
  @ValidateStaff()
  @ApiBearerAuth()
  @Get('today-huddle')
  async getTodayHuddleData(@GetUser('sub') staffId: string) {
    return this.staffDashboardService.getTodayHuddleData(staffId);
  }
}
