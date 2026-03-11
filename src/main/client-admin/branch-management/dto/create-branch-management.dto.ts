import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    example: 'New York Branch',
    description: 'Name of the branch',
  })
  @IsNotEmpty()
  @IsString()
  branchName: string;

  @ApiProperty({
    example: 'new-york',
    description: 'Subdomain for the branch',
  })
  @IsNotEmpty()
  @IsString()
  subdomain: string;

  @ApiProperty({
    example: 'newyork@company.com',
    description: 'Email address for the branch',
  })
  @IsNotEmpty()
  @IsEmail()
  branchEmail: string;

  @ApiProperty({
    example: '50',
    description: 'Number of staff in the branch',
  })
  @IsNotEmpty()
  @IsString()
  staffCount: string;

  // @ApiPropertyOptional({
  //   example: [
  //     'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  //     'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  //   ],
  //   description: 'Array of manager IDs to assign to this branch (optional)',
  //   type: [String],
  // })
  // @IsOptional()
  // @IsArray()
  // @IsUUID('4', { each: true })
  // managerIds?: string[];

  // @ApiProperty({
  //   example: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  //   description: 'ID of the tenant',
  // })
  // @IsNotEmpty()
  // @IsUUID()
  // tenantId: string;
}
