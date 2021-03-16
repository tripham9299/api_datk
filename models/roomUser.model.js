var mongoose = require('mongoose');
var Schema= mongoose.Schema
var roomUserSchema = new Schema({

	userRent: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	roomRent:{
		type:Schema.Types.ObjectId,
		ref:'rooms'
	}

});




module.exports =  mongoose.model('roomUsers', roomUserSchema);