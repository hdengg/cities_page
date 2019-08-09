var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	City = require("./models/city"),
	seedDB = require("./seeds"),
	User = require("./models/user"),
	Comment = require("./models/comment");

mongoose.connect("mongodb://localhost/cities_db");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT 
app.use(require("express-session")({
	secret: "Corgis are the best",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for routes
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});


app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/cities", function(req, res) {
	
	City.find({}, function(err, allcities) {
		if (err) {
			console.log(err);
		} else {
			res.render("cities/index", {cities: allcities, currentUser: req.user});
		}
	});
});

// create a post route
app.post("/cities", function(req, res) {
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
app.get("/cities/new", function(req, res) {
	res.render("cities/new");
});

// SHOW - shows more info
app.get('/cities/:id', function(req, res) {
	City.findById(req.params.id).populate("comments").exec(function(err, foundCity) {
		if(err) {
			console.log(err);
		} else {
			res.render("cities/show", {city: foundCity});
		}
	});
	// find the city with id and then render show template with city
});

// COMMENTS ROUTES 
app.get("/cities/:id/comments/new", isLoggedIn, function(req, res) {
	City.findById(req.params.id, function(err, city) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {city: city});
		}
	})
});

app.post("/cities/:id/comments", isLoggedIn, function(req, res) {
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

// AUTH ROUTES
app.get("/register", function(req, res){
	res.render("register");
})

// Sign up logic
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
	res.render("login");
})

// handle login logic -- LOCAL strategy
app.post("/login", passport.authenticate("local", {successRedirect:"/cities",
												   failureRedirect:"/login"}),
												   function(req, res) {	
});

// log out route 
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/cities");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

var port = process.env.port || 9000;
app.listen(9000);