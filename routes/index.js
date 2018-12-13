var express      = require("express"),
    User         = require("../models/user"),
    cats         = require("../models/cats.json").list,
    passport     = require("passport"),
    sgMail       = require("@sendgrid/mail"),
    Product      = require("../models/product");

var app = express.Router();
var middleware = require("../middleware/index.js");
var api_key = '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';

app.get("/", function(req, res) { res.render("home"); });
app.get("/complex", function(req, res) { res.render("posts"); });
app.get("/posts", function(req, res) { res.render("posts"); });
app.get("/contacts", function(req, res) { res.render("contacts"); });
app.get("/single-post", function(req, res) { res.render("single-post"); });
app.get("/checkout", function(req, res) { res.render("checkout"); });
app.get("/discount", function(req, res) { res.render("discount"); });

//SEARCH RESULTS
app.post("/search", function(req, res) {
    if(!req.body.query) return res.redirect("back");
    
    res.render("search");
});

//PRODUCTS PAGE
app.get("/products", function(req, res) {
    Product.find({}).sort({created: -1}).exec(function(err, allProducts){
        if(err) console.log(err);
        
        var formquery = {};
        
        if(req.session.search)
            formquery = req.session.search;
        
        res.render("products", {products: allProducts, q: formquery });
    });
});

//PRODUCT SHOWPAGE MOREEE
app.get("/products/:id",function(req, res){
    Product.findById(req.params.id).exec(function(err, foundProduct){
        if(err) console.log(err);
        
        res.render("single-product", {product: foundProduct, cats: cats, folder: middleware.folder});
    });
});

module.exports = app;