import { Router } from "express";
import { checkIsAdmin } from "../middlewares/checkIsAdmin.middleware.js";
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
import {
  addCategoryController,
  fetchCategoriesController,
} from "../controllers/category.controllers.js";
const router = Router();

router.post(
  "/add-category",
  setAuthHeadersAndAutoRefreshAccessToken,
  checkIsAdmin,
  addCategoryController
);
router.get("/fetch-categories", fetchCategoriesController);
export default router;
