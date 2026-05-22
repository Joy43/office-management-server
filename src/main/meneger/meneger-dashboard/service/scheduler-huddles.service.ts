import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerHuddlesService {
  private readonly logger = new Logger(SchedulerHuddlesService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async autoCompleteHuddles() {
    try {
      const now = new Date();

      // Find all scheduled huddles
      const scheduledHuddles = await this.prisma.client.huddle.findMany({
        where: {
          HuddleStatus: 'scheduled',
        },
        select: {
          id: true,
          selectedDate: true,
          startTime: true,
          duration: true,
        },
      });

      if (scheduledHuddles.length === 0) {
        this.logger.debug('No scheduled huddles to check');
        return;
      }

      const huddlesToComplete: string[] = [];

      for (const huddle of scheduledHuddles) {
        try {
          // Validate required fields
          if (!huddle.selectedDate || !huddle.startTime) {
            this.logger.warn(
              `Huddle ${huddle.id} missing date or time, skipping`,
            );
            continue;
          }

          const huddleDateTime = new Date(
            `${huddle.selectedDate}T${huddle.startTime}:00`,
          );

          // Check if date is valid
          if (isNaN(huddleDateTime.getTime())) {
            this.logger.warn(
              `Huddle ${huddle.id} has invalid date/time format, skipping`,
            );
            continue;
          }

          // Parse duration (default to 15 minutes if invalid)
          const durationMinutes = parseInt(huddle.duration) || 15;

          // Calculate end time
          const endTime = new Date(
            huddleDateTime.getTime() + durationMinutes * 60000,
          );

          // If current time is past the end time, mark for completion
          if (now >= endTime) {
            huddlesToComplete.push(huddle.id);
            this.logger.log(
              `Huddle ${huddle.id} scheduled for auto-completion (ended at ${endTime.toISOString()})`,
            );
          }
        } catch (error) {
          this.logger.error(`Error processing huddle ${huddle.id}`, error);
        }
      }

      // Bulk update all huddles that should be completed
      if (huddlesToComplete.length > 0) {
        const result = await this.prisma.client.huddle.updateMany({
          where: {
            id: {
              in: huddlesToComplete,
            },
          },
          data: {
            HuddleStatus: 'completed',
          },
        });

        this.logger.log(
          `Auto-completed ${result.count} huddle(s): ${huddlesToComplete.join(', ')}`,
        );
      } else {
        this.logger.debug('No huddles need to be completed at this time');
      }
    } catch (error) {
      this.logger.error('Error in autoCompleteHuddles cron job', error);
    }
  }
}
