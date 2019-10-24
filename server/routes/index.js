var express = require("express");
var router = express.Router();

const { classData } = require("../api.js");

router.get("/", (req, res, next) => {
  res.render("index", { title: req.session.username, classes: req.session.classes });
});

router.get("/class/:id", async (req, res) => {
  const { weights } = await classData(req.params.id);

  const curr = req.session.classes.filter(({ id }) => id === req.params.id);
  if (curr.length !== 1) return res.status(404).end();

  res.render("class", { title: curr[0].name, weights });
});

module.exports = router;
