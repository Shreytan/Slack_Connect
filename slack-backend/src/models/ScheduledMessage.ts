import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class ScheduledMessage extends Model {
  public id!: number;
  public userId!: string;
  public channelId!: string;
  public message!: string;
  public scheduledTime!: Date;
  public status!: 'pending' | 'sent' | 'cancelled' | 'failed';
  public sentAt?: Date;
  public errorMessage?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ScheduledMessage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id'
  },
  channelId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'channel_id'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'scheduled_time'
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'cancelled', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_message'
  }
}, {
  sequelize,
  tableName: 'scheduled_messages',
  underscored: true
});
