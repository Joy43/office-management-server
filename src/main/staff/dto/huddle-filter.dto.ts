import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { HuddleStatus } from '@prisma';

import { IsEnum, IsOptional, IsString } from 'class-validator';

export class HuddleFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by topic',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
