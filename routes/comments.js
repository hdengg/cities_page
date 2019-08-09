var express = require("express");
var router = express.Router({mergeParams: true});
var City = require("../models/city");
var Comment = require("../models/comment");

// get new comments
router.get("/new", isLoggedIn, function(req, res) {
	City.findById(req.params.id, function(err, city) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {city: city});
		}
	})
});

// create new comment
router.post("/", isLoggedIn, function(req, res) {
	// lookup city by ID
	// create new comment
	City.findById(req.params.id, function(err, city) {
		if (err) {
			console.log(err);
			res.redirect("/cities");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					// associate comment to city
					city.comments.push(comment);
					city.save();
					res.redirect('/cities/' + city._id);
				}
			})
		}
	})
})

// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;