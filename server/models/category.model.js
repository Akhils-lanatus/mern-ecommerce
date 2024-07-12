import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
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

export const CategoryModel = mongoose.model("Category", CategorySchema);
