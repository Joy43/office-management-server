import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantStatus } from '@prisma';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Company or tenant name',
  })
  @IsString()
  @MinLength(2)
  companyName: string;

  @ApiProperty({
    example: 'acme',
    description: 'Unique subdomain for the tenant',
  })
  @IsString()
  @MinLength(2)
  subdomain: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Official company email address',
  })
  @IsEmail()
  companyEmail: string;

  @ApiPropertyOptional({
    enum: TenantStatus,
    example: TenantStatus.ACTIVE,
    description: 'Current tenant status',
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiPropertyOptional({
    example: 'en',
    description: 'Default language/locale of the tenant',
  })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({
    example: 'f0f0764f-530a-4d81-8186-c1a392a9cf26',
    description: 'Subscription plan identifier for the tenant',
  })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional({
    example: 'Africa/Accra',
    description: 'Tenant timezone',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
