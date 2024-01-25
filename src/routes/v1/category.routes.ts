import express from "express";

import schemas from "../../schemas/category.schema";
import controllers from "../../controllers/category.controller";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create",
  auth,
  validateRequest(schemas.createCategory),
  controllers.createCategory
);
router.get("/", auth, controllers.fetchCategories);
router.delete("/delete/:categoryID", auth, controllers.deleteCategory);
router.patch(
  "/edit/:categoryID",
  auth,
  validateRequest(schemas.editCategory),
  controllers.editCategory
);

export default router;
