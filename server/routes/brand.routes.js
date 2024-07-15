import { Router } from "express";
import { checkIsAdmin } from "../middlewares/checkIsAdmin.middleware.js";
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
import {
  addBrandController,
  fetchBrandsController,
} from "../controllers/brand.controllers.js";
const router = Router();

router.post(
  "/add-brand",
  setAuthHeadersAndAutoRefreshAccessToken,
  checkIsAdmin,
  addBrandController
);
router.get("/fetch-brands", fetchBrandsController);
export default router;
