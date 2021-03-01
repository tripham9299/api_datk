let express = require('express');
let router = express.Router();
let authController = require('../controller/auth.controller')
let userValidation = require('../validate/user.validate')
var authMiddleware = require('../middleware/auth.middleware')

router.post('/login',authController.login)

router.post('/signup', authController.signup)
router.post('/refreshToken', authController.refreshToken)
router.post('/logout',authMiddleware.isAuth ,authController.logout)

module.exports = router;