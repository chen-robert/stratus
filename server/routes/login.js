var express = require("express");
var router = express.Router();

const { login } = require("../api.js");

router.get("/", function (req, res, next) {
  res.render("login", { action: "/login" });
});

router.post("/", async (req, res) => {
  const { err, name, cookies } = await login({
    username: req.body.username,
    password: req.body.password
  });

  if (err) {
    req.session.error = err;
    return res.redirect("back");
  }
  req.session.username = name;
  req.session.cookies = cookies;

  res.redirect("/");
});

module.exports = router;
