import type {
  CreateTaskInput,
  Task,
  TaskQueryFilters,
  TaskStats,
  UpdateTaskInput,
} from "../types/task";

// Banco de dados temporario
let tasks: Task[] = [
  {
    id: 1,
    title: "Estudar React",
    description: "Estudar componentes, props e hooks.",
    status: "pending",
    priority: "high",
    dueDate: "2026-10-10",
    category: "Estudos",
    createdAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Finalizar relatório mensal",
    description: "Enviar o relatório para o gerente.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-15",
    category: "Trabalho",
    createdAt: "2026-10-01T11:00:00.000Z",
  },
];

// Próximo id disponível. O PostgreSQL fará isso sozinho (auto incremento).
let nextId = 3;

export async function listTasks(filters: TaskQueryFilters): Promise<Task[]> {
  const search = filters.search?.trim().toLowerCase();

  return tasks
    .filter((task) => {
      const matchesSearch =
        !search || task.title.toLowerCase().includes(search);
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority =
        !filters.priority || task.priority === filters.priority;
      const matchesCategory =
        !filters.category || task.category === filters.category;
      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    })
    .sort((a, b) => b.id - a.id);
}

// Conta as tarefas por status (sem filtros)
export async function getTaskStats(): Promise<TaskStats> {
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };
}

// Procura pelo id. Se não achar, devolve undefined.
export async function getTaskById(id: number): Promise<Task | undefined> {
  return tasks.find((task) => task.id === id);
}

// Monta a tarefa nova e guarda na lista
export async function createTask(data: CreateTaskInput): Promise<Task> {
  const task: Task = {
    id: nextId++, // usa o valor atual e depois soma 1
    title: data.title,
    description: data.description ?? "",
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate,
    category: data.category,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  return task;
}

// Troca só os campos enviados. O que não veio, fica como estava.
// id e createdAt NUNCA mudam.
export async function updateTask(
  id: number,
  data: UpdateTaskInput,
): Promise<Task | undefined> {
  const current = tasks.find((task) => task.id === id);
  if (!current) return undefined;

  const updated: Task = {
    ...current,
    title: data.title ?? current.title,
    description: data.description ?? current.description,
    status: data.status ?? current.status,
    priority: data.priority ?? current.priority,
    dueDate: data.dueDate ?? current.dueDate,
    category: data.category ?? current.category,
  };

  tasks = tasks.map((task) => (task.id === id ? updated : task));
  return updated;
}

// Remove da lista. Devolve true se existia, false se não.
export async function deleteTask(id: number): Promise<boolean> {
  const exists = tasks.some((task) => task.id === id);
  if (!exists) return false;

  tasks = tasks.filter((task) => task.id !== id);
  return true;
}
