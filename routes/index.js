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

app.get("/addtocart", function(req, res) {
    if (!req.session.cart) req.session.cart = [];
    
    if (!req.query.product) return res.redirect("back");
    
    Product.findById(req.query.product, function(err, prod){
        if (err) console.log(err);
        
        console.log(prod);
        req.session.cart.push({image: prod.image, name: prod.name, price: prod.price});
        res.redirect("back");
    });
});

app.get("/rmfromcart", function(req, res) {
    if (!req.session.cart) req.session.cart = [];
    
    if(!req.query.name) return res.redirect("back");
    
    req.session.cart.forEach(function(item, index, object) {
        if (item.name == req.query.name)
            object.splice(index, 1);
            
        res.redirect("back");
    });
});

app.get("/checkout", function(req, res) {
    if (!req.session.cart) req.session.cart = [];
    
    if (!req.query.product) return res.redirect("back");
    
    Product.findById(req.query.product, function(err, prod){
        if (err) console.log(err);
        
        console.log(prod);
        req.session.cart.push({image: prod.image, name: prod.name, price: prod.price});
        
        res.redirect("/checkout");
    });
});

//PRODUCTS PAGE
app.get("/products", function(req, res) {
    var query = {};
    
    if(req.query.cat) query.cat = req.query.cat;
    if(req.query.sub) query.subcat = req.query.sub;
    
    console.log("cart: ", req.session.cart);
    
    Product.find(query).sort({created: -1}).exec(function(err, allProducts){
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