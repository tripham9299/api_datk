var mongoose = require('mongoose');
var Schema= mongoose.Schema
var roomSchema = new Schema({

	userMaster: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	address: String,
	image : String,
	price: String,
	userRent:{
		type:Schema.Types.ObjectId,
		ref:'users',
		default:null
	}

});




module.exports =  mongoose.model('rooms', roomSchema);