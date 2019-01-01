var express      = require("express"),
    Product      = require("../models/product"),
    mongoose     = require("mongoose"),
    User         = require("../models/user"),
    cats         = require("../models/cats.json").list,
    path         = require("path"),
    router       = express.Router(),
    middleware   = require("../middleware/index.js");

//==========================APP ROUTES=========================//

router.get("/", function(req, res) {
    Product.find({}, function(err, products){
        if(err) console.log(err);
        
        res.render("dashboard/products", {products: products}); 
    });
});

//NEW PRODUCT FORM
router.get("/new", middleware.isLoggedIn, function(req, res) {
    
    if(!req.session.fc)
        req.session.fc = {photos: []};
        
    res.render("dashboard/products/new", {fc: req.session.fc, cats: cats, folder: middleware.folder});
});

router.get("/clear", middleware.isLoggedIn, function(req, res) {
    req.session.fc = {photos: []};
    res.redirect("/dashboard");
});

//POST NEW PRODUCT INTO DB middleware.isLoggedIn
router.post("/", function(req, res) {
        var post = {
            name: req.body.name,
            cat: req.body.cat,
            subcat: req.body.subcat,
            price: req.body.price,
            short: req.body.short,
            desc: req.body.desc,
            img: req.body.img
        };
        
        req.session.fc = post;
        
        if(!post.name || post.name.length < 3 ) {
            req.flash("error", "Введите имя товара!");
            return res.redirect("/dashboard/products/new"); }
            
        if(post.img.length == 0) {
            req.flash("error", "Введите ссылку на картинку товара!");
            return res.redirect("/dashboard/products/new"); }
        
        if(post.cat == "Категория товара"){
            req.flash("error", "Выберите категорию товара!");
            return res.redirect("/dashboard/products/new"); }
        
        if(post.subcat == "Подкатегория товара"){
            req.flash("error", "Выберите подкатегорию товара!");
            return res.redirect("/dashboard/products/new"); }
        
        if(!post.short || post.short.length < 10){
            req.flash("error", "Краткое описание должно быть не короче 10 символов!");
            return res.redirect("/dashboard/products/new"); }
        
        if(!post.desc || post.desc.length < 10){
            req.flash("error", "Описание должно быть не короче 10 символов!");
            return res.redirect("/dashboard/products/new"); }
            
        if(!post.price || post.price == "0") {
            req.flash("error", "Введите цену!");
            return res.redirect("/dashboard/products/new"); }
        
        var newProduct = {
            name: post.name,
            image: post.img,
            cat: post.cat,
            subcat: post.subcat,
            short: post.short,
            desc: post.desc,
            price: post.price,
            views: 0,
            created: middleware.toLocalTime(new Date())
        };
        Product.create(newProduct, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                req.session.fc = {photos: []};
                console.log("new product!");
                res.redirect("/dashboard/products");
            }
        });
});

//DESTROY PRODUCT ROUTE
router.get("/delete/:id", middleware.isLoggedIn, function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/products");
        }else{
            req.flash("success", "Вы только что удалили товар!");
            res.redirect("/dashboard/products");
        }
    });
});

//EDIT PRODUCT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else{
                res.render("dashboard/products/edit", {product: foundProduct, cats: cats, folder: middleware.folder});
            }
        });
});

//UPDATE PRODUCT ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
        var post = {
            name: req.body.name,
            cat: req.body.cat,
            subcat: req.body.subcat,
            price: req.body.price,
            short: req.body.short,
            desc: req.body.desc,
            img: req.body.img
        };
        
        if(!post.name || post.name.length < 3 ) {
            req.flash("error", "Введите имя товара!");
            return res.redirect("/dashboard/products/new"); }
            
        if(post.img.length == 0) {
            req.flash("error", "Введите ссылку на картинку товара!");
            return res.redirect("/dashboard/products/new"); }
        
        if(post.cat == "Категория товара"){
            req.flash("error", "Выберите категорию товара!");
            return res.redirect("/dashboard/products/new"); }
        
        if(post.subcat == "Подкатегория товара"){
            req.flash("error", "Выберите подкатегорию товара!");
            return res.redirect("/dashboard/products/new"); }
            
        if(!post.short || post.short.length < 10){
            req.flash("error", "Краткое описание должно быть не короче 10 символов!");
            return res.redirect("/dashboard/products/new"); }
        
        if(!post.desc || post.desc.length < 10){
            req.flash("error", "Описание должно быть не короче 10 символов!");
            return res.redirect("/dashboard/products/new"); }
            
        if(!post.price || post.price == "0") {
            req.flash("error", "Введите цену!");
            return res.redirect("/dashboard/products/new"); }
        
        var newProduct = {
            name: post.name,
            image: post.img,
            cat: post.cat,
            subcat: post.subcat,
            short: post.short,
            desc: post.desc,
            price: post.price
        };
        
        Product.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(req.params.id) }, newProduct, function(err){
            if (err) console.log(err);

            return res.redirect("/dashboard/products");
        });
});

module.exports = router;