export const STATUSES = ["pending", "in_progress", "completed"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;
export const CATEGORIES = ["Estudos", "Trabalho", "Pessoal", "Outros"] as const;

export type TaskStatus = (typeof STATUSES)[number];
export type TaskPriority = (typeof PRIORITIES)[number];
export type TaskCategory = (typeof CATEGORIES)[number];

// Uma tarefa completa.
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // "AAAA-MM-DD"
  category: TaskCategory;
  createdAt: string; // ISO
}

// Dados para CRIAR: tudo, menos o que o servidor gera (id e createdAt).
export type CreateTaskInput = Omit<Task, "id" | "createdAt">;

// Dados para EDITAR: qualquer campo, todos opcionais.
export type UpdateTaskInput = Partial<CreateTaskInput>;

// Filtros que chegam pela URL
export interface TaskQueryFilters {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
}

// Números do dashboard.
export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}
