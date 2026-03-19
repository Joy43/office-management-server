import { PartialType } from '@nestjs/swagger';
import { CreateBranchDto } from './create-branch-management.dto';

export class UpdateBranchManagementDto extends PartialType(CreateBranchDto) {}
