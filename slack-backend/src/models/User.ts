import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
  public id!: number;
  public slackUserId!: string;
  public teamId!: string;
  public accessToken!: string;
  public refreshToken?: string;        // ADD THIS
  public tokenExpiresAt?: Date;        // ADD THIS

  public teamName?: string;
  public userName?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  slackUserId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'slack_user_id'
  },
  teamId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'team_id'
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'access_token'
  },
  refreshToken: {
  type: DataTypes.TEXT,
  allowNull: true,
  field: 'refresh_token'
},
tokenExpiresAt: {
  type: DataTypes.DATE,
  allowNull: true,
  field: 'token_expires_at'
},

  teamName: {
    type: DataTypes.STRING,
    field: 'team_name'
  },
  userName: {
    type: DataTypes.STRING,
    field: 'user_name'
  }
}, {
  sequelize,
  tableName: 'users',
  underscored: true
});
