import express from "express";

import controllers from "../../hooks/getUserEmail";

const router = express.Router();

// GET Requests
router.get("/get-email", controllers.getUserEmail);

router.get("/get-user", controllers.fetchUser);

export default router;
