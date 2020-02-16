var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
      type: String,
      required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "comment"
    }

});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;