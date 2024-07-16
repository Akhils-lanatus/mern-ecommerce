import mongoose from "mongoose";
import { CartModel } from "../models/cart.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const addToCartController = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.userId || !data.items) {
      throw new Error("Invalid data: userId and items are required");
    }

    const userId = new mongoose.Types.ObjectId(data.userId);
    const cart = await CartModel.findOne({ userId });

    if (cart) {
      const existingItem = cart.items.find((item) =>
        item.productId.equals(data.items.productId)
      );
      if (existingItem) {
        throw new Error("Item already exists in the cart");
      } else {
        cart.items.push(data.items);
        await cart.save();
      }
    } else {
      await CartModel.create({ userId, items: [data.items] });
    }

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({
      success: false,
      message,
    });
  }
};
