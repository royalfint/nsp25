var mongoose = require("mongoose");

var complexSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    short: String,
    created: Date,
    views: Number
});

module.exports = mongoose.model("Complex", complexSchema);
