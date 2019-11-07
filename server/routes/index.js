const express = require("express");
const router = express.Router();
const { getCourses, getCourseData } = require("../api.js");

router.get("/", async (req, res, next) => {
  const { courses } = await getCourses(req.session.cookies);
  res.render("index", { name: req.session.username, courses });
});

router.get("/class/:id", async (req, res) => {
  const { err, name, weights, assignments } = await getCourseData(req.session.cookies, req.params.id);
  
  if(err) return res.redirect("/login");

  res.render("class", { title: name, weights, assignments });
});

module.exports = router;
