import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({}, { timestamps: true });

export const OrderModel = mongoose.model("Order", OrderSchema);
