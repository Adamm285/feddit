var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;
var app = express();
var exphbs = require("express-handlebars");
var routes = require("./routes/html-routes");
// 
app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Connect to the Mongo DB
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
// var MONGODB_URL = process.env.MONGODB_URL || "mongodb://root:password1@ds121603.mlab.com:21603/heroku_4d5jj8cp";
mongoose.connect("mongodb://root:password1@ds121603.mlab.com:21603/heroku_4d5jj8cp", {
    useNewUrlParser: true
});
// 
routes(app);
// 
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/update");
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/scrape");
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/articles");
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/articles/:id");
    console.log("App running on port " + PORT + "! http://localhost:" + PORT);
    console.log("App running on port " + PORT + "! http://localhost:" + PORT + "/deleteAll");
})