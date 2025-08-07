import { Router, Request, Response } from 'express';
import { SlackService } from '../services/slackService';
import { ScheduledMessage } from '../models/ScheduledMessage';

const router = Router();


// Debug route to check token scopes
// Debug route to check token scopes
router.get('/debug/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const slackService = await SlackService.forUser(userId);
    
    if (!slackService) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Test the token and get its info
    const tokenInfo = await slackService.getTokenInfo();
    
    res.json({
      success: true,
      tokenInfo: tokenInfo,
      userId: userId
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    res.status(500).json({ 
      error: 'Debug failed',
      details: error.message 
    });
  }
});


// Get user's Slack channels
router.get('/channels/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const slackService = await SlackService.forUser(userId);
    
    if (!slackService) {
      return res.status(404).json({ 
        error: 'User not found or not connected to Slack' 
      });
    }

    const channels = await slackService.getChannels();
    
    res.json({ 
      success: true, 
      channels 
    });

  } catch (error: any) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ 
      error: 'Failed to fetch channels',
      details: error.message 
    });
  }
});

// Send a message to a channel
router.post('/send-message', async (req: Request, res: Response) => {
  try {
    const { userId, channelId, message } = req.body;

    if (!userId || !channelId || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, channelId, message' 
      });
    }

    const slackService = await SlackService.forUser(userId);
    
    if (!slackService) {
      return res.status(404).json({ 
        error: 'User not found or not connected to Slack' 
      });
    }

    const result = await slackService.sendMessage(channelId, message);
    
    res.json({ 
      success: true, 
      result 
    });

  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      details: error.message 
    });
  }
});

// Schedule a message
router.post('/schedule-message', async (req: Request, res: Response) => {
  try {
    const { userId, channelId, message, scheduledTime } = req.body;

    if (!userId || !channelId || !message || !scheduledTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, channelId, message, scheduledTime' 
      });
    }

    // Validate that scheduled time is in the future
    const scheduleDate = new Date(scheduledTime);
    if (scheduleDate <= new Date()) {
      return res.status(400).json({
        error: 'Scheduled time must be in the future'
      });
    }

    const scheduledMessage = await ScheduledMessage.create({
      userId,
      channelId,
      message,
      scheduledTime: scheduleDate,
      status: 'pending'
    });

    res.json({ 
      success: true, 
      scheduledMessage: {
        id: scheduledMessage.id,
        scheduledTime: scheduledMessage.scheduledTime,
        status: scheduledMessage.status
      }
    });

  } catch (error: any) {
    console.error('Error scheduling message:', error);
    res.status(500).json({ 
      error: 'Failed to schedule message',
      details: error.message 
    });
  }
});

// Get user's scheduled messages
router.get('/scheduled-messages/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const whereClause: any = { userId };
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const scheduledMessages = await ScheduledMessage.findAll({
      where: whereClause,
      order: [['scheduledTime', 'ASC']]
    });

    res.json({ 
      success: true, 
      messages: scheduledMessages 
    });

  } catch (error: any) {
    console.error('Error fetching scheduled messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch scheduled messages',
      details: error.message 
    });
  }
});

// Cancel a scheduled message
router.delete('/scheduled-message/:messageId', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const scheduledMessage = await ScheduledMessage.findByPk(messageId);

    if (!scheduledMessage) {
      return res.status(404).json({ error: 'Scheduled message not found' });
    }

    if (scheduledMessage.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Can only cancel pending messages' 
      });
    }

    await scheduledMessage.update({ status: 'cancelled' });

    res.json({ 
      success: true, 
      message: 'Scheduled message cancelled successfully' 
    });

  } catch (error: any) {
    console.error('Error cancelling scheduled message:', error);
    res.status(500).json({ 
      error: 'Failed to cancel scheduled message',
      details: error.message 
    });
  }
});

module.exports = router;
