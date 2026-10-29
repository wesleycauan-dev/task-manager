import { Prisma } from "@prisma/client";
import type { Task as PrismaTask } from "@prisma/client";
import { prisma } from "../database/prisma";
import {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  type CreateTaskInput,
  type Task,
  type TaskQueryFilters,
  type TaskStats,
  type UpdateTaskInput,
  type TaskStatus,
} from "../types/task";

// Converte a linha do banco (PrismaTask) no formato do nosso contrato (Task).
// A diferença: datas viram texto.
function toTask(row: PrismaTask): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate.toISOString().slice(0, 10), // "2026-10-10"
    category: row.category,
    createdAt: row.createdAt.toISOString(),
  };
}

// Converte "2026-10-10" em Date (meia-noite UTC), que é o que a coluna DATE espera.
function toDate(value: string): Date {
  return new Date(value);
}

// Confere se um texto está na lista de valores permitidos.
// "value is T" é um type guard: dentro do "if", o TypeScript passa a tratar
// o texto como o tipo específico (ex.: TaskStatus), e não só "string".
function isOneOf<T extends string>(
  allowed: readonly T[],
  value: string,
): value is T {
  return (allowed as readonly string[]).includes(value);
}

// Verdadeiro se o erro do Prisma significa "registro não encontrado".
function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

// READ (lista): aplica os filtros recebidos pela URL.
// Os filtros se COMBINAM: cada um que existir entra no WHERE (como um AND).

export async function listTasks(filters: TaskQueryFilters): Promise<Task[]> {
  // simula uma resposta lenta quando o filtro é "pending"
  await new Promise((resolve) =>
    setTimeout(resolve, filters.status === "pending" ? 2000 : 0),
  );
  // Prisma.TaskWhereInput é o tipo do "WHERE" do Prisma.
  const where: Prisma.TaskWhereInput = {};

  const search = filters.search?.trim();
  if (search) {
    // equivale a: title ILIKE '%react%'
    where.title = { contains: search, mode: "insensitive" };
  }

  // Se o valor do filtro não existe (ex.: ?status=abc), não há tarefa possível: devolve vazio.
  // Na Etapa 13 vamos responder 400 (dados inválidos) nesse caso.
  if (filters.status) {
    if (!isOneOf(STATUSES, filters.status)) return [];
    where.status = filters.status;
  }
  if (filters.priority) {
    if (!isOneOf(PRIORITIES, filters.priority)) return [];
    where.priority = filters.priority;
  }
  if (filters.category) {
    if (!isOneOf(CATEGORIES, filters.category)) return [];
    where.category = filters.category;
  }

  const rows = await prisma.task.findMany({
    where,
    orderBy: { id: "desc" }, // mais novas primeiro (ORDER BY id DESC)
  });

  return rows.map(toTask);
}

// READ (stats): conta as tarefas por status, sem filtros.
// groupBy equivale a: SELECT status, COUNT(*) FROM tasks GROUP BY status

export async function getTaskStats(): Promise<TaskStats> {
  const groups = await prisma.task.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  // Procura o grupo do status; se não existir nenhuma tarefa com ele, é zero.
  const countOf = (status: TaskStatus) =>
    groups.find((group) => group.status === status)?._count._all ?? 0;

  const pending = countOf("pending");
  const inProgress = countOf("in_progress");
  const completed = countOf("completed");

  return {
    total: pending + inProgress + completed,
    pending,
    inProgress,
    completed,
  };
}

// READ (uma): procura pelo id. Se não achar, devolve undefined.
// findUnique devolve null quando não encontra; trocamos por undefined.

export async function getTaskById(id: number): Promise<Task | undefined> {
  const row = await prisma.task.findUnique({ where: { id } });
  return row ? toTask(row) : undefined;
}

// CREATE: grava a tarefa nova.
// Não enviamos id, createdAt nem updatedAt: o banco e o Prisma preenchem.
// Escolhemos os campos um a um para ninguém conseguir injetar campos extras.
// Se "description" não vier, o Prisma usa o @default("") do schema.

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const row = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: toDate(data.dueDate),
      category: data.category,
    },
  });

  return toTask(row);
}

// UPDATE: altera só os campos enviados (undefined = não mexe).
// Se o id não existe, o Prisma lança P2025 e devolvemos undefined.
// updatedAt é atualizado automaticamente (@updatedAt no schema).

export async function updateTask(
  id: number,
  data: UpdateTaskInput,
): Promise<Task | undefined> {
  try {
    const row = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? toDate(data.dueDate) : undefined,
        category: data.category,
      },
    });

    return toTask(row);
  } catch (error) {
    if (isNotFoundError(error)) return undefined;
    throw error; // qualquer outro erro continua para o errorHandler (500)
  }
}

// DELETE: remove do banco. true se existia, false se não.

export async function deleteTask(id: number): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch (error) {
    if (isNotFoundError(error)) return false;
    throw error;
  }
}
