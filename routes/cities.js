var express = require("express");
var router = express.Router();
var City = require("../models/city");

router.get("/", function(req, res) {
	
	City.find({}, function(err, allcities) {
		if (err) {
			console.log(err);
		} else {
			res.render("cities/index", {cities: allcities, currentUser: req.user});
		}
	});
});

// create a post route
router.post("/cities", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCity = {name: name, image: image, description: desc};
	// Create new city and save to DB
	City.create(newCity, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/cities");
		}
	});
});

// shows the form that sends data to post route
router.get("/new", function(req, res) {
	res.render("cities/new");
});

// SHOW - shows more info
router.get('/:id', function(req, res) {
	City.findById(req.params.id).populate("comments").exec(function(err, foundCity) {
		if(err) {
			console.log(err);
		} else {
			res.render("cities/show", {city: foundCity});
		}
	});
	// find the city with id and then render show template with city
});

module.exports = router;