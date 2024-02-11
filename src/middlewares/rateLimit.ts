import rateLimit from "express-rate-limit";
import response, { tooManyRequests } from "../helpers/responses";
import { Request, Response } from "express";
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  message: "Too many login attempts, please try again after 5 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _, options) => {
    tooManyRequests({ res, message: options.message });
  },
});
