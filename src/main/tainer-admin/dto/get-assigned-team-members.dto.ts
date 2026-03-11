// dto/get-assigned-team-members.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum HabitStatusFilter {
  GREAT = 'GREAT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  POOR = 'POOR',
}

export class GetAssignedTeamMembersDto {
  @ApiPropertyOptional({ 
    description: 'Page number', 
    default: 1,
    minimum: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page', 
    default: 10,
    minimum: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Search by name, email, or phone',
    example: 'John Doe' 
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by status',
    enum: HabitStatusFilter,
    example: HabitStatusFilter.GREAT
  })
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsEnum(HabitStatusFilter)
  status?: HabitStatusFilter;
}