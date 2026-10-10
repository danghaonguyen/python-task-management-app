
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import axiosClient from "../../api/axiosClient.js";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import "../css/admin/AdminTask.css";

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosClient.get("/admin/tasks/all");
        setTasks(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Không thể tải danh sách tasks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const keyword = search.trim().toLowerCase();

    return (
      String(task.id).includes(keyword) ||
      task.title?.toLowerCase().includes(keyword) ||
      task.description?.toLowerCase().includes(keyword) ||
      String(task.user_id).includes(keyword)
    );
  });

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("vi-VN");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <section className="admin-users-page">
          <h1>Quản lý tasks</h1>
          <p>Danh sách công việc của tất cả người dùng trong hệ thống.</p>

          <div className="admin-summary">
            <div className="admin-summary-card">
              <span>Tổng số tasks</span>
              <strong>{tasks.length}</strong>
            </div>

            <div className="admin-summary-card">
              <span>Đã hoàn thành</span>
              <strong>
                {tasks.filter((task) => task.completed).length}
              </strong>
            </div>

            <div className="admin-summary-card">
              <span>Chưa hoàn thành</span>
              <strong>
                {tasks.filter((task) => !task.completed).length}
              </strong>
            </div>
          </div>

          <div className="admin-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Tìm theo ID, tiêu đề, mô tả hoặc User ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-table-container">
            {loading ? (
              <p className="admin-message">Đang tải danh sách tasks...</p>
            ) : error ? (
              <p className="admin-error">{error}</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task</th>
                    <th>Mô tả</th>
                    <th>User ID</th>
                    <th>Trạng thái</th>
                    <th>Hạn hoàn thành</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td className="admin-task-description">
                          {task.description || "—"}
                        </td>
                        <td>{task.user_id}</td>
                        <td>
                          <span
                            className={
                              task.completed
                                ? "admin-task-status completed"
                                : "admin-task-status pending"
                            }
                          >
                            {task.completed
                              ? "Hoàn thành"
                              : "Chưa hoàn thành"}
                          </span>
                        </td>
                        <td>{formatDate(task.due_at)}</td>
                        <td>{formatDate(task.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="admin-empty">
                        {search
                          ? "Không tìm thấy task phù hợp."
                          : "Chưa có task nào."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminTasks;
