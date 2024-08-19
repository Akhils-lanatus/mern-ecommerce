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
    let cart = await CartModel.findOne({ userId });

    if (!req.user._id.equals(userId)) {
      throw new Error("Invalid access");
    }
    if (cart) {
      const existingItem = cart.items.find((item) => {
        return item.productId.equals(data.items.productId);
      });

      if (existingItem) {
        throw new Error("Item already exists in the cart");
      } else {
        cart.items.push(data.items);
        await cart.save();
      }
    } else {
      cart = await CartModel.create({ userId, items: [data.items] });
    }

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cartItemsCount: cart?.items.length || 0,
      item: data.items,
    });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getCartItemsController = async (req, res) => {
  try {
    const { uId } = req.query;

    if (!uId) {
      throw new Error("Invalid data: userId not found");
    }

    const userId = new mongoose.Types.ObjectId(uId);
    const cart = await CartModel.findOne({ userId });

    if (!req.user._id.equals(userId)) {
      throw new Error("Invalid access");
    }

    if (cart) {
      return res.status(200).json({
        success: true,
        message: "Cart Item fetched successfully",
        cartItems: cart?.items || [],
        cartItemsCount: cart.items.length,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No items in cart",
        cartItems: [],
      });
    }
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({
      success: false,
      message,
    });
  }
};
export const removeFromCartController = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      throw new Error("Invalid data: userId and productId are required");
    }

    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const productIdObjectId = new mongoose.Types.ObjectId(productId);

    const cart = await CartModel.findOne({ userId: userIdObjectId });

    if (!req.user._id.equals(userIdObjectId)) {
      throw new Error("Invalid access");
    }

    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productIdObjectId)
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in the cart");
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cartItemsCount: cart.items.length,
      cartItems: cart.items,
    });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({
      success: false,
      message,
    });
  }
};
