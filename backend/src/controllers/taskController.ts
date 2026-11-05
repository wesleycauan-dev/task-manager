import type { Request, Response } from "express";
import * as taskService from "../services/taskService";
import { AppError } from "../utils/AppError";
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from "../validators/taskSchemas";
import { validate } from "../validators/validate";

// Converte o texto da URL ("5") em número. Lança 400 se for inválido.
function parseId(value: string | string[] | undefined): number {
  if (typeof value !== "string") {
    throw new AppError("ID inválido", 400);
  }

  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("ID inválido", 400);
  }
  return id;
}

// "?status=" (vazio) é tratado como "sem filtro", como antes.
function cleanQuery(query: Request["query"]) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== ""),
  );
}

// GET /tasks  e  GET /tasks?status=pending&search=react
export async function list(req: Request, res: Response) {
  const filters = validate(listTasksQuerySchema, cleanQuery(req.query));
  res.json(await taskService.listTasks(filters));
}

// GET /tasks/stats
export async function stats(_req: Request, res: Response) {
  res.json(await taskService.getTaskStats());
}

// GET /tasks/:id
export async function getById(req: Request, res: Response) {
  const id = parseId(req.params.id);

  const task = await taskService.getTaskById(id);
  if (!task) throw new AppError("Tarefa não encontrada", 404);

  res.json(task);
}

// POST /tasks
export async function create(req: Request, res: Response) {
  // "?? {}": se não veio corpo, o Zod lista todos os campos que faltam.
  const data = validate(createTaskSchema, req.body ?? {});

  const task = await taskService.createTask(data);
  res.status(201).json(task);
}

// PATCH /tasks/:id
export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const data = validate(updateTaskSchema, req.body ?? {});

  const task = await taskService.updateTask(id, data);
  if (!task) throw new AppError("Tarefa não encontrada", 404);

  res.json(task);
}

// DELETE /tasks/:id
export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);

  const deleted = await taskService.deleteTask(id);
  if (!deleted) throw new AppError("Tarefa não encontrada", 404);

  res.status(204).send();
}
