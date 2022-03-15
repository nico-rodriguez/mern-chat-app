const { Router } = require('express');
const { sendMessage, getMessages } = require('../controllers/messages');
const { auth } = require('../middleware/auth');

const router = Router();

router
  .route('/:chatId/messages')
  .post(auth, sendMessage)
  .get(auth, getMessages);

module.exports = router;
