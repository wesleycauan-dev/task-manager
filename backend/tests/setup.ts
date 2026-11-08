import { afterAll, beforeEach } from "vitest";
import { prisma } from "../src/database/prisma";

//  TRAVA DE SEGURANÇA: os testes apagam todas as tarefas.
// Nunca podem rodar em um banco que não seja de teste.
const databaseUrl = process.env.DATABASE_URL ?? "";
const databaseName = databaseUrl.split("/").pop()?.split("?")[0] ?? "";

if (!databaseName.endsWith("_test")) {
  throw new Error(
    `Os testes só rodam em bancos terminados em "_test". Banco atual: "${databaseName}".`,
  );
}

// Antes de CADA teste: tabela vazia e contador de ids recomeçando em 1.
// Assim um teste nunca depende do que outro deixou para trás.
beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE tasks RESTART IDENTITY`;
});

// Ao final, fecha a conexão com o banco.
afterAll(async () => {
  await prisma.$disconnect();
});
