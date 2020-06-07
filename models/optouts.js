const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
    id: String,
});

module.exports = mongoose.model("optouts", MessagesSchema);