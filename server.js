const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'ChatBot';
const PORT = process.env.PORT || 4000;

// Run when client connects
io.on('connection', socket => {

    // Join room
    socket.on('joinRoom', ({ username, room }) => {

      const user = userJoin(socket.id, username, room);
      socket.join(user.room);
      // Welcome current user
      socket.emit('message', formatMessage(botName,'Welcome to RealChat!'));

      // socket.emit -> to the current single client ; io.emit -> to all the clients ; socket.broadcast.emit -> to all the clients except the current one
      // Broadcast when a user connects
      socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName,`${user.username} has joined the chat`));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if(user){
        io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
      }
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});