const mongoose = require("mongoose");

const voteschema = new mongoose.Schema({
  id: String,
  upvotes: Array,
  downvotes: Array
});

module.exports = mongoose.model("votes", voteschema);