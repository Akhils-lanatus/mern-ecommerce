import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: [0, "Control your emotions, last rating you can give is 0"],
    max: [5, "Control your emotions, max rating you can give is 5"],
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reviewerName: {
    type: String,
    required: true,
  },
  reviewerEmail: {
    type: String,
    required: true,
  },
});

const validateImageArray = function (array) {
  return array.length >= 1 && array.length <= 3;
};

const ProductSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Price should have at least 1 rupees"],
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: [0, "Who gives negative discount?"],
    max: [
      100,
      "Broooooo... Company will be in loss if more than 100 discount is given",
    ],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, "Who gives negative rating?"],
    max: [5, "Max 5 rating can be given"],
  },
  stock: {
    type: Number,
    required: true,
    min: [
      0,
      "Smart People don't add stock in negative (HINT:- 0 is also valid)",
    ],
  },
  warrantyInformation: {
    type: String,
    required: true,
    trim: true,
  },
  shippingInformation: {
    type: String,
    required: true,
    trim: true,
  },
  availabilityStatus: {
    type: String,
    required: true,
    trim: true,
  },
  reviews: [reviewSchema],
  returnPolicy: {
    type: String,
    required: true,
    trim: true,
  },
  minimumOrderQuantity: {
    type: Number,
    required: true,
    trim: true,
    min: [0, "What are you thinking while adding negative quantity huh?"],
  },
  images: {
    type: [String],
    required: true,
    validate: [validateImageArray, "Product must contain 1 to 3 image"],
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

export const ProductModel = mongoose.model("Product", ProductSchema);
