import express from "express";

import authResource from "./auth.routes";
import hooksResource from "./hooks.routes";

const router = express.Router();

/**
 *
 * GET v1/docs
 */
// router.use("/docs", express.static("docs"));

router.use("/", authResource);
router.use("/web/hooks", hooksResource);

export default router;
