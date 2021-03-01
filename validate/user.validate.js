const { check } = require('express-validator');

let validationLogin= ()=>{
	return [
	check('user.username')
		.exists()
		.notEmpty().withMessage('Vui lòng nhập username'),

	check('user.password')
		.exists()
		.notEmpty().withMessage('Vui lòng nhập password')
		.isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')

	]
}

module.exports= {validationLogin: validationLogin}