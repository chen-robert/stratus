const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  return res.render("calendar");
});

router.post("/addTask", async (req, res) => {
  const {text, date} = req.body;

  await db.addTask({
    text, 
    date, 
    completed: false,
    uid: req.session.uid
  });

  res.end();
});

router.post("/removeTask", async (req, res) => {
  const {id} = req.body;

  await db.removeTask(req.session.uid, id);

  res.end();
});

router.post("/markTask", async (req, res) => {
  const {id, completed} = req.body;

  await db.markTask(req.session.uid, id, completed);

  res.end();
});

router.get("/list", async (req, res) => {
  const {start, end} = req.query;

  res.send(await db.getTasks(req.session.uid, start, end));
})

module.exports = router;
