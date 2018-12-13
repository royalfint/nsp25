var express      = require("express"),
    Product      = require("../models/product"),
    User         = require("../models/user"),
    cats         = require("../models/cats.json").list,
    path         = require("path"),
    router       = express.Router(),
    middleware   = require("../middleware/index.js");

//==========================APP ROUTES=========================//

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

//POST NEW PRODUCT INTO DB
router.post("/", middleware.isLoggedIn, function(req, res) {
        var post = {
            name: req.body.name,
            cat: req.body.cat,
            subcat: req.body.subcat,
            type: req.body.type,
            price: req.body.price,
            photos: [],
            desc: req.body.desc,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };
        
        req.session.fc = post;
        
        if(req.body.firstfile) post.photos.push(req.body.firstfile);
        if(req.body.secondfile) post.photos.push(req.body.secondfile);
        if(req.body.thirdfile) post.photos.push(req.body.thirdfile);
        if(req.body.fourthfile) post.photos.push(req.body.fourthfile);
        if(req.body.fifthfile) post.photos.push(req.body.fifthfile);
        if(req.body.sixthfile) post.photos.push(req.body.sixthfile);
        
        if(post.photos.length == 0) {
            req.flash("error", "Добавьте хоть одну фотографию!");
            return res.redirect("/products/new");
        }
        
        if(!post.name || post.name.length < 3 ) {
            req.flash("error", "Введите имя товара!");
            return res.redirect("/products/new");
        }
        
        if(post.cat == "Категория товара"){
            req.flash("error", "Выберите категорию товара!");
            return res.redirect("/products/new");
        }
        
        if(post.subcat == "Подкатегория товара"){
            req.flash("error", "Выберите подкатегорию товара!");
            return res.redirect("/products/new");
        }
        
        if(!post.desc || post.desc.length < 10){
            req.flash("error", "Описание должно быть не короче 10 символов!");
            return res.redirect("/products/new");
        }
        
        if(!post.price || post.price == "0") {
            req.flash("error", "Введите цену!");
            return res.redirect("/products/new");
        }
        
        var newProduct = {
            name: post.name,
            image: post.photos,
            cat: post.cat,
            subcat: post.subcat,
            desc: post.desc,
            author: post.author,
            type: post.type,
            price: post.price,
            created: middleware.toLocalTime(new Date())
        };
        Product.create(newProduct, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                req.session.fc = {photos: []};
                res.redirect("/products");
            }
        });
});

//EDIT PRODUCT ROUTE
router.get("/:id/edit", middleware.checkProductOwnership, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else{
                console.log(foundProduct);
                res.render("product/edit", {product: foundProduct, cats: cats, folder: middleware.folder});
            }
        });
});

//UPDATE PRODUCT ROUTE
router.put("/:id", middleware.checkProductOwnership, function(req, res){
        var post = {
            id: req.params.id,
            name: req.body.name,
            cat: req.body.cat,
            subcat: req.body.subcat,
            type: req.body.type,
            price: req.body.price,
            photos: [],
            desc: req.body.desc,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };
        
        if(req.body.firstfile) post.photos.push(req.body.firstfile);
        if(req.body.secondfile) post.photos.push(req.body.secondfile);
        if(req.body.thirdfile) post.photos.push(req.body.thirdfile);
        if(req.body.fourthfile) post.photos.push(req.body.fourthfile);
        if(req.body.fifthfile) post.photos.push(req.body.fifthfile);
        if(req.body.sixthfile) post.photos.push(req.body.sixthfile);
        
        if(post.photos.length == 0) {
            req.flash("error", "Добавьте хоть одну фотографию!");
            return res.redirect("/products/new");
        }
        
        if(!post.name || post.name.length < 3 ) {
            req.flash("error", "Введите имя товара!");
            return res.redirect("back");
        }
        
        if(post.cat == "Категория товара"){
            req.flash("error", "Выберите категорию товара!");
            return res.redirect("back");
        }
        
        if(post.subcat == "Подкатегория товара"){
            req.flash("error", "Выберите подкатегорию товара!");
            return res.redirect("back");
        }
        
        if(!post.desc || post.desc.length < 10){
            req.flash("error", "Описание должно быть не короче 10 символов!");
            return res.redirect("back");
        }
        
        if(!post.price || post.price == "0") {
            req.flash("error", "Введите цену!");
            return res.redirect("back");
        }
    
        var newProduct = {
            name: post.name,
            image: post.photos,
            cat: post.cat,
            subcat: post.subcat,
            type: post.type,
            desc: post.desc,
            author: post.author,
            price: post.price
        };
        Product.findByIdAndUpdate(post.id, newProduct, function(err, justUpdated){
            if(err){
                console.log(err);
            } else {
                console.log(justUpdated);
                return res.redirect("/products");
            }
        });
});

//DESTROY PRODUCT ROUTE
router.delete("/:id", middleware.checkProductOwnership, function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/products");
        }else{
            req.flash("success", "Вы только что удалили товар!");
            res.redirect("/products");
        }
    });
});

module.exports = router;