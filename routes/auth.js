var express     = require("express"),
    User  = require("../models/user"),
    passport  = require("passport"),
    sgMail   = require("@sendgrid/mail"),
    Product  = require("../models/product"),
    router = express.Router(),
    middleware = require("../middleware/index.js");

var api_key = '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';

//SIGN UP
router.post("/signup", function(req, res){
    var post = {
        username: req.body.username.trim(),
        email:    req.body.email.trim(),
        password: req.body.password.trim()
    };
    
    req.session.rf = post;
        
    if(!post.username || !post.username.match(/^[a-zA-Z0-9]+$/) || post.username.length < 3 || post.username.length > 20) {
        req.flash("error", "Логин должен быть на латинице от 3 до 20 символов!");
        return res.redirect("/signup");
    }
    
    if(!post.email || !post.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        req.flash("error", "Введите правильный E-mail!");
        return res.redirect("back");
    }
    
    if(!post.password || !post.password.match(/^[a-zA-Z0-9]+$/) || post.password.length < 6 || post.password.length > 30) {
        req.flash("error", "Пароль должен быть на латинице от 6 до 30 символов!");
        return res.redirect("/signup");
    }
    
    var newUser = new User({username: post.username});
    User.register(newUser, post.password, function(err, user){
        if(err) return res.redirect("/signup");
        
        user.token = String(middleware.folder());
        user.email = post.email;
        user.status = 0;

        user.save(function(err){
            console.log(err);
        });
        console.log("new user: ", user);
        passport.authenticate("local")(req, res, function(){
            req.session.rf = {};
            res.redirect("/myproducts");
        });
    });
});

//SIGN UP FORM
router.get("/signup", function(req, res){
    if(!req.session.rf)
        req.session.rf = {};
        
    res.render("dashboard/signup", {rf: req.session.rf});
});

//SHOW SIGN IN FORM
router.get("/signin", function(req, res){
    res.render("dashboard/signin");
});

//SIGN IN
router.post("/signin", passport.authenticate("local", 
    {
        successRedirect: "/signedin",
        failureFlash: 'Неправильный логин или пароль!',
        successFlash: 'Добро пожаловать в Bazarlar!',
        failureRedirect: "/signin"
    }), function(req, res){
});

router.get("/signedin", function(req, res) {
    User.findOne({username: req.user.username}, function(err, user) {
        if(err) console.log(err);
        if(user) req.session.status = user.status;
        console.log("new status set", req.session.status);
        res.redirect("/dashboard");
    });
});

router.get("/reset", function(req, res){
    res.render("reset");
});

router.post("/reset", function(req, res) {
    
    if(!req.body.email) {
        req.flash("error", "Введите вашу почту!");
        return res.redirect("/reset");
    }   
   
    User.findOne({email: req.body.email.trim()}, function(err, founduser) {
        if(err) console.log(err);
           
        if(!founduser) {
            req.flash("error", "Пользователя с такой почтой не существует!");
            return res.redirect("/reset");
        }
            
        sgMail.setApiKey(api_key);
        const msg = {
            to: req.body.email,
            from: 'no-reply@bazarlar.kz',
            subject: 'Сброс пароля',
            html: 'Ваш логин: ' + founduser.username + '. Пройдите по ссылке для смены вашего пароля: <a href="' + res.locals.url +'/reset/' + founduser.token + '">Нажмите здесь.</a>',
        };
        sgMail.send(msg); 
            
        req.flash("success", "Проверьте вашу почту.");
        res.redirect("/reset");
    });
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Выход из системы!");
    res.redirect("/products");
});

module.exports = router;