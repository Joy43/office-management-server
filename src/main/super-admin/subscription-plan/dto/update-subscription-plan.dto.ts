import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './create-subscription-plan.dto';

export class UpdateSubscriptionPlanDto extends PartialType(
  CreateSubscriptionDto,
) {}
