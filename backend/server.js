const express = require('express');
const { Server } = require('socket.io');
const winston = require('winston');
const expressWinston = require('express-winston');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

const connectBD = require('./config/db');
const userRouter = require('./routers/user');
const chatsRouter = require('./routers/chats');
const messagesRouter = require('./routers/messages');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

app.use(express.json());

// app.use(
//   expressWinston.logger({
//     transports: [new winston.transports.Console()],
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.json()
//     ),
//   })
// );

app.use('/api/users', userRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/chats', messagesRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  connectBD().then(() => {
    console.log(`Backend listening on port ${PORT}!`);
  });
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`Joined ${userData._id}`);
    socket.emit('connected');
  });

  socket.on('join_chat', (room) => {
    console.log(`Joined room ${room}`);
    socket.join(room);
  });

  socket.on('typing', (room) => {
    console.log(`Typing in ${room}`);
    socket.in(room).emit('typing');
  });

  socket.on('stop_typing', (room) => {
    console.log(`Stopped typing in ${room}`);
    socket.in(room).emit('stop_typing');
  });

  socket.on('new_message', (message) => {
    let chat = message.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      socket.in(user._id).emit('message_received', message);
    });
  });

  socket.off('setup', (userData) => {
    console.log(`User ${userData._id} disconnected`);
    // socket.leave()
  });

  socket.off('join_chat', (room) => {
    console.log(`Leaving room ${room}`);
  });
});
