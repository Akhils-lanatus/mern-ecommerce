import { Router } from "express";
import passport from "passport";
import {
  changePasswordController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
  resendEmailVerificationLinkController,
  resetPasswordController,
  sendPasswordResetLinkController,
  userProfileController,
  verifyEmailController,
  verifyEmailWithOtpController,
} from "../controllers/auth.controllers.js";
import { setAuthHeadersAndAutoRefreshAccessToken } from "../middlewares/setAuthHeadersAndAutoRefreshAccessToken.js";
const router = Router();

//POST - USER REGISTER
router.post("/register", registerUserController);

//GET - RESEND-LINK
router.get("/resend-verification-link", resendEmailVerificationLinkController);

//POST - USER VERIFY EMAIL
router.post("/verify-email", verifyEmailController);

//POST - USER VERIFY EMAIL WITH OTP
router.post("/verify-email-by-otp", verifyEmailWithOtpController);

//POST - USER LOGIN
router.post("/login", loginUserController);

//GET - USER REFRESH TOKEN
router.get("/refresh-token", refreshTokenController);

//POST - USER FORGOT PASSWORD LINK SEND
router.post("/forgot-password-link", sendPasswordResetLinkController);

//POST - USER FORGOT PASSWORD
router.post("/forgot-password/:id/:token", resetPasswordController);

// ======================PROTECTED ROUTES

//GET - USER-PROFILE
router.get(
  "/profile",
  setAuthHeadersAndAutoRefreshAccessToken,
  passport.authenticate("jwt", { session: false }),
  userProfileController
);

//POST - USER CHANGE PASS
router.post(
  "/change-password",
  setAuthHeadersAndAutoRefreshAccessToken,
  passport.authenticate("jwt", { session: false }),
  changePasswordController
);

//GET - USER LOGOUT
router.get(
  "/logout",
  setAuthHeadersAndAutoRefreshAccessToken,
  passport.authenticate("jwt", { session: false }),
  logoutUserController
);
export default router;
