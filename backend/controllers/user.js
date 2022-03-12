const asyncHandler = require('express-async-handler');

const User = require('../models/user');
const generateToken = require('../config/token');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Enter all fields');
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error('User already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
    picture,
  });
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error('Failed to create user');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const { search: keyword } = req.query;

  // Get all users except the one who made this request
  const filter = keyword
    ? {
        $and: [
          {
            $or: [
              { name: { $regex: keyword, $options: 'i' } },
              { email: { $regex: keyword, $options: 'i' } },
            ],
          },
          { _id: { $ne: req.user._id } },
        ],
      }
    : {};
  const users = await User.find(filter); //.find({ _id: { $ne: req.user._id } });

  res.json(users);
});

module.exports = { registerUser, authUser, allUsers };
