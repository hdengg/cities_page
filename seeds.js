var mongoose = require("mongoose");
var City = require("./models/city");
var Comment = require("./models/comment");

var seeds = [
	{
		name: "Tokyo",
		image: "https://www.irishexaminer.com/remote/content.assets.pressassociation.io/2019/03/28164823/c3ed2e7d-96b7-458c-8206-8dbf2e3e8a46.jpg?crop=0,700,7831,5105&ext=.jpg&width=648&s=ie-915483",
		description: 'Akihabara'
	},
	{
		name: "Bali",
		image: "https://media.timeout.com/images/105240189/image.jpg",
		description: 'Ulun Dalun Temple'
	},
	{
		name: "Berlin",
		image: "https://www.visitberlin.de/system/files/styles/visitberlin_bleed_header_visitberlin_mobile_1x/private/image/regierungsviertel01_DL_PPT_0.jpg?h=77a3658e&itok=vNPB4omE",
		description: "Brandenburg Gate"
	}
];

async function seedDB(){
	// wait for comment remove to finish
	try {
	await Comment.remove({});
	await City.remove({});
	for(const seed of seeds) {
		let city = await City.create(seed);
		let comment = await Comment.create(
			{
				text: "This city is amazing",
				author: "Henry"
			})
		city.comments.push(comment);
		city.save();
	}
	} catch (err) {
		console.log(err);
	}
}

module.exports = seedDB;