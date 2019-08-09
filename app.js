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


// require routes
var commentRoutes = require("./routes/comments"),
	cityRoutes = require("./routes/cities"),
	indexRoutes = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/cities_db', {useNewUrlParser: true});
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

app.use(indexRoutes);
app.use("/cities", cityRoutes);
app.use("/cities/:id/comments", commentRoutes);

var port = process.env.port || 9000;
app.listen(9000);