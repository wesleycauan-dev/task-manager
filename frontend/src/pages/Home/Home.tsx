import { useState } from "react";
import Header from "../../components/Header/Header";
import Dashboard from "../../components/Dashboard/Dashboard";
import Filters from "../../components/Filters/FIlters";
import TaskList from "../../components/TaskList/TaskList";
import TaskForm from "../../components/TaskForm/TaskForm";
import {
  INITIAL_FILTERS,
  type Task,
  type TaskFilters,
  type TaskFormData,
} from "../../types/task.ts";
import "./Home.css";

// DADOS TEMPORÁRIOS: serão substituídos pela API
const MOCK_TASKS: Task[] = [
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
    description: "Enviar o relatório para o gerente até sexta.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-15",
    category: "Trabalho",
    createdAt: "2026-10-01T11:00:00.000Z",
  },
  {
    id: 3,
    title: "Marcar consulta no dentista",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "2026-10-20",
    category: "Pessoal",
    createdAt: "2026-10-02T09:00:00.000Z",
  },
  {
    id: 4,
    title: "Configurar o Git no computador novo",
    description: "Instalar o Git e configurar nome e e-mail.",
    status: "completed",
    priority: "medium",
    dueDate: "2026-10-05",
    category: "Estudos",
    createdAt: "2026-09-28T08:00:00.000Z",
  },
];

function Home() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  //  Filtros (temporário: filtramos aqui no frontend)
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const matchesCategory =
      filters.category === "all" || task.category === filters.category;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  //  Números do dashboard
  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;
  const completed = tasks.filter((task) => task.status === "completed").length;

  // Ações
  function openCreateForm() {
    setEditingTask(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTask(undefined);
  }

  function handleSubmit(data: TaskFormData) {
    if (editingTask) {
      // EDITAR: troca só a tarefa que tem o mesmo id
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id ? { ...task, ...data } : task,
        ),
      );
    } else {
      // CRIAR: monta uma tarefa nova (o id falso será gerado pelo banco depois)
      const newTask: Task = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setTasks((previous) => [newTask, ...previous]);
    }
    closeForm();
  }

  function handleComplete(id: number) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task,
      ),
    );
  }

  function handleDelete(id: number) {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setTasks((previous) => previous.filter((task) => task.id !== id));
    }
  }

  return (
    <>
      <Header onNewTask={openCreateForm} />

      <main className="home">
        <div className="container">
          <Dashboard
            total={total}
            pending={pending}
            inProgress={inProgress}
            completed={completed}
          />
          <Filters filters={filters} onChange={setFilters} />
          <TaskList
            tasks={filteredTasks}
            onEdit={openEditForm}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </>
  );
}

export default Home;
