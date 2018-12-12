var express     = require("express"),
    User  = require("../models/user"),
    passport  = require("passport"),
    sgMail   = require("@sendgrid/mail"),
    Product  = require("../models/product");
var app = express.Router();
var middleware = require("../middleware/index.js");
var api_key = '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';

app.get("/", function(req, res) { res.render("home"); });
app.get("/products", function(req, res) { res.render("products"); });
app.get("/complex", function(req, res) { res.render("posts"); });
app.get("/posts", function(req, res) { res.render("posts"); });
app.get("/contacts", function(req, res) { res.render("contacts"); });
app.get("/single-product", function(req, res) { res.render("single-product"); });
app.get("/single-post", function(req, res) { res.render("single-post"); });
app.post("/search", function(req, res) {
    if(!req.body.query) return res.redirect("back");
    
    res.render("search");
});
app.get("/checkout", function(req, res) { res.render("checkout"); });
app.get("/discount", function(req, res) { res.render("discount"); });

module.exports = app;