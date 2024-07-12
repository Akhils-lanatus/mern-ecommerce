import { Router } from "express";
import passport from "passport";
import {
  loginUserController,
  refreshTokenController,
  registerUserController,
  userProfileController,
  verifyEmailController,
} from "../controllers/auth.controllers.js";
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
const router = Router();

//POST - USER REGISTER
router.post("/register", registerUserController);

//POST - USER VERIFY EMAIL
router.post("/verify-email", verifyEmailController);

//POST - USER LOGIN
router.post("/login", loginUserController);

//GET - USER REFRESH TOKEN
router.get("/refresh-token", refreshTokenController);

// ======================PROTECTED ROUTES
//GET - USER-PROFILE
router.get(
  "/profile",
  setAuthHeadersAndAutoRefreshAccessToken,
  passport.authenticate("jwt", { session: false }),
  userProfileController
);
export default router;
