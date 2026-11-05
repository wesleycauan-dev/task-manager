import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";

// O Express reconhece o middleware de erro pelos 4 parâmetros.
// TODA resposta de erro da API sai daqui, no mesmo formato (ApiErrorResponse):
// { message: string, details?: string[] }
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // 1) Erros esperados (400, 404...): respondemos com a mensagem que criamos.
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      ...(error.details.length > 0 && { details: error.details }),
    });
    return;
  }

  // 2) JSON malformado no corpo (ex.: '{"title":'): o express.json() lança este erro.
  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({ message: "JSON inválido no corpo da requisição" });
    return;
  }

  // 3) Qualquer outra coisa é inesperada: 500.
  // O detalhe fica só no log do servidor, nunca na resposta.
  console.error(error);
  res.status(500).json({ message: "Erro interno do servidor" });
};
