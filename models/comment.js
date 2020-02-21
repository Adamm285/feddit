var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    // `title` is of type String
    title:{
        type: String,
        required: true    
    }, 
    // `body` is of type String
    body: {
        type: String,
        required: true    
    },

    user: String
});

var Comment = mongoose.model("Comment", CommentSchema);


module.exports = Comment;