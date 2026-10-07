import { useState, type FormEvent } from "react";
import {
  CATEGORIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type Task,
  type TaskFormData,
} from "../../types/task";
import "./TaskForm.css";

interface TaskFormProps {
  task?: Task; // se vier preenchida, estamos EDITANDO; se não, CRIANDO
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

// Retorna a data de hoje no formato "AAAA-MM-DD".
function today(): string {
  return new Date().toISOString().split("T")[0];
}

function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  // Estado do formulário: começa com os dados da tarefa (edição) ou valores padrão (criação).
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "pending",
    priority: task?.priority ?? "medium",
    dueDate: task?.dueDate ?? today(),
    category: task?.category ?? "Estudos",
  });

  // Atualiza um campo. O name do input deve ser igual ao nome do campo em TaskFormData.
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // impede o navegador de recarregar a página
    onSubmit(formData);
  }

  return (
    <div className="modal" onClick={onCancel}>
      {/* stopPropagation: clicar DENTRO do formulário não fecha o modal */}
      <form
        className="task-form"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
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
            required
          />
        </label>

        <label className="task-form__field">
          Descrição
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex.: Estudar componentes, props e hooks."
            rows={3}
          />
        </label>

        <div className="task-form__row">
          <label className="task-form__field">
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">{STATUS_LABELS.pending}</option>
              <option value="in_progress">{STATUS_LABELS.in_progress}</option>
              <option value="completed">{STATUS_LABELS.completed}</option>
            </select>
          </label>

          <label className="task-form__field">
            Prioridade
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">{PRIORITY_LABELS.low}</option>
              <option value="medium">{PRIORITY_LABELS.medium}</option>
              <option value="high">{PRIORITY_LABELS.high}</option>
            </select>
          </label>
        </div>

        <div className="task-form__row">
          <label className="task-form__field">
            Data de vencimento
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="task-form__field">
            Categoria
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="task-form__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="task-form__submit">
            {task ? "Salvar alterações" : "Criar tarefa"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
