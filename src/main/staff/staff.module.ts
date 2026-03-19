import { Module } from '@nestjs/common';
import { StaffDashboardController } from './controller/staff.dashboard.controller';
import { StaffHabitsController } from './controller/staff.habits.controller';
import { StaffMyHabitsController } from './controller/staff.my-habit.controller';
import { StaffMySessionsController } from './controller/staff.my-session.controller';
import { StaffDashboardService } from './service/staff.dashboard.service';
import { StaffHabitsService } from './service/staff.habits.service';

import { StaffMySessionsService } from './service/staff.my-sessions.service';

@Module({
  controllers: [
    StaffDashboardController,
    StaffMySessionsController,
    StaffMyHabitsController,
    StaffHabitsController,
  ],
  providers: [
    StaffDashboardService,
    StaffMySessionsService,
  
    StaffHabitsService,
  ],
})
export class StaffModule {}
