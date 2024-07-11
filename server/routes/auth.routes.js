import { Router } from "express";
import {
  loginUserController,
  refreshTokenController,
  registerUserController,
  verifyEmailController,
} from "../controllers/auth.controllers.js";
const router = Router();

//POST - USER REGISTER
router.post("/register", registerUserController);

//POST - USER VERIFY EMAIL
router.post("/verify-email", verifyEmailController);

//POST - USER LOGIN
router.post("/login", loginUserController);

//GET - USER REFRESH TOKEN
router.get("/refresh-token", refreshTokenController);
export default router;
