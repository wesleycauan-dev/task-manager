import type {
  ApiErrorResponse,
  CreateTaskPayload,
  TaskListResponse,
  TaskQueryParams,
  TaskResponse,
  TaskStats,
  UpdateTaskPayload,
} from "../types/api";

// Lê a URL da API do .env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL;

// Erro próprio da API. Além da mensagem, guarda o status HTTP
// (400, 404, 500...) e a lista de detalhes que o backend enviar.
// status 0 = nem chegamos a falar com o servidor.

export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(message: string, status = 0, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// Devolve uma mensagem segura para mostrar ao usuário, seja qual for o erro.
// "unknown" obriga a verificar o tipo antes de usar.
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Ocorreu um erro inesperado.";
}

// Função central: TODAS as chamadas passam por aqui.
// <T> é um "genérico": quem chama diz qual tipo de dado espera receber.

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Só avisamos que o corpo é JSON quando existe corpo.
  // (Cabeçalho desnecessário em GET causaria uma requisição "preflight" extra.)
  const headers: Record<string, string> = {};
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    // fetch lançou erro: API desligada, sem internet ou bloqueio de CORS.
    throw new ApiError("Não foi possível conectar ao servidor.");
  }

  // 400, 404, 500... O fetch não considera erro, então conferimos "ok" (status 200-299).
  if (!response.ok) {
    let body: Partial<ApiErrorResponse> = {};
    try {
      body = await response.json();
    } catch {
      // a resposta de erro não era JSON; seguimos com a mensagem padrão
    }
    throw new ApiError(
      body.message ?? "Erro inesperado no servidor.",
      response.status,
      body.details,
    );
  }

  // 204 No Content (DELETE): não existe corpo para converter.
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// Transforma { status: 'pending', search: 'react' } em "?status=pending&search=react".
// Campos vazios ou undefined são ignorados.
function buildQuery(params: TaskQueryParams): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

// ---------------------------------------------------------------
// FUNÇÕES DA API (uma para cada rota do contrato da Etapa 4)
// ---------------------------------------------------------------

// GET /tasks
export function listTasks(
  params: TaskQueryParams = {},
): Promise<TaskListResponse> {
  return request<TaskListResponse>(`/tasks${buildQuery(params)}`);
}

// GET /tasks/stats
export function getTaskStats(): Promise<TaskStats> {
  return request<TaskStats>("/tasks/stats");
}

// POST /tasks
export function createTask(payload: CreateTaskPayload): Promise<TaskResponse> {
  return request<TaskResponse>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload), // objeto → texto JSON
  });
}

// PATCH /tasks/:id
export function updateTask(
  id: number,
  payload: UpdateTaskPayload,
): Promise<TaskResponse> {
  return request<TaskResponse>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// DELETE /tasks/:id
export function deleteTask(id: number): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: "DELETE" });
}
