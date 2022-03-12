const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization?.startsWith('Bearer')) {
    try {
      const token = authorization.split(' ')[1];

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedToken.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Unauthorized');
    }
  } else {
    res.status(401);
    throw new Error('Unauthorized');
  }
});

module.exports = { auth };
