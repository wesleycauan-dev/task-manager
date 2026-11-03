import type { ReactNode } from "react";
import type { Task } from "../../types/task";
import TaskCard from "../TaskCard/TaskCard";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string; // texto mostrado quando a lista está vazia
  emptyAction?: ReactNode; // botão opcional abaixo da mensagem
  onEdit: (task: Task) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskList({
  tasks,
  emptyMessage,
  emptyAction,
  onEdit,
  onComplete,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>{emptyMessage}</p>
        {emptyAction}
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
