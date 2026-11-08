import { defineConfig } from "vitest/config";

// Testamos funções puras (sem tela), então o ambiente "node" basta.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
