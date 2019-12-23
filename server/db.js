const mongoose = require("mongoose");
const url = process.env.MONGO_DB_URL || "mongodb://localhost/textbooks";

mongoose.set('useCreateIndex', true);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Established connection to database");
});

const Task = require(__dirname + "/models/task");
module.exports = {
  addTask: async ({uid, text, date, completed}) => {
    if(completed === undefined) completed = false;

    const task = new Task({uid, text, date, completed});

    await task.save();
  },
  removeTask: async (uid, id) => {
    await Task.find({
      uid,
      _id: id
    }).deleteOne()
  },
  markTask: async (uid, id, completed) => {
    await Task.findOneAndUpdate({
      uid,
      _id: id
    }).update({completed});
  },
  getTasks: async (uid, start, end) => {
    return await Task.find({
      uid, 
      date: {
        $gte: start,
        $lte: end
      }
    })
  }
}