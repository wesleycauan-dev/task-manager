export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "Estudos" | "Trabalho" | "Pessoal" | "Outros";

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

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  category: TaskCategory;
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  category: TaskCategory | "all";
}

// Textos que aparecem para o usuário (em português).
export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluída",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export const CATEGORIES: TaskCategory[] = [
  "Estudos",
  "Trabalho",
  "Pessoal",
  "Outros",
];

export const INITIAL_FILTERS: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
  category: "all",
};
