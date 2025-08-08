import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { SchedulingService } from './services/schedulingService';

// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    'https://cobalt-slack-assessment.netlify.app', // Netlify production frontend
    'http://localhost:5173',                      // Vite local frontend
    'http://localhost:8080',                      // (optional: another local port)
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes after middleware
const authRoutes = require('./routes/auth');
const slackRoutes = require('./routes/slack');

// *** Root Route Handler for health/status check ***
app.get('/', (req, res) => {
  res.json({
    status: 'Slack Connect API Server Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/auth/connect',
      '/api/auth/callback',
      '/api/slack/channels/:userId',
      '/api/slack/send-message',
      '/api/slack/schedule-message'
    ]
  });
});

// Mount feature routes
app.use('/api/auth', authRoutes);
app.use('/api/slack', slackRoutes);

// Diagnostic test route (optional but safe to leave)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is running!',
    env: {
      port: process.env.PORT,
      frontend: process.env.FRONTEND_URL,
      hasSlackId: !!process.env.SLACK_CLIENT_ID,
      hasSlackSecret: !!process.env.SLACK_CLIENT_SECRET
    }
  });
});

// Start server with database connection
const startServer = async () => {
  try {
    await connectDatabase();
    // Import models after database connection
    await import('./models/User');
    await import('./models/ScheduledMessage');
    // Sync database (create tables)
    const { sequelize } = await import('./config/database');
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized');
    // Start the message scheduler
    SchedulingService.startScheduler();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      // Remove hardcoded ngrok URL for production!
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
