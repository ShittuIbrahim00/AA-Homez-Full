import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { ErrorClass, ErrorInterceptor } from './core/index.js';
import indexRouter from './routes/index.js';
import v1Routes from './routes/route.v1.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Trust proxy in production
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : 0);

const allowedOrigins = [
  'http://localhost:3000',        // Default React port
  'http://localhost:3001',        // Additional port 1
  'http://localhost:3002',        // Additional port 2
  'https://*.vercel.app',         // All Vercel deployments
  'https://aa-homes-copy.vercel.app' // Your specific Vercel app
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => {
      // Handle wildcard subdomains
      if (allowedOrigin.includes('*')) {
        const regex = new RegExp('^' + allowedOrigin.replace('*.', '.*\.') + '$');
        return regex.test(origin);
      }
      return origin === allowedOrigin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// // Enhanced CORS
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make io available in routes
app.use((req, res, next) => {
  req.io = app.get('io');
  next();
});

// Base URL
app.use('*', (req, res, next) => {
  global.appBaseUrl = `${req.protocol}://${req.get('host')}`;
  next();
});

// Routes
const API_PREFIX = "/api";
app.use('/', indexRouter);
app.use(API_PREFIX + '/v1', v1Routes);

// Error handling
app.use('*', (req, res) => {
  throw new ErrorClass("Resource not found", 404);
});

app.use(ErrorInterceptor);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

export default app;


// import createError from 'http-errors';
// import express from 'express';
// import session from 'express-session';
// import fetch from "node-fetch";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
// import { ErrorClass, ErrorInterceptor } from './core/index.js';
// import indexRouter from './routes/index.js';
// import v1Routes from './routes/route.v1.js';
// import 'dotenv/config';
// import cors from "cors";

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Credentials', "true");
//   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// // Conditional Logging
// const originalConsoleLog = console.log;
// global.console.log = function (...args) {
//   if (process.env.CONSOLE_LOG === 'true') {
//     originalConsoleLog(...args);
//   }
// };

// // Session & Globals
// app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
// global.fetch = fetch;

// // View Engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // Core Middleware
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('*', (req, res, next) => {
//   global.appBaseUrl = `${req.protocol}://${req.get('host')}`;
//   next();
// });

// // Routes
// const API_PREFIX = "/api";
// app.use('/', indexRouter);
// app.use(API_PREFIX + '/v1', v1Routes);

// // 404 Handling
// app.use('*', (req, res) => {
//   throw new ErrorClass("Resource not found", 404);
// });

// // Error Interceptor
// app.use(ErrorInterceptor);

// // Crash Protection
// process.on('uncaughtException', (err) => {
//   console.error(err);
//   console.log("Node NOT Exiting...");
// });

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   throw new ErrorClass("Route not found at system level", 404);
// });

// export default app;
