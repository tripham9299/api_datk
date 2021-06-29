var express = require('express');
var router = express.Router();
var tenantController = require('../controller/tenant.controller')
var authMiddleware = require('../middleware/auth.middleware')
var multer  = require('multer');
const fileUpload = multer();


router.post('/rent',authMiddleware.isAuth, tenantController.rent)

router.post('/cancelRent',authMiddleware.isAuth, tenantController.cancelRent)

router.post('/addToRoom',authMiddleware.isAuth, tenantController.addToRoom)

router.post('/removeFromRoom',authMiddleware.isAuth, tenantController.removeFromRoom)

router.post('/getTenantTransfer',authMiddleware.isAuth,tenantController.getTenantTransfer)

router.post('/tenantTransfer',authMiddleware.isAuth,tenantController.tenantTransfer)

router.post('/receiveTenant',authMiddleware.isAuth, tenantController.receiveTenant)

router.post('/listOfRentedRooms',authMiddleware.isAuth, tenantController.getListOfRentedRooms)


module.exports = router;