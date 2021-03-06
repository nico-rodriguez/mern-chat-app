const asyncHandler = require('express-async-handler');

const Chat = require('../models/chat');
const User = require('../models/user');

const accessChat = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { userId: senderId } = req.body;

  if (!senderId) {
    res.status(400);
    throw new Error("userId missing in the request's body");
  }

  const sender = await User.findById(senderId);
  if (!sender) {
    res.status(400);
    throw new Error(`Invalid userID: ${senderId}`);
  }

  let chat = await Chat.findOne({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: senderId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');
  if (!chat) {
    const chatData = {
      name: sender.name,
      isGroup: false,
      users: [userId, senderId],
    };

    chat = await Chat.create(chatData);
    if (!chat) {
      res.status(400);
      throw new Error('Could not create chat');
    }
    chat = await Chat.findOne({ _id: chat._id }).populate('users', '-password');
  } else {
    chat = await User.populate(chat, {
      path: 'latestMessage.sender',
      select: 'name picture email',
    });
  }

  res.json(chat);
});

const fetchChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });
  if (!chats) {
    res.status(400);
    throw new Error('Could not find the chat');
  }

  res.json(chats);
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({
      message: 'Fill all the fields',
    });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send('At least two users are required to create a group');
  }

  users.push(req.user._id);

  const newGroupChat = await Chat.create({
    name,
    users,
    isGroup: true,
    groupAdmin: req.user,
  });
  if (!newGroupChat) {
    res.status(400);
    throw new Error('Could not crete chat');
  }

  const groupChat = await Chat.findOne({ _id: newGroupChat._id })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');
  if (!groupChat) {
    res.status(400);
    throw new Error('Could not find chat');
  }

  res.json(groupChat);
});

const renameGroup = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  if (!chat.isGroup) {
    res.status(404);
    throw new Error('Chat is not a group');
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { name },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  res.json(updatedChat);
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { chatId } = req.params;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedGroup) {
    res.status(400);
    throw new Error('Chat not found');
  } else {
    res.json(updatedGroup);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { chatId } = req.params;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedGroup) {
    res.status(400);
    throw new Error('Chat not found');
  } else {
    res.json(updatedGroup);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
