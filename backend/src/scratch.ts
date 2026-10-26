import { prisma } from "./database/prisma";

async function main() {
  // CREATE
  const created = await prisma.task.create({
    data: {
      title: "Estudar Prisma",
      status: "pending",
      priority: "high",
      dueDate: new Date("2026-10-10"),
      category: "Estudos",
    },
  });
  console.log("Criada:", created);

  // READ com filtros combinados
  const found = await prisma.task.findMany({
    where: {
      status: "pending",
      title: { contains: "prisma", mode: "insensitive" },
    },
    orderBy: { id: "desc" },
  });
  console.log("Encontradas:", found.length);

  // UPDATE
  const updated = await prisma.task.update({
    where: { id: created.id },
    data: { status: "completed" },
  });
  console.log("Atualizada:", updated.status, updated.updatedAt);

  // DELETE
  await prisma.task.delete({ where: { id: created.id } });
  console.log("Excluída.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); // fecha a conexão para o script terminar
