const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

const sendMessage = asyncHandler(async (req, res) => {
  const { user } = req;
  const { content } = req.body;
  const { chatId } = req.params;
  console.log(user, content, chatId);

  if (!content) {
    res.status(400);
    throw new Error('Missing data in request!');
  }

  const newMessage = {
    sender: user._id,
    content,
    chat: chatId,
  };

  let message = await Message.create(newMessage);
  message = await message.populate('sender', 'name picture');
  message = await message.populate('chat');
  message = await User.populate(message, {
    path: 'chat.users',
    select: 'name picture email',
  });
  if (!message) {
    res.status(400);
    throw new Error('Could not create new message');
  }

  const chat = await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message,
  });
  if (!chat) {
    res.status(400);
    throw new Error('Could not create or update the chat');
  }

  res.json(message);
});

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate('sender', 'name picture email')
    .populate('chat');
  if (!messages) {
    res.status(400);
    throw new Error('Could not find message');
  }

  res.json(messages);
});

module.exports = { sendMessage, getMessages };
