import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum RevenueFilterType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class RevenueFilterDto {
  @ApiPropertyOptional({
    enum: RevenueFilterType,
    example: RevenueFilterType.MONTHLY,
  })
  @IsOptional()
  @IsEnum(RevenueFilterType)
  filter?: RevenueFilterType;
}

export class TotalOrderListDto {
  @ApiPropertyOptional({
    example: 'tenant name or invoice id',
    description: 'Search by tenant name or invoice id',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
}
