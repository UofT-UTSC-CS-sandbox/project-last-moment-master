const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("rooms", roomSchema);
