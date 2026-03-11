import { PartialType } from '@nestjs/swagger';
import { CreateExcutiveDto } from './create-excutive.dto';

export class UpdateExcutiveDto extends PartialType(CreateExcutiveDto) {}
