const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
   id: String,
   messages: Number,
   reputation: Number,
   lastmessage: Number
});

module.exports = mongoose.model("messages", MessagesSchema);