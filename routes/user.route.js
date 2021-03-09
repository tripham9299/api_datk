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
// router.delete('/:id', userController.deleteUserById)
// router.post('/', userController.addUser)
// router.patch('/:id', userController.updateUserAdmin)
// router.post('/lock/:id', userController.LockUser)
// router.post('/unlock/:id', userController.unLockUser)


module.exports = router;