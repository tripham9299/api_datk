var mongoose = require('mongoose');
var Schema= mongoose.Schema
var transferSchema = new Schema({

	userMaster: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	userMasterTransfer : {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	userGuest: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	status:{
		type:String,
		default:"unconfimred"
	}

});




module.exports =  mongoose.model('transfers', transferSchema);