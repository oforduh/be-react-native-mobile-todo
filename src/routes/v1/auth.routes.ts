import express from "express";

import schemas from "../../schemas/auth.schema";
import controllers from "../../controllers/auth.controller";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginLimiter } from "../../middlewares/rateLimit";

const router = express.Router();

// GET Requests
router.post("/register", validateRequest(schemas.register), controllers.signUp);
router.post(
  "/login",
  validateRequest(schemas.login),
  loginLimiter,
  controllers.login
);
router.get("/me", auth, controllers.currentUser);
router.get("/logout", auth, controllers.logout);
router.get("/status", controllers.getStatus);
router.get("/request-2fa", auth, controllers.generateQRCode);
router.post(
  "/enable-2fa",
  auth,
  validateRequest(schemas.enableTwoFactorAuth),
  controllers.enable2FA
);

export default router;
