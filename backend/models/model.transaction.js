import sequelize from "./../database/index.js";
import { DataTypes, Model } from "sequelize";
import sha1 from "sha1";

const tableName = "transactions";

// const queryInterface = sequelize.getQueryInterface();
function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

class ModelTransaction extends Model {}

ModelTransaction.init(
  {
    tid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uid: { type: DataTypes.INTEGER },
    aid: { type: DataTypes.INTEGER },
    pid: { type: DataTypes.INTEGER },
    sid: { type: DataTypes.INTEGER },
    type: { type: DataTypes.ENUM("credit", "debit"), defaultValue: "credit" },
    service: { type: DataTypes.STRING, defaultValue: "sale" },
    role: {
      type: DataTypes.ENUM(
        "user",
        "agent",
        "agency",
        "admin",
        "property",
        "subProperty"
      ),
      defaultValue: "agent",
    },
    amount: { type: DataTypes.DECIMAL(20, 2), defaultValue: 0.0 },
    note: DataTypes.STRING(255),
    actualAmount: { type: DataTypes.DECIMAL(20, 2), defaultValue: 0.0 },
    ref: { type: DataTypes.STRING, defaultValue: sha1(new Date()) },
    status: {
      type: DataTypes.ENUM("successful", "pending", "cancelled", "failed"),
      defaultValue: "pending",
    },
    data: { type: DataTypes.JSON },
    prevBalance: { type: DataTypes.DECIMAL(20, 2), defaultValue: 0.0 },
    newBalance: { type: DataTypes.DECIMAL(20, 2), defaultValue: 0.0 },
  },
  {
    sequelize,
    tableName,
    paranoid: true,
  }
);

/**
 * Run belonging and relationship before sync()
 */
sequelize.sync();
export default ModelTransaction;
