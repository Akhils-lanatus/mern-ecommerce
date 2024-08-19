import { Router } from "express";
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
import {
  addToCartController,
  getCartItemsController,
  removeFromCartController,
} from "../controllers/cart.controllers.js";
import passport from "passport";
const router = Router();
router.post(
  "/addToCart",
  setAuthHeadersAndAutoRefreshAccessToken,
  passport.authenticate("jwt", { session: false }),
  addToCartController
);
router.get(
  "/getCartItems",
  setAuthHeadersAndAutoRefreshAccessToken,
  passport.authenticate("jwt", { session: false }),
  getCartItemsController
);
router.post(
  "/removeFromCart",
  setAuthHeadersAndAutoRefreshAccessToken,
  passport.authenticate("jwt", { session: false }),
  removeFromCartController
);
export default router;
