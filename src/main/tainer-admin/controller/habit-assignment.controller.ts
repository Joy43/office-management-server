// ============= CONTROLLER =============

// habit-assignment.controller.ts
import {
  GetUser,
  ValidateTraniner,
  ValidateTraninerMANAGER,
} from '@/core/jwt/jwt.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateScoreHabitsDto } from '../dto/create-score-habits.dto';
import { GetAssignedTeamMembersDto } from '../dto/get-assigned-team-members.dto';
import { GetUsersWithHuddlesSessionsDto } from '../dto/get-users-with-huddles-sessions.dto';
import { HabitAssignmentService } from '../service/habit-assignment.service';
import { CacheStrategy } from '@/core/cache';

@ApiTags('Tainer Admin ----------------------- Habit Assignment')
@Controller('habit-assignment')
export class HabitAssignmentController {
  constructor(
    private readonly habitAssignmentService: HabitAssignmentService,
  ) {}

  //   --------------------- Get Assigned Team Members with Habit Tracking ---------------------
  @ApiOperation({
    summary: 'Get assigned team members with habit tracking',
  })
  @CacheStrategy('branches:detail', 15 * 60 * 1000)
  @ValidateTraniner()
  @ApiBearerAuth()
  @Get('assigned-team-members')
  async getAssignedTeamMembers(
    @GetUser('sub') managerId: string,
    @Query() dto: GetAssignedTeamMembersDto,
  ) {
    return this.habitAssignmentService.getAssignedTeamMembers(managerId, dto);
  }

  //   --------------------- Create Score and Habits for Team Member ---------------------
  @ApiOperation({
    summary: 'Create score and habits for team member',
  })
  @ValidateTraniner()
  @ApiBearerAuth()
  @Post('create-score')
  async createScoreAndHabits(
    @GetUser('sub') managerId: string,
    @Body() dto: CreateScoreHabitsDto,
  ) {
    return this.habitAssignmentService.createScoreAndHabits(managerId, dto);
  }

  // -------------get all user for iclude huddle & session include -----------------------
  @ApiOperation({
    summary: 'Get all users with their accessible huddles and sessions',
    description:
      "Retrieves all users in the manager's branch with detailed information about their huddles and sessions, including analytics and participation data",
  })
  @ValidateTraninerMANAGER()
  @ApiBearerAuth()
  @Get('users-with-huddles-sessions')
  async getUsersWithHuddlesAndSessions(
    @GetUser('sub') managerId: string,
    @Query() dto: GetUsersWithHuddlesSessionsDto,
  ) {
    return this.habitAssignmentService.getUsersWithHuddlesAndSessions(
      managerId,
      dto,
    );
  }
}
