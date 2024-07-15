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
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
import { checkIsAdmin } from "../middlewares/checkIsAdmin.middleware.js";
const router = express.Router();

router.post(
  "/admin/add-product",
  setAuthHeadersAndAutoRefreshAccessToken,
  checkIsAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  productValidation,
  adminAddNewProductController
);
router.delete(
  "/admin/delete-product/:id",
  setAuthHeadersAndAutoRefreshAccessToken,
  checkIsAdmin,
  removeProductController
);
router.put(
  "/admin/update-product",
  setAuthHeadersAndAutoRefreshAccessToken,
  checkIsAdmin,
  updateProductController
);
router.get("/fetch-products", fetchAllProductsController);
router.get("/single-product/:id", fetchSingleProductController);
export default router;
