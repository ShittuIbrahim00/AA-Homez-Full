// models/associations.js
import ModelScheduler from './model.scheduler.js';
import {
    ModelAgent,
    ModelProperty,
    ModelSettings,
    ModelSubProperty,
    ModelUser,
} from "./index.js";

export default function setupAssociations() {
    // Define relationships
    ModelScheduler.belongsTo(ModelProperty, { foreignKey: 'pid', as: 'Property' });
    ModelScheduler.belongsTo(ModelSubProperty, { foreignKey: 'sid', as: 'SubProperty' });
    ModelScheduler.belongsTo(ModelAgent, { foreignKey: 'aid', as: 'Agent' });
}