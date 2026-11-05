import {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  type TaskFormData,
} from "../types/task";

// Um texto de erro opcional para cada campo do formulário.
// Ex.: { title: 'O título é obrigatório.' }
export type TaskFormErrors = Partial<Record<keyof TaskFormData, string>>;

// Mesma regra do backend: data REAL no formato AAAA-MM-DD.
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// Devolve um objeto com os erros encontrados. Objeto vazio = tudo certo.
export function validateTaskForm(data: TaskFormData): TaskFormErrors {
  const errors: TaskFormErrors = {};

  const title = data.title.trim();
  if (!title) {
    errors.title = "O título é obrigatório.";
  } else if (title.length > 100) {
    errors.title = "O título deve ter no máximo 100 caracteres.";
  }

  if (data.description.length > 500) {
    errors.description = "A descrição deve ter no máximo 500 caracteres.";
  }

  if (!STATUSES.includes(data.status)) errors.status = "Escolha um status.";
  if (!PRIORITIES.includes(data.priority))
    errors.priority = "Escolha uma prioridade.";
  if (!CATEGORIES.includes(data.category))
    errors.category = "Escolha uma categoria.";

  if (!data.dueDate) {
    errors.dueDate = "A data de vencimento é obrigatória.";
  } else if (!isValidDate(data.dueDate)) {
    errors.dueDate = "Informe uma data válida.";
  }

  return errors;
}
