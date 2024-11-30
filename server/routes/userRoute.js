const express = require('express');
const {verifyToken} = require('../middlewares/jwt');
const fileUpload = require('../middlewares/fileUpload');
const { createUser, getUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/',fileUpload,createUser);
router.get('/:userId',getUser);
router.delete('/',verifyToken,deleteUser);

module.exports = router;