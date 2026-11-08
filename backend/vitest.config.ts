import { readFileSync } from "node:fs";
import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

// Lê o .env.test e entrega ao ambiente dos testes.
// Se o arquivo não existir, dá erro claro em vez de usar o banco errado.
const testEnv = dotenv.parse(readFileSync(".env.test"));

export default defineConfig({
  test: {
    environment: "node",
    env: testEnv,
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    fileParallelism: false, // um arquivo de teste por vez: todos usam o MESMO banco
  },
});
