import { PartialType } from '@nestjs/swagger';
import { CreatePlatformRevenueDto } from './create-platform-revenue.dto';

export class UpdatePlatformRevenueDto extends PartialType(CreatePlatformRevenueDto) {}
