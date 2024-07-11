import { Router } from "express";
import {
  loginUserController,
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
export default router;
