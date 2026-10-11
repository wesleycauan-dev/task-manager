import { Router } from "express";
import { taskRoutes } from "./taskRoutes";

export const routes = Router();

// Rota de "saúde": serve para testar se a API está no ar.
routes.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Tudo que começa com /tasks vai para o taskRoutes.
// Lá dentro, '/' vira '/tasks' e '/:id' vira '/tasks/:id'.
routes.use("/tasks", taskRoutes);
