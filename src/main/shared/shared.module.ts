import { Module } from '@nestjs/common';

import { NotificationModule } from './notification/notification.module';

@Module({
  controllers: [],
  providers: [],
  imports: [NotificationModule],
})
export class SharedModule {}
