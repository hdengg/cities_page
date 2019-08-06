var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	City = require("./models/city"),
	seedDB = require("./seeds"),
	Comment = require("./models/comment");

mongoose.connect("mongodb://localhost/cities_db");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/cities", function(req, res) {
	City.find({}, function(err, allcities) {
		if (err) {
			console.log(err);
		} else {
			res.render("cities/index", {cities: allcities});
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
app.get("/cities/:id/comments/new", function(req, res) {
	City.findById(req.params.id, function(err, city) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {city: city});
		}
	})
});

app.post("/cities/:id/comments", function(req, res) {
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

var port = process.env.port || 9000;
app.listen(9000);