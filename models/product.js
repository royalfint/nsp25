var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    short: String,
    cat: String,
    subcat: String,
    price: Number,
    created: Date,
    views: Number
});

module.exports = mongoose.model("Product", productSchema);
