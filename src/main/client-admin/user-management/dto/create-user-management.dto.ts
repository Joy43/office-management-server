import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserClientAdminDto {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  // @ApiPropertyOptional({
  //   example: '12345678',
  //   description:
  //     'Password (min 8 characters). Defaults to "12345678" if not provided',
  // })
  // @IsOptional()
  // @MinLength(6)
  // password?: string;

  @ApiProperty({
    example: 'TAINER',
    description:
      'User role seclected. when role select MANAGER , then auto assign branch  as id wise',
    enum: UserRole,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    example: 'uuid-of-branch',
    description: 'Branch ID',
  })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
