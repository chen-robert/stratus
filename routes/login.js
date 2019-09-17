var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post("/", function(req, res) {
  req.session.username = req.body.username;
  
  res.redirect("/");
});

module.exports = router;
