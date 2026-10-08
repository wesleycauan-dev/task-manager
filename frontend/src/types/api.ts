import type {
  Task,
  TaskCategory,
  TaskFormData,
  TaskPriority,
  TaskStatus,
} from "./task";

// POST /tasks → precisa de todos os campos do formulário.
export type CreateTaskPayload = TaskFormData;

// PATCH /tasks/:id → pode enviar só os campos que mudaram.
// Partial<T> torna TODOS os campos de T opcionais.
export type UpdateTaskPayload = Partial<TaskFormData>;

// Todos opcionais: só enviamos na URL os filtros que estiverem ativos.
export interface TaskQueryParams {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
}

// GET /tasks → lista de tarefas
export type TaskListResponse = Task[];

// GET /tasks/:id, POST /tasks, PATCH /tasks/:id → uma tarefa
export type TaskResponse = Task;

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

// Formato de TODA resposta de erro da API (400, 404, 500...).
export interface ApiErrorResponse {
  message: string; // ex.: "Dados inválidos"
  details?: string[]; // ex.: ["O título é obrigatório"]
}

export type RequestStatus = "idle" | "loading" | "success" | "error";
