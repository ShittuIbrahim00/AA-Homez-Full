// // init.js
import { DataTypes } from "sequelize";
import sequelize from "./database/index.js";

(async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log("Production mode - skipping alter sync");
      return;
    }

    const [results] = await sequelize.query(`
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'property'
      AND COLUMN_NAME = 'aid';
    `);

    if (results[0].count === 0) {
      await sequelize.getQueryInterface().addColumn('property', 'aid', {
        type: DataTypes.INTEGER,
        allowNull: true,
      });
      console.log("Column 'aid' added successfully.");
    }

    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Database initialization error:", error.message);
  } finally {
    await sequelize.close();
  }
})();



// import { DataTypes } from "sequelize";
// import sequelize from "./database/index.js";
// const queryInterface = sequelize.getQueryInterface();

// (async () => {
//   try {
//     // Add the 'aid' column if it doesn't exist
//     const [results] = await sequelize.query(`
//       SELECT COUNT(*) AS count
//       FROM INFORMATION_SCHEMA.COLUMNS
//       WHERE TABLE_NAME = 'property'
//       AND COLUMN_NAME = 'aid';
//     `);

//     if (results[0].count === 0) {
//       await queryInterface.addColumn('property', 'aid', {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       });
//       console.log("Column 'aid' added successfully.");
//     } else {
//       console.log("Column 'aid' already exists.");
//     }

//     // Synchronize models
//     await sequelize.sync({ alter: true });
//     console.log("Database synchronized.");
//   } catch (error) {
//     console.error("Error initializing database:", error.message);
//   } finally {
//     await sequelize.close();
//   }
// })();
