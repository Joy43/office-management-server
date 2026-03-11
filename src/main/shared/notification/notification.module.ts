import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './NotificationGateway/notifications.gateway';
import { NotificationListener } from './NotificationListiner/notification.listiner';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationGateway,
    NotificationListener,
    JwtService,
  ],
  imports: [],
})
export class NotificationModule {}
