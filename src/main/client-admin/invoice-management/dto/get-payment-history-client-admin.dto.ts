// dto/get-client-admin-payment-history.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetClientAdminPaymentHistoryDto {
  @ApiPropertyOptional({
    example: 'STARTER',
    description: 'Search by subscription plan name or plan title',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: '6 MONTH',
    description: 'Filter by subscription duration (e.g. 6 MONTH)',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
