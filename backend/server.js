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

// -------------------- DEPLOYMENT ------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/build'));
} else {
  app.get('/', (req, res) => {
    res.send('API is running successfully!');
  });
}
// -------------------- DEPLOYMENT ------------------------

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

  socket.on('leave_chat', (room) => {
    console.log(`Leaved room ${room}`);
    socket.leave(room);
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

      console.log(`User ${user._id} received message ${message._id}`);
      socket.in(user._id).emit('message_received', message);
    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected because ${reason}`);
  });
});
