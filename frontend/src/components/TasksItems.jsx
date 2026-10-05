import "../pages/css/TasksItem.css";

import {
  Pencil,
  Trash2,
} from "lucide-react";

function TasksItems({
  task,
  onDeleteTask,
  onToggleTask,
  onEditTask,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  return (
    <div className="task-card">

      {/* CARD HEADER */}
      <div className="task-card-header">

        <h3 className="task-title">
          {task.title}
        </h3>

        <div className="task-icons">

          <button
            className="icon-button edit-icon"
            onClick={() =>
              onEditTask(
                task.id,
                task.title,
                task.description,
                task.due_at,
              )
            }
            title="Sửa"
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-button delete-icon"
            onClick={() =>
              onDeleteTask(task.id)
            }
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>

      {/* DESCRIPTION */}
      <p className="task-description">
        {task.description}
      </p>

      {/* STATUS */}
      <div className="task-status-row">

        <span
          className={
            task.completed
              ? "status-badge completed"
              : "status-badge pending"
          }
        >
          {task.completed
            ? "Completed"
            : "Pending"}
        </span>

      </div>

      {/* FOOTER */}
      <div className="task-footer">

        <span className="task-due">
          Due: {formatDate(task.due_at)}
        </span>

        <button
          className="status-button"
          onClick={() =>
            onToggleTask(task.id)
          }
        >
          {task.completed
            ? "Mark pending"
            : "Complete"}
        </button>

      </div>

    </div>
  );
}

export default TasksItems;