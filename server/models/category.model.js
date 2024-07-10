import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
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
});

export const CategoryModel = mongoose.model("Category", CategorySchema);
