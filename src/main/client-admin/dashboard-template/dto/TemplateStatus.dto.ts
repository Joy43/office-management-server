import { ApiProperty } from '@nestjs/swagger';
import { TempleteStatus } from '@prisma';
import { IsEnum } from 'class-validator';

export class UpdateTemplateStatusDto {
  @ApiProperty({
    description: 'Status of the template',
    enum: TempleteStatus,
    example: TempleteStatus.COMPLETED,
  })
  @IsEnum(TempleteStatus)
  templatestatus: TempleteStatus;
}
