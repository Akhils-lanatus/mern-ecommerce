import { Router } from "express";
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
import { addToCartController } from "../controllers/cart.controllers.js";
const router = Router();
router.post(
  "/addToCart",
  setAuthHeadersAndAutoRefreshAccessToken,
  addToCartController
);
router.get(
  "/getCartItems",
  setAuthHeadersAndAutoRefreshAccessToken,
  addToCartController
);
export default router;
