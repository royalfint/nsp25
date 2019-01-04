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
    
var indexRoutes    = require("./routes/index"),
    dashRoutes     = require("./routes/dashboard"),
    productRoutes  = require("./routes/products"),
    authRoutes     = require("./routes/auth");

var app = express(),
    redirect  = require('express-http-to-https').redirectToHTTPS;

mongoose.connect("mongodb://nspadmin:YtEpyftimVjq1Gfhjkm@ds119024.mlab.com:19024/nsp25", { useNewUrlParser: true } );
mongoose.set('useFindAndModify', false);
//global.siteurl = "https://nsp25-royalfint.c9users.io";
global.siteurl = "https://www.nsp25.kz";
global.rate = 370;

app.use(redirect([/localhost:(\d{4})/], [/\/insecure/], 301));
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
    res.locals.rate = global.rate;
    res.locals.status = req.session.status;
    res.locals.cart = req.session.cart;
    next();
});

app.use(indexRoutes);
app.use(authRoutes);
app.use("/dashboard", dashRoutes);
app.use("/dashboard/products", productRoutes);


/*
app.get("/test", function(req, res) {
    Product.find({}, function(err, prods){
        if(err) console.log(err);
        
        prods.forEach(function(item){
           item.name = item.name.replace('-', ' ');
           console.log(item.name);
           item.save();
        });
        
        res.send({'status': 200});
    });
});
*/


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has been started!");
});