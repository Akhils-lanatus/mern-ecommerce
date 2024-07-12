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
    checked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const BrandModel = mongoose.model("Brand", BrandSchema);
