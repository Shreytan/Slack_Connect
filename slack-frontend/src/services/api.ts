const API_BASE = 'https://8762a25dd3d5.ngrok-free.app/api';

export interface Chanel {
  id: string;
  name: string;
  isPrivate: boolean;
}

export interface ScheduledMessage {
  id: string;
  userId: string;
  channelId: string;
  message: string;
  scheduledTime: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  sentAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// Common headers to bypass ngrok browser warning
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'  // ADD THIS HEADER
});

class ApiService {
  // Get user channels
  async getChannels(userId: string): Promise<Chanel[]> {
    try {
      console.log('Fetching channels for user:', userId);
      const response = await fetch(`${API_BASE}/slack/channels/${userId}`, {
        headers: getHeaders()  // USE HEADERS
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Channels response:', data);
      
      return data.success ? data.channels : [];
    } catch (error) {
      console.error('API Error in getChannels:', error);
      throw error;
    }
  }

  // Send immediate message
  async sendMessage(userId: string, channelId: string, message: string) {
    const response = await fetch(`${API_BASE}/slack/send-message`, {
      method: 'POST',
      headers: getHeaders(),  // USE HEADERS
      body: JSON.stringify({ userId, channelId, message })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }

  // Schedule a message
  async scheduleMessage(userId: string, channelId: string, message: string, scheduledTime: string) {
    const response = await fetch(`${API_BASE}/slack/schedule-message`, {
      method: 'POST',
      headers: getHeaders(),  // USE HEADERS
      body: JSON.stringify({ userId, channelId, message, scheduledTime })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }

  // Get scheduled messages
  async getScheduledMessages(userId: string, status = 'all'): Promise<ScheduledMessage[]> {
    const response = await fetch(`${API_BASE}/slack/scheduled-messages/${userId}?status=${status}`, {
      headers: getHeaders()  // USE HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.messages : [];
  }

  // Cancel scheduled message
  async cancelScheduledMessage(messageId: string) {
    const response = await fetch(`${API_BASE}/slack/scheduled-message/${messageId}`, {
      method: 'DELETE',
      headers: getHeaders()  // USE HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }

  // Check connection status
  async checkConnectionStatus(userId: string) {
    const response = await fetch(`${API_BASE}/auth/status/${userId}`, {
      headers: getHeaders()  // USE HEADERS
    });
    return response.json();
  }

  // Start OAuth flow
  getOAuthUrl() {
    return `${API_BASE}/auth/connect`;
  }
}

export const apiService = new ApiService();
