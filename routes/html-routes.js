// Variables & Requires
var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var db = require("./../models");
var linkBase = "https://old.reddit.com"
// 
module.exports = function (app) {
    // A GET route for scraping the echoJS website
    app.get("/", function (req, res) {
        res.render("index", {});
    });
    // Scrape
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get(linkBase).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // Now, we grab every h2 within an article tag, and do the following:
            $("p.title").each(function (i, element) {
                // Save an empty result object
                var result = {};
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(element)
                    .children("a")
                    .text();
                result.link = $(element)
                    .children("a")
                    .attr("href");
                if (!result.title) {
                    result.title = "title result not found!"
                }
                if (!result.link) {
                    result.link = "link result not found!"
                } else if (result.link.indexOf("http") < 0 && result.link.indexOf("www.") < 0) {
                    result.link = linkBase + result.link;
                }
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log("this is the article" + dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
            // Send a message to the client
            res.render("index", {});
        });
    });
    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // 
    app.get("/api/comments", function (req, res) {
        db.Comment.find({})
            .then(function (dbComment) {
                res.json(dbComment);
            })
            .catch(function (err) {
                res.json(err)
            });
    });
    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({
                _id: req.params.id,
            })
            // ..and populate all of the notes associated with it
            .populate("comment")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function (dbComment) {
                db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        comment: dbComment._id
                    }
                }, {
                    new: true
                }).then(function (data) {
                    // If we were able to successfully update an Article, send it back to the client
                    res.json(dbArticle);
                }).catch(function (err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // 
    app.post("/api/comments/:comment", function (req, res) {
        db.Comment.create(req.body)
            .then(function (dbComment) {
                res.json(dbComment);
            })
            .catch(function (err) {
                res.json(err)
            });

    });
    // delete
    app.delete("/api/comments/:id", function (req, res) {
        var id = mongoose.Types.ObjectId(req.params.id);
        db.Comment.deleteOne({
            _id: id
        }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            console.log("Deleted")
        });
    });
    // 
    app.get("/deleteAll", function (req, res) {
        db.Comment.deleteMany({}).then(function (data) {
            console.log("hello");
            db.Article.deleteMany({}).then(function (data) {
                console.log("database deleted");
            }).catch(function (err) {
                console.log(err)
            })
        }).catch(function (err) {
            console.log(err)
        })
        res.render("index", {});
    });

};