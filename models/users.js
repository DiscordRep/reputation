const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  vanity: String,
  username: String,
  email: String,
  image: Array,
  bio: String,
  donator: Number,
  admin: { type: Boolean, default: false },
  mod: { type: Boolean, default: false },
  customJob: String,
  partner: { type: Boolean, default: false },
  premium_type: Number,
  flags: Number,
  connections: Array,
  showConnections: { type: Boolean, default: true },
  showFlags: { type: Boolean, default: true },
  drepPlus: Object
});

module.exports = mongoose.model("users", userSchema);