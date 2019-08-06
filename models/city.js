var mongoose = require("mongoose");

var citySchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	// embedding comment IDs
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("City", citySchema);