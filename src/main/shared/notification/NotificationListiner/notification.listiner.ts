import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENT_TYPES } from '../interface/event.name';

import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  BranchCreation,
  HuddleCreation,
  Notification,
  UserRegistration,
} from '../interface/events.payload';
import { NotificationGateway } from '../NotificationGateway/notifications.gateway';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent(EVENT_TYPES.USERREGISTRATION_CREATE)
  async handleUserRegistrationCreated(payload: UserRegistration) {
    this.logger.log('User Registration EVENT RECEIVED');
    this.logger.log(`Payload: ${JSON.stringify(payload, null, 2)}`);
    const info = payload.meta.info;

    if (!info?.recipients?.length) {
      this.logger.warn('No recipients found → skipping');
      return;
    }

    this.logger.log(`Total recipients: ${info.recipients.length}`);

    // Check if user has notification toggle enabled
    const enabledRecipients =
      await this.prisma.client.notificationToggle.findMany({
        where: {
          userId: { in: info.recipients.map((r) => r.id) },
          userRegistration: true,
        },
        select: { userId: true },
      });

    const enabledUserIds = new Set(enabledRecipients.map((r) => r.userId));

    for (const recipient of info.recipients) {
      if (!enabledUserIds.has(recipient.id)) {
        this.logger.log(
          `User ${recipient.id} has disabled userRegistration notifications`,
        );
        continue;
      }

      this.logger.log(
        `--- Processing recipient: ${recipient.id} (${recipient.email}) ---`,
      );

      const notificationData: Notification = {
        type: EVENT_TYPES.USERREGISTRATION_CREATE,
        title: 'New User Registered',
        message: `${info.name} has registered`,
        createdAt: new Date(),
        meta: {
          id: info.id,
          email: info.email,
          name: info.name,
          phone: info.phone,
          createdAt: info.createdAt,
          ...payload.meta.meta,
        },
      };

      // Send real-time notification via socket
      const clients = this.notificationGateway.getClientsForUser(recipient.id);
      this.logger.log(`  → Connected sockets: ${clients.size}`);

      for (const client of clients) {
        this.logger.log(`  Sending notification to socket ${client.id}`);
        client.emit(EVENT_TYPES.USERREGISTRATION_CREATE, notificationData);
        this.logger.log(
          `  ✔ Notification sent to ${recipient.id} via socket ${client.id}`,
        );
      }
    }

    this.logger.log('USERREGISTRATION_CREATE event processing complete');
  }

  // ----------------- crate branch notification -----------------

  @OnEvent(EVENT_TYPES.BRANCH_CREATE)
  async handleBranchCreated(payload: BranchCreation) {
    this.logger.log('Branch Creation EVENT RECEIVED');
    this.logger.log(`Payload: ${JSON.stringify(payload, null, 2)}`);
    const info = payload.meta.info;

    if (!info?.recipients?.length) {
      this.logger.warn('No recipients found → skipping');
      return;
    }

    this.logger.log(`Total recipients: ${info.recipients.length}`);

    // Check if user has notification toggle enabled for branch creation
    const enabledRecipients =
      await this.prisma.client.notificationToggle.findMany({
        where: {
          userId: { in: info.recipients.map((r: any) => r.id) },
        },
        select: { userId: true },
      });

    const enabledUserIds = new Set(enabledRecipients.map((r) => r.userId));

    for (const recipient of info.recipients) {
      if (!enabledUserIds.has(recipient.id)) {
        this.logger.log(
          `User ${recipient.id} has disabled createBranch notifications`,
        );
        continue;
      }

      this.logger.log(
        `--- Processing recipient: ${recipient.id} (${recipient.email}) ---`,
      );

      const notificationData: Notification = {
        type: EVENT_TYPES.BRANCH_CREATE,
        title: 'New Branch Created',
        message: `Branch "${info.branchName}" has been created`,
        createdAt: new Date(),
        meta: {
          branchId: info.branchId,
          branchName: info.branchName,
          createdBy: info.createdBy,
          createdAt: info.createdAt,
          ...payload.meta.meta,
        },
      };

      // -------------------- Send real-time notification via socket --------------------
      const clients = this.notificationGateway.getClientsForUser(recipient.id);
      this.logger.log(`  → Connected sockets: ${clients.size}`);

      for (const client of clients) {
        this.logger.log(`  Sending notification to socket ${client.id}`);
        client.emit(EVENT_TYPES.BRANCH_CREATE, notificationData);
        this.logger.log(
          `  ✔ Notification sent to ${recipient.id} via socket ${client.id}`,
        );
      }
    }

    this.logger.log('BRANCH_CREATE event processing complete');
  }

  // ----------------- create huddle notification -----------------

  @OnEvent(EVENT_TYPES.HUDDLE_CREATE)
  async handleHuddleCreated(payload: HuddleCreation) {
    this.logger.log('Huddle Creation EVENT RECEIVED');
    this.logger.log(`Payload: ${JSON.stringify(payload, null, 2)}`);
    const info = payload.meta.info;

    if (!info?.recipients?.length) {
      this.logger.warn('No recipients found → skipping');
      return;
    }

    this.logger.log(`Total recipients: ${info.recipients.length}`);

    // Check if user has notification toggle enabled for huddle creation
    const enabledRecipients =
      await this.prisma.client.notificationToggle.findMany({
        where: {
          userId: { in: info.recipients.map((r) => r.id) },
        },
        select: { userId: true },
      });

    const enabledUserIds = new Set(enabledRecipients.map((r) => r.userId));

    for (const recipient of info.recipients) {
      if (!enabledUserIds.has(recipient.id)) {
        this.logger.log(
          `User ${recipient.id} has disabled createHuddle notifications`,
        );
        continue;
      }

      this.logger.log(
        `--- Processing recipient: ${recipient.id} (${recipient.email}) ---`,
      );

      const notificationData: Notification = {
        type: EVENT_TYPES.HUDDLE_CREATE,
        title: 'New Huddle Created',
        message: `Huddle "${info.topic}" has been scheduled`,
        createdAt: new Date(),
        meta: {
          huddleId: info.huddleId,
          huddleName: info.topic,
          createdBy: info.createdBy,
          createdAt: info.createdAt,
          ...payload.meta.meta,
        },
      };

      // Send real-time notification via socket
      const clients = this.notificationGateway.getClientsForUser(recipient.id);
      this.logger.log(`  → Connected sockets: ${clients.size}`);

      for (const client of clients) {
        this.logger.log(`  Sending notification to socket ${client.id}`);
        client.emit(EVENT_TYPES.HUDDLE_CREATE, notificationData);
        this.logger.log(
          `  ✔ Notification sent to ${recipient.id} via socket ${client.id}`,
        );
      }
    }

    this.logger.log('HUDDLE_CREATE event processing complete');
  }
}
