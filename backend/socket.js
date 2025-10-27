/**
 * Slantapp code and properties {www.slantapp.io}
 */
//import http server
import express from 'express';
//make an express server
import {createServer} from 'http';
//create server
const server = createServer();
import {Server} from 'socket.io';

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: "*",
        // credentials: true
    }
})
//start initialization
//hold on socket
io.on('connection', (socket) => {
    //connection established
    console.log("Connected @socket")
    //console.log(socket)
})
io.on('disconnect', (socket) => {
    //connection established
    console.log("Disconnected @socket")
    //console.log(socket)
})
io.on('open', (socket) => {
    //connection established
    console.log("Connection opened @socket")
    //console.log(socket)
})
io.on('message', (socket) => {
    //connection established
    console.log("message from hi opened @socket")
    //console.log(socket)
})
//listen to server
server.listen(3010, () => {
    //server created
    console.log("On 3010 created [http, socket]")
})
