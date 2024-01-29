import express from "express";

import schemas from "../../schemas/task.schema";
import controllers from "../../controllers/task.controller";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create",
  auth,
  validateRequest(schemas.createTask),
  controllers.createTask
);
router.get("/", auth, controllers.fetchTasks);
router.get("/completed", auth, controllers.fetchCompletedTasks);
router.get("/today", auth, controllers.fetchTasksForToday);
router.get("/:categoryId", auth, controllers.fetchTasksByCategory);
router.patch(
  "/edit/:taskID",
  auth,
  validateRequest(schemas.editTaskDetails),
  controllers.editTask
);
router.delete("/delete/:taskID", auth, controllers.deleteTask);

export default router;
