import * as cron from 'node-cron';
import { ScheduledMessage } from '../models/ScheduledMessage';
import { SlackService } from './slackService';
import { Op } from 'sequelize';

export class SchedulingService {
  private static isStarted = false;

  // Start the cron job to check for messages to send
  static startScheduler() {
    if (this.isStarted) {
      console.log('⏰ Scheduler already running');
      return;
    }

    // Check every minute for messages to send
    cron.schedule('* * * * *', async () => {
      await this.processScheduledMessages();
    });

    this.isStarted = true;
    console.log('⏰ Message scheduler started - checking every minute');
  }

  // Process messages that are ready to be sent
  static async processScheduledMessages() {
    try {
      const now = new Date();
      
      // Find all pending messages that should be sent now
      const messagesToSend = await ScheduledMessage.findAll({
        where: {
          status: 'pending',
          scheduledTime: {
            [Op.lte]: now
          }
        },
        order: [['scheduledTime', 'ASC']]
      });

      console.log(`🔍 Found ${messagesToSend.length} messages to send`);

      for (const scheduledMessage of messagesToSend) {
        await this.sendScheduledMessage(scheduledMessage);
      }

    } catch (error) {
      console.error('❌ Error processing scheduled messages:', error);
    }
  }

  // Send a single scheduled message
  static async sendScheduledMessage(scheduledMessage: any) {
    try {
      console.log(`📤 Sending scheduled message ${scheduledMessage.id}`);

      const slackService = await SlackService.forUser(scheduledMessage.userId);
      
      if (!slackService) {
        await scheduledMessage.update({
          status: 'failed',
          errorMessage: 'User not found or not connected to Slack',
          sentAt: new Date()
        });
        return;
      }

      // Send the message
      const result = await slackService.sendMessage(
        scheduledMessage.channelId, 
        scheduledMessage.message
      );

      // Mark as sent
      await scheduledMessage.update({
        status: 'sent',
        sentAt: new Date()
      });

      console.log(`✅ Scheduled message ${scheduledMessage.id} sent successfully`);

    } catch (error: any) {
      console.error(`❌ Failed to send scheduled message ${scheduledMessage.id}:`, error);
      
      // Mark as failed
      await scheduledMessage.update({
        status: 'failed',
        errorMessage: error.message,
        sentAt: new Date()
      });
    }
  }

  // Get statistics about scheduled messages
  static async getStats(userId?: string) {
    const whereClause = userId ? { userId } : {};
    
    const stats = await ScheduledMessage.findAll({
      where: whereClause,
      attributes: [
        'status',
        [ScheduledMessage.sequelize!.fn('COUNT', '*'), 'count']
      ],
      group: ['status'],
      raw: true
    });

    return stats;
  }
}
