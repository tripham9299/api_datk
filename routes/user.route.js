var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model')
var userController = require('../controller/user.controller')
var authMiddleware = require('../middleware/auth.middleware')
var multer  = require('multer');
const fileUpload = multer();


router.get('/', userController.getListUser)

router.post('/personal_infor', authMiddleware.isAuth, userController.getPersonalInfor)

router.post('/personal_infor_update',
	fileUpload.single('avatar'),
	authMiddleware.isAuth,
	userController.updatePersonalInfor)

router.post('/password/update',authMiddleware.isAuth, userController.changePass)

router.post('/account/delete',authMiddleware.isAuth, userController.deleteUserById)

router.post('/getNotification',authMiddleware.isAuth, userController.getNotification)


module.exports = router;