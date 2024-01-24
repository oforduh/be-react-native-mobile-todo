import config from "config";
import express from "express";
import passport from "passport";
import rateLimit from "express-rate-limit";

import schemas from "../../schemas/auth.schema";
import controllers from "../../controllers/auth.controller";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { badRequest } from "../../helpers/responses";

const router = express.Router();
const redirectUrl = config.get<string>("redirectUrl");

// GET Requests
router.post("/register", validateRequest(schemas.register), controllers.signUp);
router.post("/login", validateRequest(schemas.login), controllers.login);
router.get("/me", auth, controllers.currentUser);
router.get("/logout", auth, controllers.logout);
router.get("/status", controllers.getStatus);

export default router;
