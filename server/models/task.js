const mongoose = require("mongoose");
  
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  text: { type: String, required: true },
  date: { type: Number, required: true },
  completed: { type: Boolean, required: true },
  uid: { type: String, required: true}
});

module.exports = mongoose.model("Task", TaskSchema);