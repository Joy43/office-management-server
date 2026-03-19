import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGlobalTemplateDto {
  @ApiProperty({
    example: 'Customer Feedback Template',
    description: 'Name of the template',
  })
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiPropertyOptional({
    example: 'survey',
    description: 'Template type',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    example: '15',
    description: 'Time limit in minutes',
  })
  @IsOptional()
  @IsString()
  timeLimit?: string;

  @ApiPropertyOptional({
    example: {
      title: 'Feedback Form',
      fields: [
        { label: 'Name', type: 'text', required: true },
        { label: 'Rating', type: 'number', required: true },
      ],
    },
    description: 'Template JSON content',
  })
  @IsOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional({
    example: true,
    description: 'Is global template',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;
}
