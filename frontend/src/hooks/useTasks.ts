import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../services/api";
import type { TaskQueryParams, TaskStats } from "../types/api";
import type { Task, TaskFilters, TaskFormData } from "../types/task";

// Identifica uma combinação de filtros. Ex.: "react|pending|high|all".
// Usamos para saber se a lista na tela já corresponde aos filtros escolhidos.
function buildKey(
  search: string,
  status: string,
  priority: string,
  category: string,
): string {
  return `${search}|${status}|${priority}|${category}`;
}

// ATENÇÃO: o "search" que este hook recebe deve ser o valor COM debounce.
// Quem controla isso é a Home.
export function useTasks(filters: TaskFilters) {
  // Valores simples (texto), e não o objeto, para não causar loop infinito.
  const { status, priority, category } = filters;
  const search = filters.search.trim(); // "  react " vira "react"

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const latestRequest = useRef(0);

  const refreshing =
    !loading && loadedKey !== buildKey(search, status, priority, category);

  const load = useCallback(async () => {
    const requestId = ++latestRequest.current;
    const key = buildKey(search, status, priority, category);

    // 'all' e pesquisa vazia viram undefined (= não vão na URL).
    const params: TaskQueryParams = {
      search: search || undefined,
      status: status === "all" ? undefined : status,
      priority: priority === "all" ? undefined : priority,
      category: category === "all" ? undefined : category,
    };

    try {
      const [tasksData, statsData] = await Promise.all([
        api.listTasks(params),
        api.getTaskStats(),
      ]);

      if (requestId !== latestRequest.current) return; // resposta velha: descarta

      setTasks(tasksData);
      setStats(statsData);
      setLoadError(null);
    } catch (error) {
      if (requestId !== latestRequest.current) return;
      setLoadError(api.getErrorMessage(error));
    } finally {
      if (requestId === latestRequest.current) {
        setLoadedKey(key);
        setLoading(false);
      }
    }
  }, [search, status, priority, category]);

  useEffect(() => {
    load();
  }, [load]);

  function retry() {
    setLoading(true);
    setLoadError(null);
    load();
  }

  async function addTask(data: TaskFormData) {
    await api.createTask(data);
    await load();
  }

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
    refreshing,
    loadError,
    retry,
    addTask,
    editTask,
    removeTask,
  };
}
