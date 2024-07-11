import mongoose from "mongoose";

const UserRefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5d" },
});

export const UserRefreshTokenModel = mongoose.model(
  "UserRefreshToken",
  UserRefreshTokenSchema
);
