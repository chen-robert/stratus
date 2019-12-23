const mongoose = require("mongoose");
const url = process.env.MONGO_DB_URL || "mongodb://localhost/textbooks";

mongoose.set('useCreateIndex', true);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Established connection to database");
});

const Task = require(__dirname + "/models/task");
module.exports = {
  addTask: async ({text, date, completed}) => {
    if(completed === undefined) completed = false;

    const task = new Task({text, date, completed});

    await task.save();
  },
  removeTask: async (id) => {
    await Task.deleteOne({id});
  },
  markTask: async (id, completed) => {
    await Task.findByIdAndUpdate(id, {completed});
  },
  getTasks: async (start, end) => {
    return await Task.find({
      date: {
        $gte: start,
        $lte: end
      }
    })
  }
}