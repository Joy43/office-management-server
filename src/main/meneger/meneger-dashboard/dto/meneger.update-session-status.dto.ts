import { ApiProperty } from '@nestjs/swagger';
import { ComplianceStatus, SessionStatus } from '@prisma';
import { IsEnum } from 'class-validator';

export class ManagerUpdateSessionStatusDto {
  @ApiProperty({
    example: 'COMPLETED',
    description: 'Session status',
    enum: SessionStatus,
  })
  @IsEnum(SessionStatus)
  sessionstatus: SessionStatus;

  @ApiProperty({
    example: 'NOT_STARTED',
    description: 'Session compliance status',
    enum: ComplianceStatus,
  })
  @IsEnum(ComplianceStatus)
  sessioncompliance: ComplianceStatus;
}
