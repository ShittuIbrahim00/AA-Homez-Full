import sequelize from './../database/index.js';
import {DataTypes, Model} from 'sequelize';

const tableName = "notifications";

// const queryInterface = sequelize.getQueryInterface();
function isJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}

class ModelNotification extends Model {
}

ModelNotification.init({
    sid: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    uid: {type: DataTypes.INTEGER},
    aid: {type: DataTypes.INTEGER},
    title: {type: DataTypes.STRING},
    body: {type: DataTypes.TEXT},
    isRead: {type: DataTypes.BOOLEAN, defaultValue: false},
    status: {type: DataTypes.INTEGER},
    data: {type: DataTypes.JSON}
}, {sequelize, tableName, paranoid: true});

/**
 * Run belonging and relationship before sync()
 */
sequelize.sync();
export default ModelNotification;
