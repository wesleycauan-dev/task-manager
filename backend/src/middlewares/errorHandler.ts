import type { ErrorRequestHandler } from "express";

// Middleware de ERRO: o Express o reconhece pelos 4 parâmetros.
// Qualquer erro inesperado lançado em uma rota cai aqui.
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({ message: "Erro interno do servidor" });
};
