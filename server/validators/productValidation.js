import { body } from "express-validator";
import { ProductModel } from "../models/product.model.js";
const array_of_allowed_file_types = ["image/png", "image/jpeg", "image/jpg"];
export const productValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .custom(async (values) => {
      const isTitleUsed = await ProductModel.findOne({ title: values });
      if (isTitleUsed) {
        throw new Error("Title already used");
      }
      return true;
    }),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 1 })
    .withMessage("Price must have minimum value of 1"),
  body("discountPercentage")
    .optional()
    .isNumeric()
    .withMessage("Discount Percentage must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percentage must be between 0 and 100"),
  body("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("warrantyInformation")
    .notEmpty()
    .withMessage("Warranty information is required"),
  body("shippingInformation")
    .notEmpty()
    .withMessage("Shipping information is required"),
  body("availabilityStatus")
    .notEmpty()
    .withMessage("Availability status is required"),
  body("returnPolicy").notEmpty().withMessage("Return policy is required"),
  body("minimumOrderQuantity")
    .notEmpty()
    .withMessage("Minimum order quantity is required")
    .isInt({ min: 0 })
    .withMessage("Minimum order quantity must be a non-negative integer"),
  body("images").custom((value, { req }) => {
    const isImage = Array.isArray(req.files?.images);
    if (!isImage) {
      throw new Error("Image is required");
    }
    const images = isImage && req.files.images;
    if (images.length > 3) throw new Error("Product can have max 3 images");
    images.forEach((elem) => {
      if (!array_of_allowed_file_types.includes(elem.mimetype)) {
        throw new Error("Invalid image format");
      }
    });
    return true;
  }),
  body("thumbnail").custom((value, { req }) => {
    const isThumbnail = Array.isArray(req.files?.thumbnail);
    if (!isThumbnail) {
      throw new Error("Thumbnail is required");
    }
    const thumbnail = isThumbnail && req.files.thumbnail[0];
    if (!array_of_allowed_file_types.includes(thumbnail.mimetype)) {
      throw new Error("Invalid thumbnail format");
    }
    return true;
  }),
  body("reviews")
    .optional()
    .custom((value) => {
      for (let review of value) {
        if (
          typeof review !== "object" ||
          review === null ||
          Array.isArray(review)
        ) {
          throw new Error("Invalid review object");
        }
        if (!review.rating || review.rating < 0 || review.rating > 5) {
          throw new Error("Rating must be between 0 and 5");
        }
        if (
          typeof review.comment !== "string" ||
          review.comment.trim().length === 0
        ) {
          throw new Error("Comment is required");
        }
        if (!review.reviewerName || typeof review.reviewerName !== "string") {
          throw new Error("Reviewer name is required");
        }
        if (!review.reviewerEmail || typeof review.reviewerEmail !== "string") {
          throw new Error("Reviewer email is required");
        }
      }
      return true;
    }),
];
