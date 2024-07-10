import express from "express";
import {
  adminAddNewProductController,
  fetchAllProductsController,
  fetchSingleProductController,
  removeProductController,
  updateProductController,
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
  adminAddNewProductController
);
router.delete("/admin/delete-product/:id", removeProductController);
router.put("/admin/update-product", updateProductController);
router.get("/fetch-products", fetchAllProductsController);
router.get("/single-product/:id", fetchSingleProductController);
export default router;
