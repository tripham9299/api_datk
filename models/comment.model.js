var mongoose = require('mongoose');
var Schema= mongoose.Schema
var commentSchema = new Schema({
	user: {
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	post: {
		type:Schema.Types.ObjectId,
		ref:'posts'
	},
	content : String,
	time: {
		type: Date,
		default: Date.now
	}

});




module.exports =  mongoose.model('comments', commentSchema);