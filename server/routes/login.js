var express = require('express');
var router = express.Router();

const { login } = require("../api.js");

router.get('/', function(req, res, next) {
  res.render('login', { action: '/login' });
});

router.post("/", async (req, res) => {
  const {err, name, classes} = await login(req.body.username, req.body.password);

  if (err) {
    req.session.error = "Invalid username or password";
    return res.redirect("back");
  }
  req.session.username = name;
  req.session.classes = classes;

  res.redirect("/");
});

module.exports = router;
