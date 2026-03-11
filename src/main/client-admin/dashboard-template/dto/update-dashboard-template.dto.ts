import { PartialType } from '@nestjs/swagger';
import { CreateDashboardTemplateDto } from './create-dashboard-template.dto';

export class UpdateDashboardTemplateDto extends PartialType(CreateDashboardTemplateDto) {}
