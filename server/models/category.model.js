import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    value: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model("Category", CategorySchema);
