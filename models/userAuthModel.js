import mongoose, { Schema } from "mongoose";

const userAuthSchema = new Schema({
  email: { type: String, required: false, unique: true },
  authType: { type: Array, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export const UserAuth = mongoose.model("UserAuth", userAuthSchema);
