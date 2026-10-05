import TasksItems from "../components/TasksItems.jsx";
import axiosClient from "../api/axiosClient.js";
import "./css/Tasks.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Plus, Search, LayoutGrid, LogOut, Trash2 } from "lucide-react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [editId, setEditId] = useState(null);

  const [searchKey, setSearchKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  // Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  // Get tasks
  useEffect(() => {
    axiosClient
      .get("/tasks/")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  }, []);

  useEffect(() => {
    axiosClient
      .get("/users/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  }, []);

  const currentUserId = Number(localStorage.getItem("user_id"));

  const currentUser = users.find((user) => user.id === currentUserId);

  // Format datetime
  const formatDueAt = (value) => {
    if (!value) return null;

    if (value.includes("+07:00")) {
      return value;
    }

    return `${value}+07:00`;
  };

  // Filter tasks
  const filterTask = tasks.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(searchKey.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "pending" && !task.completed);

    const matchDate = !dateFilter || task.due_at?.slice(0, 10) === dateFilter;

    return matchSearch && matchStatus && matchDate;
  });

  // Sort tasks: Pending first, then by due_at
  const sortedTasks = [...filterTask].sort((a, b) => {
    // Pending lên trước
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }

    // Sau đó sắp xếp theo due_at
    return new Date(a.due_at) - new Date(b.due_at);
  });

  // Summary
  const completedCount = tasks.filter((task) => task.completed).length;

  const pendingCount = tasks.length - completedCount;

  // Open create form
  const openCreateForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setDueAt("");
    setErrorMessage("");
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setTitle("");
    setDescription("");
    setDueAt("");
    setErrorMessage("");
  };

  // Add
  const addTask = async () => {
    if (!title.trim() || !description.trim() || !dueAt.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await axiosClient.post("/tasks/", {
        title: title,
        description: description,
        due_at: formatDueAt(dueAt),
      });

      setTasks([...tasks, response.data]);

      closeForm();
    } catch {
      setErrorMessage("Không thể tạo task. Vui lòng thử lại.");
    }
  };

  // Delete
  const deleteTask = (id) => {
    setDeleteId(id);
  };

  const confirmTask = async () => {
    try {
      await axiosClient.delete(`/tasks/${deleteId}`);

      setTasks(tasks.filter((task) => task.id !== deleteId));

      setDeleteId(null);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Toggle status
  const toggleTask = async (id) => {
    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    try {
      const response = await axiosClient.patch(`/tasks/${id}`, {
        completed: !task.completed,
      });

      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  // Edit
  const editTask = (id, oldTitle, oldDescription, oldDueAt) => {
    setEditId(id);
    setTitle(oldTitle);
    setDescription(oldDescription);
    setDueAt(oldDueAt ? oldDueAt.slice(0, 16) : "");

    setErrorMessage("");
    setShowForm(true);
  };

  // Update
  const updateTask = async () => {
    if (!title.trim() || !description.trim() || !dueAt.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await axiosClient.patch(`/tasks/${editId}`, {
        title: title,
        description: description,
        due_at: formatDueAt(dueAt),
      });

      setTasks((tasks) =>
        tasks.map((task) => (task.id === editId ? response.data : task)),
      );

      closeForm();
    } catch (error) {
      console.log(error.response?.data);
      setErrorMessage("Không thể cập nhật task. Vui lòng thử lại.");
    }
  };

  return (
    <div className="tasks-page">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <LayoutGrid size={21} strokeWidth={2.3} />

            <span>Task Manager</span>
          </div>

          <button className="nav-item">
            <LayoutGrid size={17} />

            <span>Overview</span>
          </button>
        </div>

        {/* USER */}
        <div className="sidebar-user">
          <div className="user-avatar">U</div>

          <div className="user-info">
            <strong>User: {currentUser?.username}</strong>

            <span>Task Manager</span>
          </div>

          <button className="sidebar-logout" onClick={logout} title="Đăng xuất">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="tasks-main">
        {/* HEADER */}
        <div className="tasks-header">
          <div>
            <h1 className="tasks-title">Tasks Overview</h1>

            <p className="tasks-subtitle">
              Track, filter, and organize project tasks efficiently
            </p>
          </div>

          <button className="btn-create" onClick={openCreateForm}>
            <Plus size={17} />

            <span>Create task</span>
          </button>
        </div>

        {/* SUMMARY */}
        <div className="task-summary">
          <span style={{ color: "#334155", fontWeight: "500" }}>
            Total <strong>{tasks.length}</strong>
          </span>

          <span style={{ color: "#15803d", fontWeight: "500" }}>
            Completed <strong>{completedCount}</strong>
          </span>

          <span style={{ color: "#b45309", fontWeight: "500" }}>
            Pending <strong>{pendingCount}</strong>
          </span>
        </div>

        {/* SEARCH / FILTER */}
        <div className="filter-box">
          <div className="search-wrapper">
            <Search className="search-icon" size={17} />

            <input
              type="text"
              value={searchKey}
              placeholder="Search tasks..."
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>

            <option value="pending">Pending</option>

            <option value="completed">Completed</option>
          </select>

          {/* FILTER DATE */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="date-filter"
          />
        </div>

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <div className="modal-overlay" onClick={closeForm}>
            <div className="task-modal" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h2>{editId ? "Edit Task" : "Create New Task"}</h2>

                <button
                  type="button"
                  className="form-close"
                  onClick={closeForm}
                >
                  ×
                </button>
              </div>

              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className={editId ? "btn-update" : "btn-save"}
                  onClick={editId ? updateTask : addTask}
                >
                  {editId ? "Update Task" : "Create Task"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* DELETE MODAL */}

        {deleteId && (
          <div className="modal-overlay" onClick={cancelDelete}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="delete-modal-icon">
                <Trash2 size={22} />
              </div>

              <div className="delete-modal-content">
                <h2>Delete Task?</h2>

                <p>
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </p>
              </div>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn-delete"
                  onClick={confirmTask}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TASK LIST */}
        <div className="task-list">
          {sortedTasks.map((task) => (
            <TasksItems
              key={task.id}
              task={task}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
              onToggleTask={toggleTask}
            />
          ))}

          {filterTask.length === 0 && (
            <div className="empty-message">
              <div className="empty-icon">
                <LayoutGrid size={20} />
              </div>

              <h3>{tasks.length === 0 ? "No tasks yet" : "No tasks found"}</h3>

              <p>
                {tasks.length === 0
                  ? "Create your first task to get started."
                  : "Try creating a new task or changing your filters."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Tasks;
