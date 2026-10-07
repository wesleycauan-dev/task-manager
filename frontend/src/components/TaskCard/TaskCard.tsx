import { PRIORITY_LABELS, STATUS_LABELS, type Task } from "../../types/task";
import "./TaskCard.css";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

// Converte "2026-10-10" em "10/10/2026".
// pode mostrar o dia anterior por causa do fuso horário.
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function TaskCard({ task, onEdit, onComplete, onDelete }: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <article
      className={`task-card ${isCompleted ? "task-card--completed" : ""}`}
    >
      <div className="task-card__top">
        <h3 className="task-card__title">{task.title}</h3>
        <span
          className={`task-card__priority task-card__priority--${task.priority}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      <p className="task-card__description">
        {task.description || "Sem descrição."}
      </p>

      <div className="task-card__meta">
        <span>📅 {formatDate(task.dueDate)}</span>
        <span>🏷️ {task.category}</span>
        <span className={`task-card__status task-card__status--${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      <div className="task-card__actions">
        <button className="btn btn--outline" onClick={() => onEdit(task)}>
          Editar
        </button>
        {!isCompleted && (
          <button
            className="btn btn--success"
            onClick={() => onComplete(task.id)}
          >
            Concluir
          </button>
        )}
        <button className="btn btn--danger" onClick={() => onDelete(task.id)}>
          Excluir
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
