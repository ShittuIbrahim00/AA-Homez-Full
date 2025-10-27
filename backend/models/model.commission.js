import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/index.js';
import ModelAgent from './model.agent.js';

class ModelCommission extends Model {}

ModelCommission.init(
  {
    cid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    totalCommission: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    agentCommission: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    referralCommission: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
      defaultValue: 'PENDING'
    },
    paymentDate: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'commissions',
    timestamps: true
  }
);

// Relationships
ModelCommission.belongsTo(ModelAgent, {
  foreignKey: 'agentId',
  as: 'agent'
});

// Commission calculation hook
ModelCommission.beforeCreate(async (commission) => {
  commission.totalCommission = commission.transactionAmount * 0.10;
  commission.agentCommission = commission.transactionAmount * 0.05;
  commission.referralCommission = commission.transactionAmount * 0.05;
});

export default ModelCommission;