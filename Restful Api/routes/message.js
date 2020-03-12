const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/is-authenticated');

const messageController = require('../controller/message');

router.get('/', isAuth, messageController.getAllMessage);

router.post('/add-message', isAuth, messageController.addMessage);

router.patch('/edit-message/:messageId', isAuth, messageController.editMessage);

router.patch('/:messageId/add-reply', isAuth, messageController.addReply);

router.delete('/delete-message/:messageId', isAuth, messageController.deleteMessage);

module.exports = router;