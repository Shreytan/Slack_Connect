import { Router, Request, Response } from 'express';
import { SlackService } from '../services/slackService';

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

module.exports = router;
