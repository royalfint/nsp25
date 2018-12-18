var express = require("express"),
    middleware = require("../middleware/"),
    router  = express.Router();
    
router.get("/", middleware.isLoggedIn ,function(req, res) {
   res.render("dashboard/index");
});

router.get("/products", function(req, res) {
   res.render("dashboard/products");
});

module.exports = router;