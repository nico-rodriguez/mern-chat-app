const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const { user } = req;

  if (!content || !chatId) {
    console.log('Missing data in request!');
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate('sender', 'name picture');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name picture email',
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch ({ message }) {
    res.status(400);
    throw new Error(message);
  }
});

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name picture email')
      .populate('chat');

    res.json(messages);
  } catch ({ message }) {
    res.status(400);
    throw new Error(message);
  }
});

module.exports = { sendMessage, getMessages };
