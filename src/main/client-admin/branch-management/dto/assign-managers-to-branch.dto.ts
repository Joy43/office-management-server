import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignManagersToBranchDto {
  @ApiProperty({
    example: [
      'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    ],
    description: 'Array of manager user IDs to assign',
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  managerIds: string[];
}
