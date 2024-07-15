import { errorHandler } from "../utils/errorHandler.js";
import { BrandModel } from "../models/brand.model.js";
export const addBrandController = async (req, res) => {
  try {
    const { value, label } = req.body;
    if (!value || !label) {
      throw new Error("All fields are required");
    }
    const brand = await BrandModel.create({ value, label });
    return res.status(201).json({
      success: true,
      message: "Brand Added Successfully",
      brand,
    });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({
      success: false,
      message,
    });
  }
};
export const fetchBrandsController = async (req, res) => {
  try {
    const brand = await BrandModel.find();
    return res.status(201).json({
      success: true,
      message: "All Brand Fetched Successfully",
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
