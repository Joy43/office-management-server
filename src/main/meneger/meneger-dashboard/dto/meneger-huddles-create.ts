import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { HuddleStatus } from '@prisma';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MANAGERHuddlesCreateDto {
  @ApiProperty({
    example: 'Weekly Team Sync',
    description: 'Topic of the huddle',
  })
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiPropertyOptional({
    example: '15',
    description: 'Duration of the huddle in minutes',
    default: '15',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    example: 'https://meet.google.com/abc-defg-hij',
    description: 'Meeting link for the huddle',
  })
  @IsOptional()
  @IsString()
  meetLink?: string;

  @ApiPropertyOptional({
    example: 'scheduled',
    description: 'Status of the huddle',
    enum: HuddleStatus,
    default: HuddleStatus.scheduled,
  })
  @IsOptional()
  @IsEnum(HuddleStatus)
  HuddleStatus?: HuddleStatus;

  @ApiProperty({
    example: '09:00',
    description: 'Start time of the huddle (HH:mm format)',
  })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({
    example: '2026-01-15',
    description: 'Selected date for the huddle (YYYY-MM-DD format)',
  })
  @IsNotEmpty()
  @IsString()
  selectedDate: string;

  @ApiPropertyOptional({
    example: '735dddbf-33a8-4c59-be4c-d2e9f47b666d',
    description: 'Branch ID for the huddle',
  })
  @IsOptional()
  @IsUUID()
  branchId?: string;

  @ApiPropertyOptional({
    example: [
      '23e0333b-88a1-4b92-b2a8-5707b9cd239f',
      'a200f3eb-2d14-4c9a-a246-942e14ae09ec',
      'e47b8587-f9b1-4bc8-9e6c-bfab296ed8fe',
    ],
    description: 'Array of user IDs who will participate in the huddle',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  participantIds?: string[];
}

export class MANAGERHuddlesUpdateDto extends PartialType(
  MANAGERHuddlesCreateDto,
) {}
