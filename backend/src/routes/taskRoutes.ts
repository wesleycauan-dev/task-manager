import { Router } from "express";
import * as taskController from "../controllers/taskController";

export const taskRoutes = Router();

taskRoutes.get("/", taskController.list);

taskRoutes.get("/stats", taskController.stats);

taskRoutes.get("/:id", taskController.getById);

taskRoutes.post("/", taskController.create);

taskRoutes.patch("/:id", taskController.update);

taskRoutes.delete("/:id", taskController.remove);
