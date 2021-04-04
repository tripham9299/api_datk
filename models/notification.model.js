var mongoose = require('mongoose');
var Schema= mongoose.Schema
var notificationSchema = new Schema({

	user: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	contents:String,
	time: {
		type: Date,
		default: Date.now
	}

});




module.exports =  mongoose.model('notifications', notificationSchema);