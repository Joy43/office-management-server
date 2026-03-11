import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum HabitFrequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export enum HabitCompletionStatus {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export class MyHabitsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by completion status',
    enum: HabitCompletionStatus,
    default: HabitCompletionStatus.ALL,
  })
  @IsOptional()
  @IsEnum(HabitCompletionStatus)
  status?: HabitCompletionStatus = HabitCompletionStatus.ALL;

  @ApiPropertyOptional({
    description: 'Filter by coach/assigner ID',
  })
  @IsOptional()
  @IsString()
  coachId?: string;

  @ApiPropertyOptional({
    description: 'Search habits by title',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
