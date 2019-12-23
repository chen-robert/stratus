const express = require("express");
const router = express.Router();

const { getCourses, getCourseData } = require("../api.js");

router.get("/", async (req, res, next) => {
  const { courses } = await getCourses(req.session.cookies);

  if (courses.length === 0) return res.redirect("/login/auto");

  res.render("index", { name: req.session.username, courses });
});

router.get("/class/:id", async (req, res) => {
  const { err, name, weights, assignments } = await getCourseData(req.session.cookies, req.params.id);

  if (err) return res.redirect("/login/auto");

  res.render("class", { title: name, weights, assignments });
});


router.use("/calendar", require("./calendar"));

module.exports = router;
