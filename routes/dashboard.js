var express    = require("express"),
    middleware = require("../middleware/"),
    mongoose   = require("mongoose"),
    cats       = require("../models/cats.json").list,
    Post       = require("../models/post"),
    Complex       = require("../models/complex"),
    router     = express.Router();
    
router.get("/", middleware.isLoggedIn ,function(req, res) {
   res.redirect('/dashboard/products');
});

/***************** POSTS *******************/

//EDIT POST ROUTE
router.get("/posts/:id/edit", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){ req.flash("error", err.message); return res.redirect("back"); }
        
        res.render("dashboard/posts/edit", {post: foundPost, cats: cats, folder: middleware.folder});
    });
});

//POST NEW PRODUCT INTO DB 
router.post("/posts", middleware.isLoggedIn, function(req, res) {
    var post = {
        name: req.body.name,
        cat: req.body.cat,
        short: req.body.short,
        desc: req.body.desc,
        img: req.body.img
    };
        
    req.session.fc = post;
        
    if(!post.name || post.name.length < 3 ) {
        req.flash("error", "Введите имя поста!");
        return res.redirect("/dashboard/posts/new"); }
            
    if(post.img.length == 0) {
        req.flash("error", "Введите ссылку на картинку поста!");
        return res.redirect("/dashboard/posts/new"); }
        
    if(post.cat == "Категория товара"){
        req.flash("error", "Выберите категорию поста!");
        return res.redirect("/dashboard/posts/new"); }
        
    if(!post.short || post.short.length < 10){
        req.flash("error", "Краткое описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/posts/new"); }
        
    if(!post.desc || post.desc.length < 10){
        req.flash("error", "Описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/posts/new"); }
        
    var newPost = {
        name: post.name,
        image: post.img,
        cat: post.cat,
        short: post.short,
        desc: post.desc,
        views: 0,
        created: middleware.toLocalTime(new Date())
    };
    Post.create(newPost, function(err, newlyCreated){
        if(err) console.log(err);
         
        req.session.fc = {photos: []};
        res.redirect("/dashboard/posts");
    });
});

//NEW POST FORM
router.get("/posts/new", middleware.isLoggedIn, function(req, res) {
    
    if(!req.session.fc)
        req.session.fc = {photos: []};
        
    res.render("dashboard/posts/new", {fc: req.session.fc, cats: cats, folder: middleware.folder});
});

//DESTROY POST ROUTE
router.get("/posts/delete/:id", middleware.isLoggedIn, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/posts");
        }else{
            req.flash("success", "Вы только что удалили post!");
            res.redirect("/dashboard/posts");
        }
    });
});

//UPDATE POST ROUTE
router.put("/posts/:id", middleware.isLoggedIn, function(req, res){
    var post = {
        name: req.body.name,
        cat: req.body.cat,
        short: req.body.short,
        desc: req.body.desc,
        img: req.body.img
    };
        
    if(!post.name || post.name.length < 3 ) {
        req.flash("error", "Введите имя поста!");
        return res.redirect("/dashboard/posts/new"); }
            
    if(post.img.length == 0) {
        req.flash("error", "Введите ссылку на картинку поста!");
        return res.redirect("/dashboard/posts/new"); }
        
    if(post.cat == "Категория товара"){
        req.flash("error", "Выберите категорию поста!");
        return res.redirect("/dashboard/posts/new"); }
            
    if(!post.short || post.short.length < 10){
        req.flash("error", "Краткое описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/posts/new"); }
        
    if(!post.desc || post.desc.length < 10){
        req.flash("error", "Описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/posts/new"); }
        
    var newPost = {
        name: post.name,
        image: post.img,
        cat: post.cat,
        short: post.short,
        desc: post.desc
    };
        
    Post.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(req.params.id) }, newPost, function(err){
        if (err) console.log(err);

        return res.redirect("/dashboard/posts");
    });
});

router.get("/posts", middleware.isLoggedIn,  function(req, res) {
    Post.find({}, function(err, posts){
        if(err) console.log(err);
        
        res.render("dashboard/posts", {posts: posts}); 
    });
});




/***************** COMPLEXES *******************/

//EDIT COMPLEX ROUTE
router.get("/complexes/:id/edit", middleware.isLoggedIn, function(req, res){
    Complex.findById(req.params.id, function(err, foundPost){
        if(err){ req.flash("error", err.message); return res.redirect("back"); }
        
        res.render("dashboard/complexes/edit", {post: foundPost, cats: cats, folder: middleware.folder});
    });
});

//POST NEW COMPLEX INTO DB 
router.post("/complexes", middleware.isLoggedIn, function(req, res) {
    var post = {
        name: req.body.name,
        short: req.body.short,
        desc: req.body.desc,
        img: req.body.img
    };
        
    req.session.fc = post;
        
    if(!post.name || post.name.length < 3 ) {
        req.flash("error", "Введите имя программы!");
        return res.redirect("/dashboard/complexes/new"); }
            
    if(post.img.length == 0) {
        req.flash("error", "Введите ссылку на картинку программы!");
        return res.redirect("/dashboard/complexes/new"); }
        
    if(!post.short || post.short.length < 10){
        req.flash("error", "Краткое описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/complexes/new"); }
        
    if(!post.desc || post.desc.length < 10){
        req.flash("error", "Описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/complexes/new"); }
        
    var newPost = {
        name: post.name,
        image: post.img,
        short: post.short,
        desc: post.desc,
        views: 0,
        created: middleware.toLocalTime(new Date())
    };
    Complex.create(newPost, function(err, newlyCreated){
        if(err) console.log(err);
         
        req.session.fc = {photos: []};
        res.redirect("/dashboard/complexes");
    });
});

//NEW COMPLEX FORM
router.get("/complexes/new", middleware.isLoggedIn, function(req, res) {
    
    if(!req.session.fc)
        req.session.fc = {photos: []};
        
    res.render("dashboard/complexes/new", {fc: req.session.fc, cats: cats, folder: middleware.folder});
});

//UPDATE COMPLEX ROUTE
router.put("/complexes/:id", middleware.isLoggedIn, function(req, res){
    var post = {
        name: req.body.name,
        short: req.body.short,
        desc: req.body.desc,
        img: req.body.img
    };
        
    if(!post.name || post.name.length < 3 ) {
        req.flash("error", "Введите имя программы!");
        return res.redirect("/dashboard/complexes/new"); }
            
    if(post.img.length == 0) {
        req.flash("error", "Введите ссылку на картинку программы!");
        return res.redirect("/dashboard/complexes/new"); }
            
    if(!post.short || post.short.length < 10){
        req.flash("error", "Краткое описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/complexes/new"); }
        
    if(!post.desc || post.desc.length < 10){
        req.flash("error", "Описание должно быть не короче 10 символов!");
        return res.redirect("/dashboard/complexes/new"); }
        
    var newPost = {
        name: post.name,
        image: post.img,
        short: post.short,
        desc: post.desc
    };
        
    Complex.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(req.params.id) }, newPost, function(err){
        if (err) console.log(err);

        return res.redirect("/dashboard/complexes");
    });
});

router.get("/complexes", middleware.isLoggedIn,  function(req, res) {
    Complex.find({}, function(err, posts){
        if(err) console.log(err);
        
        res.render("dashboard/complexes", {posts: posts}); 
    });
});

//DESTROY COMPLEX ROUTE
router.get("/complexes/delete/:id", middleware.isLoggedIn, function(req, res){
    Complex.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/complexes");
        }else{
            req.flash("success", "Вы только что удалили complex!");
            res.redirect("/dashboard/complexes");
        }
    });
});

module.exports = router;