import type { RequestHandler } from "express";

// Roda quando NENHUMA rota anterior respondeu.
// Por isso ele fica por último na lista de middlewares.
export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
};
