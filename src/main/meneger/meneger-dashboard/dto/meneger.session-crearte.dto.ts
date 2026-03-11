import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplianceStatus, SessionStatus } from '@prisma';

import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class ManagerCreateSessionDto {
  @ApiProperty({
    example: 'Annual Strategy Meeting',
    description: 'Title of the session',
  })
  @IsString()
  sessionTitle: string;

  @ApiPropertyOptional({
    example: 'Discussion on yearly roadmap and KPIs',
    description: 'Session agenda',
  })
  @IsOptional()
  @IsString()
  agenda?: string;

  @ApiProperty({
    example: '2024-12-15T10:00:00Z',
    description: 'Scheduled date and time (ISO string)',
  })
  @IsString()
  scheduledAt: string;

  @ApiPropertyOptional({
    example: '30',
    description: 'Duration in minutes',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    example: 'https://meet.google.com/abc-defg-hij',
    description: 'Meeting link',
  })
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/slide.pdf', 'https://example.com/doc.pdf'],
    description: 'Session materials',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  materials?: string[];

  @ApiPropertyOptional({
    example: 'virtual',
    description: 'Session type (virtual / in-person)',
  })
  @IsOptional()
  @IsString()
  sessionType?: string;

  @ApiPropertyOptional({
    enum: SessionStatus,
    example: SessionStatus.DARFT,
    description: 'Session status',
  })
  @IsOptional()
  @IsEnum(SessionStatus)
  sessionstatus?: SessionStatus;

  @ApiPropertyOptional({
    enum: ComplianceStatus,
    example: ComplianceStatus.NOT_STARTED,
    description: 'Compliance status',
  })
  @IsOptional()
  @IsEnum(ComplianceStatus)
  sessioncompliance?: ComplianceStatus;

  @ApiPropertyOptional({
    example: [
      'a9aec789-087e-4ef9-9df3-bcb3cb37c804',
      '8d709815-6147-4bb2-b623-697b975ced9c',
      'e47b8587-f9b1-4bc8-9e6c-bfab296ed8fe',
    ],
    description: 'Array of user IDs who will participate in the huddle',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  sessionparticipantIds?: string[];
}
