var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var cities = 
	[
		{name: "Tokyo", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Tower_and_around_Skyscrapers.jpg/238px-Tokyo_Tower_and_around_Skyscrapers.jpg"},
		{name: "Hong Kong", image: "https://www.nationsonline.org/gallery/Hong-Kong/Hong-Kong-skyline-at-night.jpg" },
		{name: "Santorini", image: "http://www.visitgreece.gr/deployedFiles/StaticFiles/Photos/Generic%20Contents/Nisia/santorini_2_view_560.jpg"}
	];

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/cities", function(req, res) {
	

	res.render("cities", {cities: cities});
});

// create a post route
app.post("/cities", function(req, res) {
	var name = req.body.name
	var image = req.body.image;
	var newCity = {name: name, image: image}
	cities.push(newCity);
	// redirect back to city page back to get
	res.redirect("/cities");
});

// shows the form that sends data to post route
app.get("/cities/new", function(req, res) {
	res.render("new.ejs")
});

var port = process.env.port || 3000;
app.listen(3000);