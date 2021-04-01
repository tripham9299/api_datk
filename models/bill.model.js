var mongoose = require('mongoose');
var Schema= mongoose.Schema
var billSchema = new Schema({

	userRent: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	roomRent:{
		type:Schema.Types.ObjectId,
		ref:'rooms'
	},
	status: String,
	time: {
		type: Date,
		default: Date.now
	}

});




module.exports =  mongoose.model('bills', billSchema);