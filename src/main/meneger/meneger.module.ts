import { Module } from '@nestjs/common';
import { MANAGERDashboardHuddlesController } from './meneger-dashboard/controller/Huddles.controller';
import { MANAGERDashboardSessionController } from './meneger-dashboard/controller/manager.session.controller';
import { MANAGERDashboardController } from './meneger-dashboard/controller/meneger-dashboard.controller';
import { MANAGERDashboardHuddlesService } from './meneger-dashboard/service/Huddles.service';
import { MANAGERDashboardService } from './meneger-dashboard/service/meneger-dashboard.service';
// import { SchedulerHuddlesService } from './meneger-dashboard/service/scheduler-huddles.service';
import { MANAGERDashboarSessionService } from './meneger-dashboard/service/meneger.session.service';

@Module({
  controllers: [
    MANAGERDashboardController,
    MANAGERDashboardHuddlesController,
    MANAGERDashboardSessionController,
  ],
  providers: [
    MANAGERDashboardService,
    MANAGERDashboardHuddlesService,
    // SchedulerHuddlesService,
    MANAGERDashboarSessionService,
  ],
  imports: [],
})
export class MANAGERModule {}
