import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";
import type { TaskStats } from "../types/api";
import type { Task, TaskFormData } from "../types/task";

const EMPTY_STATS: TaskStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true); // começa true: a primeira busca já vai acontecer
  const [loadError, setLoadError] = useState<string | null>(null);

  // Busca a lista e os números do dashboard ao mesmo tempo.
  // Promise.all dispara as duas chamadas juntas e espera ambas terminarem.
  const load = useCallback(async () => {
    try {
      const [tasksData, statsData] = await Promise.all([
        api.listTasks(),
        api.getTaskStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
      setLoadError(null);
    } catch (error) {
      setLoadError(api.getErrorMessage(error));
    } finally {
      setLoading(false); // roda sempre, dando certo ou errado
    }
  }, []);

  // Busca os dados quando a página abre.
  useEffect(() => {
    load();
  }, [load]);

  // Botão "Tentar novamente".
  function retry() {
    setLoading(true);
    setLoadError(null);
    load();
  }

  // Cada ação chama a API e, se der certo, recarrega os dados.
  // Se a API falhar, o erro SOBE para quem chamou (a Home decide o que mostrar).

  async function addTask(data: TaskFormData) {
    await api.createTask(data);
    await load();
  }

  // Partial<TaskFormData>: pode enviar só os campos que mudaram (PATCH).
  async function editTask(id: number, data: Partial<TaskFormData>) {
    await api.updateTask(id, data);
    await load();
  }

  async function removeTask(id: number) {
    await api.deleteTask(id);
    await load();
  }

  return {
    tasks,
    stats,
    loading,
    loadError,
    retry,
    addTask,
    editTask,
    removeTask,
  };
}
