// ============= DTOs =============

// dto/create-score-habits.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class HabitScoreItemDto {
  @ApiProperty({
    description: 'Habit category name',
    example: 'Empathy',
  })
  @IsString()
  @IsNotEmpty()
  habitName: string;

  @ApiProperty({
    description: 'Score from 1 to 5',
    minimum: 1,
    maximum: 5,
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}

export class CreateScoreHabitsDto {
  @ApiProperty({
    description: 'User ID to create score for',
    example: 'user-uuid-here',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Array of habit scores',
    type: [HabitScoreItemDto],
    example: [
      { habitName: 'Empathy', score: 3 },
      { habitName: 'Communication', score: 4 },
      { habitName: 'Problem Solving', score: 2 },
      { habitName: 'Tone of Voice', score: 5 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitScoreItemDto)
  habitScores: HabitScoreItemDto[];

  @ApiPropertyOptional({
    description: 'Feedback notes',
    example: 'Great improvement this week',
  })
  @IsOptional()
  @IsString()
  feedbackNotes?: string;

  @ApiPropertyOptional({
    description: 'Assessment text',
    example: 'Overall performance is good',
  })
  @IsOptional()
  @IsString()
  assessmentText?: string;

  @ApiPropertyOptional({
    description: 'Additional habit name to create',
    example: 'Time Management',
  })
  @IsOptional()
  @IsString()
  additionalHabitName?: string;

  @ApiPropertyOptional({
    description: 'Additional habit description',
    example: 'Focus on managing time effectively',
  })
  @IsOptional()
  @IsString()
  additionalHabitDescription?: string;
}
