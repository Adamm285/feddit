// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var axios = require("axios");
var express = require("express");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 5000;
var db = require("./models");
var app = express();
// 
var MONGODB_URL = process.env.MONGODB_URL || "mongodb://root:password1@ds121603.mlab.com:21603/heroku_4d5jj8cp";
// 
mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
// 
app.get("/", function (req, res) {
    res.render("/login", {});
    // res.send("Hello world");
    // res.sendFile(path.join(__dirname + "./public/index.html"));
});
// 
app.get("/signup", function (req, res) {

});
// 
app.get("/homepage", function (req, res) {
    // First, tell the console what server.js is doing
    console.log("\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from redditt's webdev board:" +
        "\n***********************************\n");
    // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
    axios.get("https://old.reddit.com/r/webdev/").then(function (response) {
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
        // An empty array to save the data that we'll scrape
        var results = {};
        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("p.title").each(function (i, element) {
            // Save the text of the element in a "title" variable
            var title = $(element).text();
            var description = $(element).text();
            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            var link = $(element).children().attr("href");
            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                link: link,
                description: description
            });
            // 
            console.log(results);
            // 
            db.Article.create(results)
                .then(function (err) {
                    console.log(err)
                })
        });
        // Log the results once you've looped through each of the elements found with cheerio
        console.log(results);
    });
});
console.log(MONGODB_URL);
console.log(MONGODB_URL + "/homepage");
// 
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})