import { errorHandler } from "../utils/errorHandler.js";
import { CategoryModel } from "../models/category.model.js";
export const addCategoryController = async (req, res) => {
  try {
    const { value, label } = req.body;
    if (!value || !label) {
      throw new Error("All fields are required");
    }
    const category = await CategoryModel.create({ value, label });
    return res.status(201).json({
      success: true,
      message: "Category Added Successfully",
      category,
    });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({
      success: false,
      message,
    });
  }
};
export const fetchCategoriesController = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(201).json({
      success: true,
      message: "All Categories Fetched Successfully",
      categories,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
