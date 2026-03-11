import { ApiPropertyOptional } from '@nestjs/swagger';
import { HuddleStatus } from '@prisma';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class MANAGERHuddlesQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'Team Sync',
    description: 'Search by huddle topic',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'scheduled',
    description: 'Filter by huddle status',
    enum: HuddleStatus,
  })
  @IsOptional()
  @IsEnum(HuddleStatus)
  status?: HuddleStatus;


  @ApiPropertyOptional({
    example: '2026-01-15',
    description: 'Filter by selected date (YYYY-MM-DD format)',
  })
  @IsOptional()
  @IsString()
  selectedDate?: string;
}
