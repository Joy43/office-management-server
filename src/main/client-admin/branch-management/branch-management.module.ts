import { Module } from '@nestjs/common';
import { BranchManagementController } from './controller/branch-management.controller';
import { BranchManagementService } from './service/branch-management.service';

@Module({
  controllers: [BranchManagementController],
  providers: [BranchManagementService],
})
export class BranchManagementModule {}
