const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

const connectBD = require('./config/db');
const userRouter = require('./routers/user');
const chatsRouter = require('./routers/chats');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/chats', chatsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connectBD().then(() => {
    console.log(`Backend listening on port ${PORT}!`);
  });
});
