import { BaseFilter } from '@/lib/filter/baseFilter';
import { PickType } from '@nestjs/swagger';

export class TemplateFilterDto extends PickType(BaseFilter, [
  'search',
  'page',
  'limit',
  'isActive',
]) {}
