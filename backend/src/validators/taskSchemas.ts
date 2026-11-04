import { z } from "zod";
import { CATEGORIES, PRIORITIES, STATUSES } from "../types/task";
import { isValidDate } from "../utils/date";

// Regras de cada campo, escritas UMA vez e reaproveitadas abaixo.
// Os valores permitidos vêm dos mesmos arrays usados no resto do projeto.
const taskFields = {
  title: z
    .string({ error: "O título é obrigatório" })
    .trim() // " Estudar " vira "Estudar"
    .min(1, "O título é obrigatório")
    .max(100, "O título deve ter no máximo 100 caracteres"),

  description: z
    .string({ error: "A descrição deve ser um texto" })
    .max(500, "A descrição deve ter no máximo 500 caracteres"),

  status: z.enum(STATUSES, {
    error: `Status inválido. Use: ${STATUSES.join(", ")}`,
  }),
  priority: z.enum(PRIORITIES, {
    error: `Prioridade inválida. Use: ${PRIORITIES.join(", ")}`,
  }),
  category: z.enum(CATEGORIES, {
    error: `Categoria inválida. Use: ${CATEGORIES.join(", ")}`,
  }),

  dueDate: z
    .string({ error: "A data de vencimento é obrigatória" })
    .refine(
      isValidDate,
      "Data de vencimento inválida. Use o formato AAAA-MM-DD",
    ),
};

// POST /tasks: tudo obrigatório, menos a descrição (o banco usa '' como padrão).
export const createTaskSchema = z.object({
  ...taskFields,
  description: taskFields.description.optional(),
});

// PATCH /tasks/:id: todos os campos opcionais, mas precisa vir pelo menos um.
export const updateTaskSchema = z
  .object(taskFields)
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Envie ao menos um campo para atualizar",
  );

// GET /tasks?search=...&status=...: filtros da URL (todos opcionais).
export const listTasksQuerySchema = z.object({
  search: z
    .string({ error: "A pesquisa deve ser um texto" })
    .max(100, "A pesquisa deve ter no máximo 100 caracteres")
    .optional(),
  status: z
    .enum(STATUSES, { error: `Status inválido. Use: ${STATUSES.join(", ")}` })
    .optional(),
  priority: z
    .enum(PRIORITIES, {
      error: `Prioridade inválida. Use: ${PRIORITIES.join(", ")}`,
    })
    .optional(),
  category: z
    .enum(CATEGORIES, {
      error: `Categoria inválida. Use: ${CATEGORIES.join(", ")}`,
    })
    .optional(),
});
