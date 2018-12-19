var express      = require("express"),
    User         = require("../models/user"),
    cats         = require("../models/cats.json").list,
    passport     = require("passport"),
    sgMail       = require("@sendgrid/mail"),
    Post         = require("../models/post"),
    Complex      = require("../models/complex"),
    Product      = require("../models/product");

var app = express.Router();
var middleware = require("../middleware/index.js");
var api_key     = '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',
    adminEmail  = "royalfint@hotmail.com";

app.get("/contacts", function(req, res) { res.render("contacts"); });
app.get("/discount", function(req, res) { res.render("discount"); });

app.get("/checkout", function(req, res) { 
    
    var form = {};
    if(req.session.checkout) form = req.session.checkout;
    
    res.render("checkout", {q: form});
});

app.post("/checkout", function(req, res){
    var data = {
        p: req.body.products,
        f: req.body.firstname,
        l: req.body.lastname,
        r: req.body.partner,
        c: req.body.city,
        a: req.body.area,
        d: req.body.address,
        z: req.body.zip,
        t: req.body.phone
    };
    
    req.session.checkout = data;
    console.log("session: ", req.session.checkout);
            
    if (!data.p) { req.flash("error", "Добавьте что-нибудь в корзину!"); return res.redirect("/checkout"); }
    if (!data.f) { req.flash("error", "Введи свое имя!"); return res.redirect("/checkout"); }
    if (!data.l) { req.flash("error", "Введи свою фамилию!"); return res.redirect("/checkout"); }
    if (!data.c) { req.flash("error", "Введи свой город!"); return res.redirect("/checkout"); }
    if (!data.a) { req.flash("error", "Введи свою область!"); return res.redirect("/checkout"); }
    if (!data.d) { req.flash("error", "Введи свой адрес!"); return res.redirect("/checkout"); }
    if (!data.z) { req.flash("error", "Введи свой индекс!"); return res.redirect("/checkout"); }
    if (!data.t) { req.flash("error", "Введи свой номер телефона!"); return res.redirect("/checkout"); }
    
    sgMail.setApiKey(api_key);
        const msg = {
            to: adminEmail,
            from: 'no-reply@nsp25.kz',
            subject: 'Новый заказ на Nsp25.kz',
            html: `Имя: ${data.f}<br>Фамилия: ${data.l}<br>Партнер: ${data.r}<br>Адрес: ${data.d}<br>
            Город: ${data.c}<br>Область: ${data.a}<br>Индекс: ${data.z}<br>Телефон: ${data.t}<br>Товары: ${data.p}<br>`,
    };
    sgMail.send(msg); 
    
    req.flash("success", "Ваша заказ успешно офомлен! Мы позвоним вам в ближайшее время.");
    return res.redirect("/checkout");
});

app.get("/posts", function(req, res) { 
    Post.find({}).sort({created: -1}).exec(function(err, allPosts){
        if(err) console.log(err);
            
        res.render("posts", {posts: allPosts });
    });
});

app.get("/complex", function(req, res) { 
    Complex.find({}).sort({created: -1}).exec(function(err, allComplexes){
        if(err) console.log(err);
            
        res.render("complexes", {posts: allComplexes });
    });
});

//HOME PAGE
app.get("/", function(req, res) { 
    Product.find({}).sort({views: -1}).limit(4).exec(function(err, allProducts){
        if(err) console.log(err);
        
        Post.find({}).sort({views: -1}).limit(4).exec(function(err, allPosts){
            if(err) console.log(err);
            res.render("home", {products: allProducts, posts: allPosts });
        });
    });
});

//SET PRODUCT SORT OPTIONS
app.get("/sortProds", function(req, res) {
    if(!req.query.sort) return res.redirect("back");
    
    req.session.sort = req.query.sort;
    return res.redirect("back");
});

//SEARCH RESULTS
app.post("/search", function(req, res) {
    if(!req.body.query) return res.redirect("back");
    
    var re = new RegExp(req.body.query, 'i');
    Product.find().or([{ 'name': { $regex: re }}, { 'desc': { $regex: re }}]).exec(function(err, prods) {
        if (err) console.log(err);
        
        Post.find().or([{ 'name': { $regex: re }}, { 'desc': { $regex: re }}]).exec(function(err, posts) {
        if (err) console.log(err);
        
            Complex.find().or([{ 'name': { $regex: re }}, { 'desc': { $regex: re }}]).exec(function(err, complexes) {
            if (err) console.log(err);
            
                res.render("search", {products: prods, posts: posts, complexes: complexes});
            });
        });
    });
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
        if (item.name == req.query.name) {
            object.splice(index, 1);
            return res.redirect("back");
        }
    });
});

app.get("/buytocart", function(req, res) {
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
    
    if(!req.session.sort) req.session.sort = "created";
    var ses = req.session.sort, sort = {created: -1};
    
    switch(ses){
        case "views":
            sort = {views: -1}; break;
        case "cheap":
            sort = {price: 1}; break;
        case "expensive":
            sort = {price: -1}; break;
        case "name":
            sort = {name: 1}; break;
    }
        
    
    Product.find(query).sort(sort).exec(function(err, allProducts){
        if(err) console.log(err);
        
        var formquery = {};
        
        if(req.session.search)
            formquery = req.session.search;
        
        res.render("products", {products: allProducts, q: formquery, cat: query.cat, sub: query.subcat });
    });
});

//PRODUCT SHOWPAGE MOREEE
app.get("/products/:id",function(req, res){
    Product.findById(req.params.id).exec(function(err, foundProduct){
        if(err) console.log(err);
        
        foundProduct.views += 1;
        foundProduct.save();
        res.render("single-product", {product: foundProduct, cats: cats, folder: middleware.folder});
    });
});

app.get("/post/:id", function(req, res) {
    Post.findById(req.params.id).exec(function(err, foundPost){
        if(err) console.log(err);
        
        foundPost.views += 1;
        foundPost.save();
        res.render("single-post", {post: foundPost, cats: cats, folder: middleware.folder});
    });
});

app.get("/complex/:id", function(req, res) {
    Complex.findById(req.params.id).exec(function(err, foundComplex){
        if(err) console.log(err);
        
        foundComplex.views += 1;
        foundComplex.save();
        res.render("single-post", {post: foundComplex, cats: cats, folder: middleware.folder});
    });
});

module.exports = app;