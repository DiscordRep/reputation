const mongoose = require("mongoose");

const banschema = new mongoose.Schema({
  id: String,
  username: String,
  image: Array,
  reason: String,
  mod: String,
  createdAt: Number
});

module.exports = mongoose.model("bans", banschema);