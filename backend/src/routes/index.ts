import { Router } from "express";

export const routes = Router();

// Rota de "saúde": serve para testar se a API está no ar.
// Serviços de hospedagem também usam esse tipo de rota para monitorar o app.
routes.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});
