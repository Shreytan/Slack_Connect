import { Sequelize } from 'sequelize';
import path from 'path';

// Check if we're in production (Render) or development (local)
const isProduction = process.env.NODE_ENV === 'production';

export const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL!, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../data/slack_connect.db'),
      logging: false
    });

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    console.log(`📊 Using ${isProduction ? 'PostgreSQL (Production)' : 'SQLite (Development)'}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
