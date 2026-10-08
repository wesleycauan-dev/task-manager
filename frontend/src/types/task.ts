export const STATUSES = ["pending", "in_progress", "completed"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;
export const CATEGORIES = ["Estudos", "Trabalho", "Pessoal", "Outros"] as const;

export type TaskStatus = (typeof STATUSES)[number];
export type TaskPriority = (typeof PRIORITIES)[number];
export type TaskCategory = (typeof CATEGORIES)[number];

// Representa uma tarefa completa, como ela vem do banco de dados.
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // formato "AAAA-MM-DD", ex.: "2026-10-10"
  category: TaskCategory;
  createdAt: string; // formato ISO, ex.: "2026-10-01T10:00:00.000Z"
}

// Dados que o formulário envia. Não tem id nem createdAt,
// porque quem cria esses valores é o banco de dados.
export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  category: TaskCategory;
}

// Estado dos filtros na tela. 'all' significa "sem filtro".
export interface TaskFilters {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  category: TaskCategory | "all";
}

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

// Valor inicial dos filtros (tudo desligado).
export const INITIAL_FILTERS: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
  category: "all",
};
