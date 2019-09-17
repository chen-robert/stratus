var express = require('express');
var request = require("request");
const cheerio = require("cheerio");

var router = express.Router();

const URL_BASE = "https://wa-bsd405-psv.edupoint.com";

router.post("/token", (req, res) => {
  request.get(`${URL_BASE}/PXP2_Login_Student.aspx?regenerateSessionId=True`, (err, response, body) => {
    const $ = cheerio.load(body);
    
    const loginForm = $("form")[0];
    const data = {};
    $(loginForm).children("input").each((i, elem) => data[$(elem).attr("name")] = $(elem).attr("value"));
    data["ctl00$MainContent$username"] = req.body.username;
    data["ctl00$MainContent$password"] = req.body.password;
    
    console.log(data);
    
    // Replace the "./" in the action url with "/"
    request.post(`${URL_BASE}${$(loginForm).attr("action").split("./").join("/")}`, {form: data}, (err, response, body) => {
      res.set("Set-Cookie", response.headers["set-cookie"]);
      res.send("");
    });
  });
    
});

module.exports = router;
