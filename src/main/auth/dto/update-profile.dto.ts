import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John', description: 'Optional name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Optional avatar URL',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: '0123456789',
    description: 'phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  // Settings
  @ApiPropertyOptional({
    example: true,
    description: 'Enable login alerts notification',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isLoginAlertsNotification?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Enable two-factor authentication',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is2FAEnabled?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable email notifications',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isEmailNotificationsEnabled?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Enable SMS notifications',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isSmsNotificationsEnabled?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable push notifications',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPushNotificationsEnabled?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Receive WhatsApp notifications',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isReceiveWhatsAppNotifications?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable desktop notifications',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isDasktopNotificationsEnabled?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Receive Slack notifications',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isReceiveSlackNotifications?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Enable daily summaries',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isDailySummariesEnabled?: boolean;
}
