import { useState } from "react";
import Header from "../../components/Header/Header";
import Dashboard from "../../components/Dashboard/Dashboard";
import Filters from "../../components/Filters/FIlters";
import TaskList from "../../components/TaskList/TaskList";
import TaskForm from "../../components/TaskForm/TaskForm";
import Toast from "../../components/Toast/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { useNotice } from "../../hooks/useNotice";
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
  // O que o usuário vê nos campos (atualiza a cada tecla).
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);

  // A pesquisa só "vale" 400 ms depois da última tecla.
  const debouncedSearch = useDebounce(filters.search, 400);

  // O hook recebe os filtros com a pesquisa atrasada.
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
  } = useTasks({ ...filters, search: debouncedSearch });

  const { notice, notifySuccess, notifyError, clearNotice } = useNotice();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Algum filtro ou pesquisa está ligado?
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all";

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

  // Mostra "Não foi possível X. (motivo)" na tela.
  function reportError(message: string, error: unknown) {
    notifyError(`${message} (${getErrorMessage(error)})`);
  }

  // ---------- Ações ----------
  async function handleSubmit(data: TaskFormData) {
    const isEditing = editingTask !== undefined;

    try {
      if (editingTask) {
        await editTask(editingTask.id, data);
      } else {
        await addTask(data);
      }
      closeForm();
      notifySuccess(
        isEditing
          ? "Tarefa atualizada com sucesso."
          : "Tarefa criada com sucesso.",
      );
    } catch (error) {
      reportError(
        isEditing
          ? "Não foi possível salvar a tarefa."
          : "Não foi possível criar a tarefa.",
        error,
      );
    }
  }

  async function handleComplete(id: number) {
    try {
      await editTask(id, { status: "completed" });
      notifySuccess("Tarefa concluída.");
    } catch (error) {
      reportError("Não foi possível concluir a tarefa.", error);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await removeTask(id);
      notifySuccess("Tarefa excluída.");
    } catch (error) {
      reportError("Não foi possível excluir a tarefa.", error);
    }
  }

  // ---------- Mensagem de lista vazia ----------
  // stats.total ignora os filtros: 0 significa que o banco está realmente vazio.
  const databaseIsEmpty = stats?.total === 0;
  const emptyMessage = databaseIsEmpty
    ? '📭 Você ainda não possui tarefas. Clique em "+ Nova tarefa" para começar.'
    : "🔍 Nenhuma tarefa encontrada com esses filtros.";

  // ---------- O que mostrar na tela ----------
  function renderContent() {
    if (loading) {
      return <p className="home__message">⏳ Carregando tarefas...</p>;
    }

    return (
      <>
        {stats && (
          <Dashboard
            total={stats.total}
            pending={stats.pending}
            inProgress={stats.inProgress}
            completed={stats.completed}
          />
        )}

        <Filters filters={filters} onChange={setFilters} />

        {loadError ? (
          <div className="home__message home__message--error">
            <p>❌ {loadError}</p>
            <button className="btn btn--outline" onClick={retry}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <div
            className={`home__list ${refreshing ? "home__list--refreshing" : ""}`}
          >
            <TaskList
              tasks={tasks}
              emptyMessage={emptyMessage}
              emptyAction={
                !databaseIsEmpty && hasActiveFilters ? (
                  <button
                    className="btn btn--outline"
                    onClick={() => setFilters(INITIAL_FILTERS)}
                  >
                    Limpar filtros
                  </button>
                ) : undefined
              }
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

      {notice && <Toast notice={notice} onClose={clearNotice} />}
    </>
  );
}

export default Home;
