import { useState } from "react";
import Header from "../../components/Header/Header";
import Dashboard from "../../components/Dashboard/Dashboard";
import Filters from "../../components/Filters/FIlters";
import TaskList from "../../components/TaskList/TaskList";
import TaskForm from "../../components/TaskForm/TaskForm";
import { useTasks } from "../../hooks/useTasks";
import { getErrorMessage } from "../../services/api";
import {
  INITIAL_FILTERS,
  type Task,
  type TaskFilters,
  type TaskFormData,
} from "../../types/task";
import "./Home.css";

function Home() {
  // Os dados agora vêm do hook, que fala com a API.
  const {
    tasks,
    stats,
    loading,
    loadError,
    retry,
    addTask,
    editTask,
    removeTask,
  } = useTasks();

  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // ---------- Filtros (ainda no frontend; a Etapa 11 move para a API) ----------
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

  // ---------- Abrir e fechar o formulário ----------
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

  // ⚠️ TEMPORÁRIO: alert() é feio, mas simples. Na Etapa 12 vira uma mensagem na tela.
  function showError(message: string, error: unknown) {
    window.alert(`❌ ${message}\n${getErrorMessage(error)}`);
  }

  // ---------- Ações: agora chamam a API de verdade ----------
  async function handleSubmit(data: TaskFormData) {
    try {
      if (editingTask) {
        await editTask(editingTask.id, data); // PATCH /tasks/:id
      } else {
        await addTask(data); // POST /tasks
      }
      closeForm(); // só fecha se deu certo: se falhar, o usuário não perde o que digitou
    } catch (error) {
      showError(
        editingTask
          ? "Não foi possível salvar a tarefa."
          : "Não foi possível criar a tarefa.",
        error,
      );
    }
  }

  async function handleComplete(id: number) {
    try {
      await editTask(id, { status: "completed" }); // PATCH só com o campo que muda
    } catch (error) {
      showError("Não foi possível concluir a tarefa.", error);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await removeTask(id); // DELETE /tasks/:id
    } catch (error) {
      showError("Não foi possível excluir a tarefa.", error);
    }
  }

  // ---------- O que mostrar na tela ----------
  function renderContent() {
    if (loading) {
      return <p className="home__message">⏳ Carregando tarefas...</p>;
    }

    if (loadError) {
      return (
        <div className="home__message home__message--error">
          <p>❌ {loadError}</p>
          <button className="btn btn--outline" onClick={retry}>
            Tentar novamente
          </button>
        </div>
      );
    }

    return (
      <>
        <Dashboard
          total={stats.total}
          pending={stats.pending}
          inProgress={stats.inProgress}
          completed={stats.completed}
        />
        <Filters filters={filters} onChange={setFilters} />
        <TaskList
          tasks={filteredTasks}
          onEdit={openEditForm}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />
      </>
    );
  }

  return (
    <>
      <Header onNewTask={openCreateForm} />

      <main className="home">
        <div className="container">{renderContent()}</div>
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
