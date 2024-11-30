const express = require('express');
const { createMessage, getMessages, deleteMessage,starMessage,getSingleMessage} = require('../controllers/messageController');
const {verifyToken} = require('../middlewares/jwt');

const router = express.Router();

router.post('/',createMessage);
router.get('/',verifyToken,getMessages);
router.get('/:id',verifyToken,getSingleMessage);
router.put('/:id',verifyToken,starMessage);
router.delete('/:id',verifyToken,deleteMessage);

module.exports = router;