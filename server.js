var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// var MONGODB_URL = process.env.MONGODB_URL || "mongodb://root:password1@ds121603.mlab.com:21603/heroku_4d5jj8cp";
mongoose.connect("mongodb://localhost/unit18Populater", {
    useNewUrlParser: true
});
// 
var routes = require("./routes/html-routes");
routes(app);
// 
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "! http://localhost:" + PORT);
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/scrape");
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/index");
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/articles");
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/articles/:id");
})