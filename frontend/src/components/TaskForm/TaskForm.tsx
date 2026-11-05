import { useState, type FormEvent } from "react";
import {
  CATEGORIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type Task,
  type TaskFormData,
} from "../../types/task";
import {
  validateTaskForm,
  type TaskFormErrors,
} from "../../utils/validateTask";
import "./TaskForm.css";

interface TaskFormProps {
  task?: Task; // se vier preenchida, estamos EDITANDO; se não, CRIANDO
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

// Retorna a data de hoje, no horário LOCAL, no formato "AAAA-MM-DD".
function today(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "pending",
    priority: task?.priority ?? "medium",
    dueDate: task?.dueDate ?? today(),
    category: task?.category ?? "Estudos",
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    // Ao corrigir um campo, o erro dele some na hora.
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1) Valida antes de enviar. Se houver erro, mostra e para por aqui.
    const foundErrors = validateTaskForm(formData);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    // 2) Envia. "submitting" desabilita o botão enquanto a API responde.
    setSubmitting(true);
    try {
      // O título vai sem espaços nas pontas.
      await onSubmit({ ...formData, title: formData.title.trim() });
    } finally {
      setSubmitting(false); // roda sempre, dando certo ou errado
    }
  }

  return (
    <div className="modal" onClick={onCancel}>
      {/* noValidate: as mensagens são NOSSAS, e não as do navegador */}
      <form
        className="task-form"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        noValidate
      >
        <h2 className="task-form__title">
          {task ? "Editar tarefa" : "Nova tarefa"}
        </h2>

        <label className="task-form__field">
          Título *
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex.: Estudar React"
            maxLength={100}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && (
            <span className="task-form__error">{errors.title}</span>
          )}
        </label>

        <label className="task-form__field">
          Descrição
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex.: Estudar componentes, props e hooks."
            rows={3}
            maxLength={500}
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && (
            <span className="task-form__error">{errors.description}</span>
          )}
        </label>

        <div className="task-form__row">
          <label className="task-form__field">
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              aria-invalid={Boolean(errors.status)}
            >
              <option value="pending">{STATUS_LABELS.pending}</option>
              <option value="in_progress">{STATUS_LABELS.in_progress}</option>
              <option value="completed">{STATUS_LABELS.completed}</option>
            </select>
            {errors.status && (
              <span className="task-form__error">{errors.status}</span>
            )}
          </label>

          <label className="task-form__field">
            Prioridade
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              aria-invalid={Boolean(errors.priority)}
            >
              <option value="low">{PRIORITY_LABELS.low}</option>
              <option value="medium">{PRIORITY_LABELS.medium}</option>
              <option value="high">{PRIORITY_LABELS.high}</option>
            </select>
            {errors.priority && (
              <span className="task-form__error">{errors.priority}</span>
            )}
          </label>
        </div>

        <div className="task-form__row">
          <label className="task-form__field">
            Data de vencimento *
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              aria-invalid={Boolean(errors.dueDate)}
            />
            {errors.dueDate && (
              <span className="task-form__error">{errors.dueDate}</span>
            )}
          </label>

          <label className="task-form__field">
            Categoria
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              aria-invalid={Boolean(errors.category)}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="task-form__error">{errors.category}</span>
            )}
          </label>
        </div>

        <div className="task-form__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="submit"
            className="task-form__submit"
            disabled={submitting}
          >
            {submitting
              ? "Salvando..."
              : task
                ? "Salvar alterações"
                : "Criar tarefa"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
