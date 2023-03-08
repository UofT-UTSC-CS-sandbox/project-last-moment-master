import { types } from "sharedb";
import mongoose, { Schema } from "mongoose";

const codeSchema = new Schema({
  filename: { type: String, required: true },
  content: { type: types.Text, required: false },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export const Code = mongoose.model("Code", codeSchema);
