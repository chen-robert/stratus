const express = require("express");
const router = express.Router();
const { getCourses } = require("../api.js");

router.get("/", async (req, res, next) => {
  const { courses } = await getCourses(req.session.cookies);
  res.render("index", { name: req.session.username, courses });
});

router.get("/class/:id", async (req, res) => {
  const { weights } = await classData(req.params.id);

  const curr = req.session.classes.filter(({ id }) => id === req.params.id);
  if (curr.length !== 1) return res.status(404).end();

  res.render("class", { title: curr[0].name, weights });
});

module.exports = router;
