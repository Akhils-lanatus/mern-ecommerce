import { Router } from "express";
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
import {
  addToCartController,
  getCartItemsController,
  removeFromCartController,
} from "../controllers/cart.controllers.js";
const router = Router();
router.post(
  "/addToCart",
  setAuthHeadersAndAutoRefreshAccessToken,
  addToCartController
);
router.get(
  "/getCartItems",
  setAuthHeadersAndAutoRefreshAccessToken,
  getCartItemsController
);
router.post(
  "/removeFromCart",
  setAuthHeadersAndAutoRefreshAccessToken,
  removeFromCartController
);
export default router;
