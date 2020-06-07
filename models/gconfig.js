const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
   id: String,
   prefix: String,
   memberLog: String
});

module.exports = mongoose.model("guild", guildSchema);