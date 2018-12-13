var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    token: String,
    status: Number
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);