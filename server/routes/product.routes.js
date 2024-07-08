import express from "express";
import { adminAddNewProduct } from "../controllers/products.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

//<<==========ADMIN==========>>
//POST || ADD-NEW-PRODUCT
router.post(
  "/add",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  adminAddNewProduct
);
export default router;
