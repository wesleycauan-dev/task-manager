import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../services/api";
import type { TaskQueryParams, TaskStats } from "../types/api";
import type { Task, TaskFilters, TaskFormData } from "../types/task";

// Gera um texto que identifica uma combinação de filtros.
// Ex.: "pending|high|all". Usamos para saber se a lista na tela
// já corresponde aos filtros escolhidos.
function buildKey(status: string, priority: string, category: string): string {
  return `${status}|${priority}|${category}`;
}

export function useTasks(filters: TaskFilters) {
  // Separamos os filtros em valores simples (texto).
  // IMPORTANTE: não usamos o objeto "filters" nas dependências abaixo,
  // porque um objeto é "novo" a cada renderização e causaria um loop infinito.
  const { status, priority, category } = filters;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null); // null = ainda não carregou
  const [loading, setLoading] = useState(true); // carregamento completo (primeira vez / tentar de novo)
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null); // filtros da última resposta

  // Contador de requisições. useRef guarda um valor que NÃO provoca nova renderização.
  const latestRequest = useRef(0);

  // "Atualizando" é DERIVADO: a lista na tela ainda é de outros filtros.
  // Não precisamos de mais um useState para isso.
  const refreshing =
    !loading && loadedKey !== buildKey(status, priority, category);

  const load = useCallback(async () => {
    // Cada chamada recebe um número. A mais recente tem o maior número.
    const requestId = ++latestRequest.current;
    const key = buildKey(status, priority, category);

    // Monta os parâmetros da URL. 'all' vira undefined (= não envia).
    const params: TaskQueryParams = {
      status: status === "all" ? undefined : status,
      priority: priority === "all" ? undefined : priority,
      category: category === "all" ? undefined : category,
    };

    try {
      // A lista respeita os filtros. As estatísticas NÃO:
      // o dashboard sempre mostra o total geral.
      const [tasksData, statsData] = await Promise.all([
        api.listTasks(params),
        api.getTaskStats(),
      ]);

      // Chegou uma resposta velha? Descarta.
      if (requestId !== latestRequest.current) return;

      setTasks(tasksData);
      setStats(statsData);
      setLoadError(null);
    } catch (error) {
      if (requestId !== latestRequest.current) return; // erro de pedido velho também é descartado
      setLoadError(api.getErrorMessage(error));
    } finally {
      // Só a requisição mais recente encerra o "carregando".
      if (requestId === latestRequest.current) {
        setLoadedKey(key);
        setLoading(false);
      }
    }
  }, [status, priority, category]);

  // Roda na abertura da página E sempre que "load" mudar.
  // "load" muda quando status, priority ou category mudam.
  // Cadeia: usuário muda filtro → Home atualiza o estado → "load" é recriada → efeito roda → nova busca.
  useEffect(() => {
    load();
  }, [load]);

  // Botão "Tentar novamente".
  function retry() {
    setLoading(true);
    setLoadError(null);
    load();
  }

  // Depois de cada ação, "load" busca de novo usando os filtros ATUAIS.
  // Assim, se há um filtro ativo, a lista continua respeitando-o.

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
