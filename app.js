var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/cities_db");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var citySchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var City = mongoose.model("City", citySchema);

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/cities", function(req, res) {
	City.find({}, function(err, allcities) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {cities: allcities});
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
	res.render("new.ejs");
});

// SHOW - shows more info
app.get('/cities/:id', function(req, res) {
	City.findById(req.params.id, function(err, foundCity){
		if(err) {
			console.log(err);
		} else {
			res.render("show", {city: foundCity});
		}
	});
	// find the city with id and then render show template with city
});

var port = process.env.port || 9000;
app.listen(9000);