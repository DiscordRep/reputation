const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  id: String,
  enabled: Boolean,
  comments: []
});

module.exports = mongoose.model("comments", CommentsSchema);