import type { Request, Response } from "express";
import * as taskService from "../services/taskService";

// Converte o texto da URL em número. Devolve null se for inválido.
function parseId(value: string | string[] | undefined): number | null {
  if (value === undefined || Array.isArray(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Em req.query o valor pode ser texto, lista ou objeto.
// Só aceitamos texto não vazio; o resto vira undefined
function readQueryString(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

export async function list(req: Request, res: Response) {
  const tasks = await taskService.listTasks({
    search: readQueryString(req.query.search),
    status: readQueryString(req.query.status),
    priority: readQueryString(req.query.priority),
    category: readQueryString(req.query.category),
  });
  res.json(tasks);
}

export async function stats(_req: Request, res: Response) {
  res.json(await taskService.getTaskStats());
}

export async function getById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const task = await taskService.getTaskById(id);
  if (!task) {
    res.status(404).json({ message: "Tarefa não encontrada" });
    return;
  }

  res.json(task);
}

// POST: JSON com os dados da tarefa
export async function create(req: Request, res: Response) {
  const task = await taskService.createTask(req.body ?? {});
  res.status(201).json(task); // 201 = criado
}

// PATCH / corpo: só os campos que mudaram
export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const task = await taskService.updateTask(id, req.body ?? {});
  if (!task) {
    res.status(404).json({ message: "Tarefa não encontrada" });
    return;
  }

  res.json(task);
}

// DELETE
export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const deleted = await taskService.deleteTask(id);
  if (!deleted) {
    res.status(404).json({ message: "Tarefa não encontrada" });
    return;
  }

  res.status(204).send(); // 204 = deu certo
}
