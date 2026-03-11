// DTO for pagination and search
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class GetUpcomingSessionsDto {
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
    description: 'Search by session title',
    example: 'Training Session' 
  })
  @IsOptional()
  @IsString()
  search?: string;
}