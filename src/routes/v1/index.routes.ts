import express from "express";

import authResource from "./auth.routes";
import categoryResource from "./category.routes";
import taskResource from "./task.route";

const router = express.Router();

/**
 *
 * GET v1/docs
 */
// router.use("/docs", express.static("docs"));

router.use("/api/auth", authResource);
router.use("/api/category", categoryResource);
router.use("/api/task", taskResource);

export default router;
