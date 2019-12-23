const express = require("express");
const { encrypt, decrypt } = require("../util");
const router = express.Router();

const { login } = require("../api.js");

router.get("/", function (req, res, next) {
  res.render("login", { action: "/login" });
});

router.get("/auto", async (req, res) => {
  if(!req.session.creds) return res.redirect("/login");
  
  const username = decrypt(req.session.creds.username);
  const password = decrypt(req.session.creds.password);

  const { err, name, cookies } = await login({
    username,
    password
  });

  if (err) {
    req.session.error = err;
    return res.redirect("/login");
  }
  req.session.username = name;
  req.session.cookies = cookies;
  req.session.uid = username;

  res.redirect("/");
});

router.post("/", async (req, res) => {
  if (req.body.save) {
    req.session.creds = {
      username: encrypt(req.body.username),
      password: encrypt(req.body.password)
    };
  }

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
  req.session.uid = req.body.username;

  res.redirect("/");
});

module.exports = router;
