var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    short: String,
    cat: String,
    created: Date,
    views: Number
});

module.exports = mongoose.model("Post", postSchema);
