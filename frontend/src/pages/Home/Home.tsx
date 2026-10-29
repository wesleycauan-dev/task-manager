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
  // Os filtros precisam ser declarados ANTES do hook, pois o hook depende deles.
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const {
    tasks,
    stats,
    loading,
    refreshing,
    loadError,
    retry,
    addTask,
    editTask,
    removeTask,
  } = useTasks(filters);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // ---------- Pesquisa (ainda no frontend; a Etapa 12 move para a API) ----------
  // Status, prioridade e categoria já chegam filtrados pela API.
  // Aqui sobrou só o título.
  const visibleTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filters.search.toLowerCase()),
  );

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

  // ---------- Ações ----------
  async function handleSubmit(data: TaskFormData) {
    try {
      if (editingTask) {
        await editTask(editingTask.id, data);
      } else {
        await addTask(data);
      }
      closeForm();
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
      await editTask(id, { status: "completed" });
    } catch (error) {
      showError("Não foi possível concluir a tarefa.", error);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await removeTask(id);
    } catch (error) {
      showError("Não foi possível excluir a tarefa.", error);
    }
  }

  // ---------- O que mostrar na tela ----------
  function renderContent() {
    // Primeira carga: tela inteira de "Carregando".
    if (loading) {
      return <p className="home__message">⏳ Carregando tarefas...</p>;
    }

    return (
      <>
        {/* Só mostra o dashboard se já temos números reais */}
        {stats && (
          <Dashboard
            total={stats.total}
            pending={stats.pending}
            inProgress={stats.inProgress}
            completed={stats.completed}
          />
        )}

        {/* Os filtros ficam SEMPRE visíveis, mesmo se a busca falhar */}
        <Filters filters={filters} onChange={setFilters} />

        {loadError ? (
          <div className="home__message home__message--error">
            <p>❌ {loadError}</p>
            <button className="btn btn--outline" onClick={retry}>
              Tentar novamente
            </button>
          </div>
        ) : (
          // Durante uma nova busca, a lista esmaece e não aceita cliques
          // (evita clicar em um card que está prestes a ser substituído).
          <div
            className={`home__list ${refreshing ? "home__list--refreshing" : ""}`}
          >
            <TaskList
              tasks={visibleTasks}
              onEdit={openEditForm}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          </div>
        )}
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
