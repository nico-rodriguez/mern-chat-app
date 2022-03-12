const asyncHandler = require('express-async-handler');

const Chat = require('../models/chat');
const User = require('../models/user');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId missing in the request's body");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name picture email',
  });

  if (isChat.length > 0) {
    res.json(isChat[0]);
  } else {
    const chatData = {
      name: 'sender',
      isGroup: false,
      users: [req.user._id, userId],
    };

    try {
      const newChat = await Chat.create(chatData);
      const chat = await Chat.findOne({ _id: newChat._id }).populate(
        'users',
        '-password'
      );

      res.json(chat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .populate('latestMessage', 'name picture email')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users: usersString, name } = req.body;

  if (!usersString || !name) {
    return res.status(400).json({
      message: 'Fill all the fields',
    });
  }

  const users = JSON.parse(usersString);
  if (users.length < 2) {
    return res
      .status(400)
      .send('At least two users are required to create a group');
  }

  users.push(req.user);

  try {
    const newGroupChat = await Chat.create({
      name,
      users,
      isGroup: true,
      groupAdmin: req.user,
    });

    const groupChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.json(groupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, name } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { name },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');
  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat not found');
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

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
  const { chatId, userId } = req.body;

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
