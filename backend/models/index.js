/**
 * Slantapp code and properties {www.slantapp.io}
 */
import ModelProperty from './model.property.js';
import ModelSubProperty from './model.sub.property.js';
import ModelUser from './model.user.js';
import ModelAgent from './model.agent.js';
import ModelScheduler from './model.scheduler.js';
import ModelSettings from './model.settings.js';
import ModelTransaction from './model.transaction.js';
import ModelNotification from './model.notification.js';
import ModelEvent from './model.event.js'; // Import the ModelEvent

// ModelUser.hasMany(ModelProperty, {as: 'Property', foreignKey: 'uid', onDelete: 'cascade', constraints: false});
// ModelProperty.belongsTo(ModelUser, {as: "User", foreignKey: 'uid', onDelete: 'cascade', constraints: false});
// ModelUser.hasOne(ModelSettings, {as: "Settings", foreignKey: 'uid', onDelete: 'cascade', constraints: false});
// ModelSettings.belongsTo(ModelUser, {as: "User", foreignKey: 'uid', onDelete: 'cascade', constraints: false});

// ModelProperty.hasMany(ModelSubProperty, {
//     as: 'SubProperties',
//     foreignKey: 'pid',
//     onDelete: 'cascade',
//     constraints: false
// });

// ModelSubProperty.belongsTo(ModelProperty, {as: "Property", foreignKey: 'pid', onDelete: 'cascade', constraints: false});

ModelSubProperty.belongsTo(ModelProperty, {
  foreignKey: 'pid',
  as: 'Property'
});

ModelProperty.hasMany(ModelSubProperty, {
  foreignKey: 'pid',
  as: 'SubProperties'
});

ModelAgent.hasMany(ModelAgent, {as: 'referrals', foreignKey: 'referredBy', constraints: false});

ModelProperty.hasMany(ModelScheduler, {as: "Schedules", foreignKey: 'pid', onDelete: 'cascade', constraints: false});
ModelScheduler.belongsTo(ModelProperty, {as: 'Property', foreignKey: 'pid', onDelete: 'cascade', constraints: false});
ModelProperty.hasMany(ModelTransaction, {
    as: "Transactions",
    foreignKey: 'pid',
    onDelete: 'cascade',
    constraints: false
});

ModelAgent.hasMany(ModelScheduler, {as: "Schedules", foreignKey: 'aid', onDelete: 'cascade', constraints: false});
ModelScheduler.belongsTo(ModelAgent, {as: 'Agent', foreignKey: 'aid', onDelete: 'cascade', constraints: false});

ModelSubProperty.hasMany(ModelScheduler, {as: "Schedules", foreignKey: 'sid', onDelete: 'cascade', constraints: false});

ModelScheduler.belongsTo(ModelSubProperty, {
    as: 'SubProperty',
    foreignKey: 'sid',
    onDelete: 'cascade',
    constraints: false
});

// Define association between ModelScheduler and ModelEvent
ModelScheduler.hasMany(ModelEvent, {as: 'Events', foreignKey: 'scid', onDelete: 'cascade', constraints: false});
ModelEvent.belongsTo(ModelScheduler, {as: "Schedules", foreignKey: 'scid', onDelete: 'cascade', constraints: false});


// MY ADDITION
// Add these associations to your existing relationship definitions
ModelAgent.hasMany(ModelProperty, {
  as: 'Property',
  foreignKey: 'aid',
  onDelete: 'SET NULL',
  constraints: false
});

ModelProperty.belongsTo(ModelAgent, {
  as: 'Agent',
  foreignKey: 'aid',
  onDelete: 'SET NULL',
  constraints: false
});

ModelAgent.hasMany(ModelTransaction, {
  as: 'Transactions',
  foreignKey: 'aid',
  constraints: false
});


// CORRECTED ASSOCIATIONS
ModelUser.hasMany(ModelProperty, {
  as: 'Property',
  foreignKey: 'uid',
  sourceKey: 'uid'
});

ModelProperty.belongsTo(ModelUser, {
  as: 'User',
  foreignKey: 'uid',
  targetKey: 'uid'
});

ModelUser.hasOne(ModelSettings, {
  as: 'Settings',
  foreignKey: 'uid',
  sourceKey: 'uid'
});

ModelSettings.belongsTo(ModelUser, {
  as: 'User',
  foreignKey: 'uid',
  targetKey: 'uid'
});

// ADD THIS MISSING ASSOCIATION - ModelAgent to ModelSubProperty
ModelAgent.hasMany(ModelSubProperty, {
  as: 'SubProperties',
  foreignKey: 'aid', // Make sure this matches the foreign key in ModelSubProperty
  onDelete: 'SET NULL',
  constraints: false
});

ModelSubProperty.belongsTo(ModelAgent, {
  as: 'Agent',
  foreignKey: 'aid', // Make sure this matches the foreign key in ModelSubProperty
  onDelete: 'SET NULL',
  constraints: false
});

export {
    ModelProperty,
    ModelUser,
    ModelAgent,
    ModelSubProperty,
    ModelSettings,
    ModelScheduler,
    ModelTransaction,
    ModelNotification,
    ModelEvent // Export ModelEvent
};
