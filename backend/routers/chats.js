const { Router } = require('express');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require('../controllers/chats');
const { auth } = require('../middleware/auth');

const router = Router();

router.route('/').post(auth, accessChat).get(auth, fetchChats);

router.route('/new-group').post(auth, createGroupChat);

router.route('/:chatId/rename-group').put(auth, renameGroup);

router.route('/:chatId/add-user').put(auth, addToGroup);
router.route('/:chatId/remove-user').put(auth, removeFromGroup);

module.exports = router;
