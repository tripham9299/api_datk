var express = require('express');
var router = express.Router();
var roomController = require('../controller/room.controller')
var authMiddleware = require('../middleware/auth.middleware')
var multer  = require('multer');
const fileUpload = multer();


router.post('/add',
	fileUpload.single('image'),
	authMiddleware.isAuth,
	roomController.addNewRoom)

router.post('/update',
	fileUpload.single('image'),
 	authMiddleware.isAuth,
 	roomController.updateRoom)

router.post('/delete', authMiddleware.isAuth, roomController.deleteRoom)

router.get('/get/', roomController.getRoomInfor)

module.exports = router;