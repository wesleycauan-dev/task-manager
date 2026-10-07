import type { Task } from "../../types/task";
import TaskCard from "../TaskCard/TaskCard";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskList({ tasks, onEdit, onComplete, onDelete }: TaskListProps) {
  // Estado "lista vazia"
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>📭 Você ainda não possui tarefas.</p>
      </div>
    );
  }

  return (
    <section className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}

export default TaskList;
