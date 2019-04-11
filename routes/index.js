var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.session.username });
});

router.get("/class", (req, res) => {
  res.render("class", {title: "Math HL 1"});
});

module.exports = router;
