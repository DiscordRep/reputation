const mongoose = require("mongoose");

const warnschema = new mongoose.Schema({
  id: String,
  username: String,
  image: Array,
  reason: String,
  mod: String,
  temporary: Boolean,
  duration: Number,
  createdAt: Number
});

module.exports = mongoose.model("warns", warnschema);