const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/user');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(registerUser).get(auth, allUsers);

router.post('/login', authUser);

module.exports = router;
