const mongoose = require("mongoose");

const dblvoteSchema = new mongoose.Schema({
   id: String,
   lastVote: Number,
   totalVotes: Number
});

module.exports = mongoose.model("dblvotes", dblvoteSchema);