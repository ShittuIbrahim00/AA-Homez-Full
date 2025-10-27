import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const MODE = process.env.PROJECT_MODE === "prod";
const DATABASE_HOST = MODE ? process.env.DB_HOST : process.env.DEBUG_DB_HOST;
const DATABASE_NAME = MODE ? process.env.DB_NAME : process.env.DEBUG_DB_NAME;
const DATABASE_USER = MODE ? process.env.DB_USER : process.env.DEBUG_DB_USER;
const DATABASE_PASS = MODE ? process.env.DB_PASS : process.env.DEBUG_DB_PASS;
const DATABASE_PORT = MODE ? process.env.DB_PORT : process.env.DEBUG_DB_PORT;

const dbConn = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASS, {
  host: DATABASE_HOST,
  dialect: "mysql",
  port: DATABASE_PORT,
  dialectOptions: MODE ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// Test connection
(async () => {
  try {
    await dbConn.authenticate();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default dbConn;


// import 'dotenv/config';

// /**
//  * Slantapp code and properties {www.slantapp.io}
//  */
// const MODE = process.env.PROJECT_MODE === "prod";
// /**
//  * @type {string} default server uri
//  */
// const DATABASE_HOST = MODE ? process.env.DB_HOST : process.env.DEBUG_DB_HOST;
// const DATABASE_LANG = "mysql";
// /**
//  * @type {string} database common name
//  */
// const DATABASE_NAME = MODE ? process.env.DB_NAME : process.env.DEBUG_DB_NAME;
// /**
//  * @type {string} database common username
//  */
// const DATABASE_USER = MODE ? process.env.DB_USER : process.env.DEBUG_DB_USER;
// /**
//  * @type {string} database common password
//  */
// const DATABASE_PASS = MODE ? process.env.DB_PASS : process.env.DEBUG_DB_PASS;
// /**
//  * @type {number} database common port
//  */
// const DATABASE_PORT = MODE ? process.env.DB_PORT : process.env.DEBUG_DB_PORT;

// /**
//  * Call for initialization
//  */
// import {Sequelize} from 'sequelize';

// /**
//  *
//  * @type {BelongsTo<Model, Model> | Model<any, any> | Sequelize | Transaction}
//  */
// const dbConn = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASS, {
//     host: DATABASE_HOST,
//     dialect: DATABASE_LANG,
//     port: DATABASE_PORT,
//     logging: (e) => {
//         //write to log file here...
//         // console.log(e);
//         // console.log(DATABASE_PORT)
//         // console.log(e);
//     },
//     pool: {
//   max: 3,
//   min: 0,
//   acquire: 30000,
//   idle: 10000,
// }

// });
// export default dbConn;
