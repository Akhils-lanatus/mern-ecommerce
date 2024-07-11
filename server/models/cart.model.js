import mongoose, { Schema } from "mongoose";
const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  { timestamps: true }
);
export const CartModel = mongoose.model("Cart", CartSchema);
