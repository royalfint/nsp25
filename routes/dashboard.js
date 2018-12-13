var express = require("express"),
    router  = express.Router();
    
router.get("/", function(req, res) {
   res.render("dashboard/posts");
});

router.get("/products", function(req, res) {
   res.render("dashboard/products");
});

module.exports = router;