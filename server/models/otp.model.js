import mongoose, { Schema } from "mongoose";
const OtpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

export const OtpModel = mongoose.model("Otp", OtpSchema);
