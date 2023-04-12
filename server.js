const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 4000;

// Run when client connects
io.on('connection', socket => {
    console.log('New WS Connection...');

    socket.emit('message', 'Welcome to RealChat!');

    // socket.emit -> to the current single client ; io.emit -> to all the clients ; socket.broadcast.emit -> to all the clients except the current one
    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});