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
  // Get Slack service for a specific user with auto-refresh
static async forUser(slackUserId: string): Promise<SlackService | null> {
  const user = await User.findOne({ 
    where: { slackUserId } 
  });

  if (!user) {
    return null;
  }

  // Check if token is expired or will expire in next 30 minutes
  const now = new Date();
  const expiryBuffer = new Date(now.getTime() + (30 * 60 * 1000)); // 30 minutes buffer

  if (user.tokenExpiresAt && user.tokenExpiresAt <= expiryBuffer) {
    console.log('🔄 Token expired/expiring, attempting refresh...');
    
    const newToken = await this.refreshUserToken(user);
    if (!newToken) {
      console.log('❌ Failed to refresh token for user:', slackUserId);
      return null;
    }
    
    // Reload user data after refresh
    await user.reload();
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
  // Refresh expired access token
static async refreshUserToken(user: any): Promise<string | null> {
  if (!user.refreshToken) {
    console.log('❌ No refresh token available for user:', user.slackUserId);
    return null;
  }

  try {
    const axios = require('axios');
    const params = new URLSearchParams();
    params.append('client_id', process.env.SLACK_CLIENT_ID!);
    params.append('client_secret', process.env.SLACK_CLIENT_SECRET!);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', user.refreshToken);

    const response = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data.ok) {
      // Update user with new tokens
      await user.update({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenExpiresAt: new Date(Date.now() + (12 * 60 * 60 * 1000))
      });

      console.log('✅ Token refreshed for user:', user.slackUserId);
      return response.data.access_token;
    } else {
      console.log('❌ Token refresh failed:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    return null;
  }
}

}
