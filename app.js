var express        = require("express"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    multer         = require('multer'),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    parser         = require("body-parser");
    
var User           = require("./models/user"),
    Product        = require("./models/product");
    
var indexRoutes    = require("./routes/index");

global.siteurl = "https://nsp25-royalfint.c9users.io";
//global.siteurl = "https://www.bazarlar.kz";

var app = express();
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(parser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.url = global.siteurl;
   res.locals.status = req.session.status;
   next();
});

app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has been started!");
});