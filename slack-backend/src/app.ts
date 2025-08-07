import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { SchedulingService } from './services/schedulingService';

// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',  // Keep existing
    'http://localhost:8080',  // ADD THIS LINE
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes after middleware
const authRoutes = require('./routes/auth');
const slackRoutes = require('./routes/slack');

app.use('/api/auth', authRoutes);
app.use('/api/slack', slackRoutes);

// Basic test route
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
// Start server with database connection
const startServer = async () => {
  try {
    await connectDatabase();
    
    // Import models after database connection
    await import('./models/User');
    await import('./models/ScheduledMessage');  // ADDED THIS LINE
    
    // Sync database (create tables)
    const { sequelize } = await import('./config/database');
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized');
    // Start the message scheduler
SchedulingService.startScheduler();

    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔗 ngrok URL: https://8762a25dd3d5.ngrok-free.app`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};


startServer();
