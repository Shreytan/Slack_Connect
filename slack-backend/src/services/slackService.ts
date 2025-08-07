import { WebClient } from '@slack/web-api';
import { User } from '../models/User';

export class SlackService {
  private client: WebClient;

  constructor(accessToken: string) {
    this.client = new WebClient(accessToken);
  }

  // Get user's channels
  async getChannels() {
    try {
      const result = await this.client.conversations.list({
        exclude_archived: true,
        types: 'public_channel,private_channel'
      });

      return result.channels?.map(channel => ({
        id: channel.id,
        name: channel.name,
        isPrivate: channel.is_private
      })) || [];

    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  // Send a message to a channel
  async sendMessage(channelId: string, text: string) {
    try {
      const result = await this.client.chat.postMessage({
        channel: channelId,
        text: text
      });

      return {
        success: true,
        messageId: result.ts,
        channel: result.channel
      };

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get Slack service for a specific user
  static async forUser(slackUserId: string): Promise<SlackService | null> {
    const user = await User.findOne({ 
      where: { slackUserId } 
    });

    if (!user) {
      return null;
    }

    return new SlackService(user.accessToken);
  }

    // Debug method to check token info
  async getTokenInfo() {
    try {
      const authTest = await this.client.auth.test();
      return authTest;
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }

}
