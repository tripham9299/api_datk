var mongoose = require('mongoose');
var Schema= mongoose.Schema
var postSchema = new Schema({

	user: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	content : String,
	time: {
		type: Date,
		default: Date.now
	}

});




module.exports =  mongoose.model('posts', postSchema);