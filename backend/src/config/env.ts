// Esta importação lê o arquivo .env e coloca os valores em process.env.
import "dotenv/config";

const port = Number(process.env.PORT ?? 3333);

if (Number.isNaN(port)) {
  throw new Error("A variável PORT precisa ser um número.");
}

export const env = {
  port,
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV ?? "development",
};
