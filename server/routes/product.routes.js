import express from "express";
import {
  adminAddNewProduct,
  fetchAllProducts,
  fetchSingleProduct,
  removeProduct,
} from "../controllers/products.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { productValidation } from "../validators/productValidation.js";
const router = express.Router();

//<<==========ADMIN==========>>
//POST || ADD-NEW-PRODUCT
router.post(
  "/admin/add-product",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  productValidation,
  adminAddNewProduct
);
router.get("/fetch-products", fetchAllProducts);
router.get("/single-product/:id", fetchSingleProduct);
router.delete("/admin/delete-product/:id", removeProduct);
export default router;
