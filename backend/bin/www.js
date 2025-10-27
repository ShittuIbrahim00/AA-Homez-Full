#!/usr/bin/env node
import app from '../app.js';
import debug from 'debug';
import http from 'http';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';

debug('node:server');
dotenv.config();

// Normalize Port
const port = normalizePort(process.env.PORT || '4001');
app.set('port', port);

// Create HTTP Server
const server = http.createServer(app);

// Socket.io setup
// Socket.io setup with multiple origin support
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:3002',
        'https://*.vercel.app',
        'https://aa-homes-copy.vercel.app'
      ];
      
      if (allowedOrigins.some(allowedOrigin => {
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
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true 
  }
});
// const io = new Server(server, {
//   cors: {
//     origin: process.env.SOCKET_ORIGIN || '*',
//     methods: ['GET', 'POST', "PATCH", "PUT", "DELETE"],
//     credentials: true 
//   }
// });

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.set('io', io); // Make io accessible in routes

// Listen
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Helpers
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`✅ Server listening on ${bind}`);
  debug(`Listening on ${bind}`);
}
