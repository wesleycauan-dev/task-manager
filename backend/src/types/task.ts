export const STATUSES = ["pending", "in_progress", "completed"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;
export const CATEGORIES = ["Estudos", "Trabalho", "Pessoal", "Outros"] as const;

export type TaskStatus = (typeof STATUSES)[number];
export type TaskPriority = (typeof PRIORITIES)[number];
export type TaskCategory = (typeof CATEGORIES)[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  category: TaskCategory;
  createdAt: string;
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "description"> & {
  description?: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface TaskQueryFilters {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}
