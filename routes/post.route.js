var express = require('express');
var router = express.Router();
var postController = require('../controller/post.controller')
var authMiddleware = require('../middleware/auth.middleware')
var multer  = require('multer');
const fileUpload = multer();


router.post('/add',authMiddleware.isAuth, postController.addNewPost)
router.post('/update',authMiddleware.isAuth, postController.updatePost)
router.post('/getList',authMiddleware.isAuth, postController.getPostList)
router.post('/delete',authMiddleware.isAuth, postController.deletePost)



module.exports = router;