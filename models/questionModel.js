const { mongoose, Schema } = require("mongoose");

const questionSchema = new Schema({
  question: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
