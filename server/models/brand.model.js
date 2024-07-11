import mongoose, { Schema } from "mongoose";

const BrandSchema = new Schema(
  {
    value: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const BrandModel = mongoose.model("Brand", BrandSchema);
