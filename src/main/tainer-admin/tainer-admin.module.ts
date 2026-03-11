import { Module } from '@nestjs/common';
import { HabitAssignmentController } from './controller/habit-assignment.controller';
import { TainerAdminDashboardController } from './controller/tainer-dashboard.controller';
import { TainerSessionManagementController } from './controller/tainer-session.management.controller';
import { HabitAssignmentService } from './service/habit-assignment.service';
import { TainerAdminDashboardService } from './service/tainer-dashboard.service';
import { TainerSessionManagementService } from './service/tainer-session.management.service';

@Module({
  controllers: [
    TainerAdminDashboardController,
    TainerSessionManagementController,
    HabitAssignmentController,
  ],
  providers: [
    TainerAdminDashboardService,
    TainerSessionManagementService,
    HabitAssignmentService,
  ],
})
export class TainerAdminModule {}
