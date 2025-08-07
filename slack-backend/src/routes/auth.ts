import { Router, Request, Response } from 'express';
import axios from 'axios';
import { User } from '../models/User';  // Add this line

const router = Router();


// Test route
router.get('/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'Auth routes working!',
    clientId: process.env.SLACK_CLIENT_ID?.substring(0, 5) + '...',
    redirectUri: process.env.SLACK_REDIRECT_URI
  });
});

// OAuth start route

// OAuth start route
router.get('/connect', (req: Request, res: Response) => {
  console.log('🔗 Starting OAuth flow...');
  
  const authUrl = `https://slack.com/oauth/v2/authorize?` +
    `client_id=${process.env.SLACK_CLIENT_ID}&` +
    `scope=chat:write,channels:read,groups:read,im:read,mpim:read&` +
    `redirect_uri=${encodeURIComponent(process.env.SLACK_REDIRECT_URI!)}`;

  console.log('Auth URL:', authUrl);
  res.redirect(authUrl);
});



// OAuth callback route
// OAuth callback route
// OAuth callback route
router.get('/callback', async (req: Request, res: Response) => {
  console.log('=== OAuth Callback Started ===');
  console.log('Query params:', req.query);

  const { code, error } = req.query;

  if (error) {
    console.log('❌ OAuth error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/?error=oauth_denied`);
  }

  if (!code) {
    console.log('❌ No code received');
    return res.redirect(`${process.env.FRONTEND_URL}/?error=no_code`);
  }

  try {
    console.log('🔄 Exchanging code for token...');
    
    const params = new URLSearchParams();
    params.append('client_id', process.env.SLACK_CLIENT_ID!);
    params.append('client_secret', process.env.SLACK_CLIENT_SECRET!);
    params.append('code', code as string);
    params.append('redirect_uri', process.env.SLACK_REDIRECT_URI!);

    const response = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('Slack API response data:', response.data);

    if (response.data.ok) {
      console.log('✅ OAuth successful!');
      
      // Save user and tokens to database
      const [user] = await User.upsert({
        slackUserId: response.data.authed_user.id,
        teamId: response.data.team.id,
        accessToken: response.data.access_token,
        teamName: response.data.team.name,
        userName: response.data.authed_user.id
      });

      console.log('💾 User saved to database:', user.id);
      
      res.redirect(`${process.env.FRONTEND_URL}/?connected=true`);
    } else {
      console.log('❌ Slack API error:', response.data.error);
      throw new Error(response.data.error);
    }

  } catch (error: any) {
    console.log('❌ Callback error:', error.message);
    res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed&details=${encodeURIComponent(error.message)}`);
  }
});

// Check user connection status
router.get('/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ 
      where: { slackUserId: userId }
    });

    if (user) {
      res.json({
        connected: true,
        teamName: user.teamName,
        userId: user.slackUserId
      });
    } else {
      res.json({ connected: false });
    }
    
  } catch (error) {
    console.log('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});


module.exports = router;
