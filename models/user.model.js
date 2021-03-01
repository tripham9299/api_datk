var mongoose = require('mongoose');
var Schema= mongoose.Schema
var userSchema = new Schema({
	username : String,
	fullname : String,
	email: String,
	password: String,
	mobile: String,
	avatar: {
		type: String,
		default: null
	},
	role: {
		type:String
	},
	isBlock: {
		type: Boolean,
		default: false
	}

});




module.exports =  mongoose.model('users', userSchema);