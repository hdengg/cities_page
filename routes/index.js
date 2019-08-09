var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res) {
	res.render("landing");
});


// AUTH ROUTES
router.get("/register", function(req, res){
	res.render("register");
})

// Sign up logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			// render form again
			return res.render("register");
		}
		// redirect 
		passport.authenticate("local")(req, res, function() {
			res.redirect("/cities");
		});
	});
});

// get to show login form 
router.get("/login", function(req, res) {
	res.render("login");
})

// handle login logic -- LOCAL strategy
router.post("/login", passport.authenticate("local", {successRedirect:"/cities",
												   failureRedirect:"/login"}),
												   function(req, res) {	
});

// log out route 
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/cities");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;