import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/index.js';
import { ErrorClass } from '../core/index.js';
import { ModelScheduler } from './index.js';
import Joi from 'joi';

const tableName = 'events';

class ModelEvent extends Model {}

ModelEvent.init(
  {
    eid: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    scid: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'scid'
      }
    },
    title: { 
      type: DataTypes.STRING(100),
      allowNull: false
    },
    start: { 
      type: DataTypes.DATE,
      allowNull: false 
    },
    end: { 
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStart(value) {
          if (value <= this.start) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    description: { 
      type: DataTypes.TEXT 
    },
    location: { 
      type: DataTypes.STRING(200) 
    }
  },
  { 
    sequelize, 
    tableName, 
    paranoid: true,
    hooks: {
      beforeValidate: (event) => {
        if (event.end && event.start && event.end <= event.start) {
          throw new Error('End date must be after start date');
        }
      }
    }
  }
);

// Validation Schema
ModelEvent.schema = Joi.object({
  scid: Joi.number().integer().required().label('Scheduler ID'),
  title: Joi.string().min(3).max(100).required(),
  start: Joi.date().iso().required(),
  end: Joi.date().iso().min(Joi.ref('start')).required()
    .messages({ 'date.min': 'End date must be after start date' }),
  description: Joi.string().max(500).optional(),
  location: Joi.string().max(200).optional()
});

// Static Methods
ModelEvent.Get = async (eid) => {
  try {
    const event = await ModelEvent.findByPk(eid, {
      include: [
        { 
          model: ModelScheduler, 
          as: "Schedules"
        }
      ]
    });
    if (!event) throw new ErrorClass("Event not found");
    return event;
  } catch (e) {
    throw new ErrorClass(e.message);
  }
};

ModelEvent.AddEvent = async (data) => {
  try {
    const { error } = ModelEvent.schema.validate(data);
    if (error) throw new ErrorClass(error.details[0].message, 400);
    
    // Verify scheduler exists
    const scheduler = await ModelScheduler.findByPk(data.scid);
    if (!scheduler) throw new ErrorClass("Scheduler not found", 404);
    
    return await ModelEvent.create(data);
  } catch (error) {
    throw new ErrorClass(error.message);
  }
};

ModelEvent.UpdateEvent = async (eid, data) => {
  try {
    const { error } = ModelEvent.schema.validate(data);
    if (error) throw new ErrorClass(error.details[0].message, 400);

    const [affectedRows] = await ModelEvent.update(data, { where: { eid } });
    if (affectedRows === 0) throw new ErrorClass("Event not found", 404);
    
    return await ModelEvent.Get(eid);
  } catch (error) {
    throw new ErrorClass(error.message);
  }
};

ModelEvent.DeleteEvent = async (eid) => {
  try {
    const deleted = await ModelEvent.destroy({ where: { eid } });
    if (!deleted) throw new ErrorClass("Event not found", 404);
    return { success: true };
  } catch (error) {
    throw new ErrorClass(error.message);
  }
};

export default ModelEvent;


// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../database/index.js';
// import { ErrorClass } from '../core/index.js';
// import { ModelScheduler } from './index.js';

// const tableName = 'events';

// class ModelEvent extends Model {}

// ModelEvent.init(
//   {
//     eid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     scid: { type: DataTypes.INTEGER },
//     title: { type: DataTypes.STRING },
//     start: { type: DataTypes.DATE },
//     end: { type: DataTypes.DATE },
//   },
//   { sequelize, tableName, paranoid: true }
// );

// // Define associations
// ModelEvent.belongsTo(ModelScheduler, { as: 'Scheduler', foreignKey: 'scid', onDelete: 'cascade', constraints: false });

// ModelEvent.Get = async (eid) => {
//     try {
//         const event = await ModelEvent.findOne({
//             where: { eid },
//             attributes: ['id', 'title', 'start', 'end'],
//             include: [
//                 { model: ModelScheduler, as: "Scheduler", include: [
//                     { model: ModelProperty, as: "Property" },
//                     { model: ModelSubProperty, as: "SubProperty" },
//                     { model: ModelAgent, as: "Agent", attributes: ['fullName', 'phone', 'rank'] }
//                 ]}
//             ]
//         });
//         if (!event) throw new ErrorClass("Event not found");
//         return event;
//     } catch (e) {
//         throw new ErrorClass(e.message);
//     }
// };

// ModelEvent.AddEvent = async (data) => {
//     try {
//         const event = await ModelEvent.create(data);
//         return event;
//     } catch (error) {
//         throw new ErrorClass(error.message);
//     }
// };

// export default ModelEvent;
