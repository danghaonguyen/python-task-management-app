
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import "../css/admin/AdminUser.css";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import Toast from "../../components/Toast.jsx";
import { Trash2 } from "lucide-react";

function AdminUser() {
  const [users, setUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [deleteId, setDeleteId] = useState(null);

  // Hiển thị thông báo Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3000);
  };

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    axiosClient
      .get("/admin/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
        setErrorMessage("Không thể tải danh sách người dùng.");
        showToast("Không thể tải danh sách người dùng.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Tìm kiếm theo username hoặc email
  const filteredUsers = users.filter((user) => {
    const keyword = searchKey.trim().toLowerCase();

    return (
      (user.username || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword)
    );
  });

  // Chọn user cần xóa và mở modal
  const deleteUser = (id) => {
    setDeleteId(id);
  };

  // Xác nhận xóa user
  const confirmDeleteUser = async () => {
    if (deleteId === null) return;

    try {
      await axiosClient.delete(`/admin/users/${deleteId}`);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deleteId)
      );

      setDeleteId(null);
      showToast("Xóa user thành công!", "success");
    } catch (error) {
      console.error(error.response?.data || error.message);
      showToast("Không thể xóa user. Vui lòng thử lại!", "error");
    }
  };

  // Đóng modal
  const cancelDeleteUser = () => {
    setDeleteId(null);
  };

  return (
    <div className="admin-layout">
      <Toast message={toast.message} type={toast.type} />

      {/* SIDEBAR DÙNG CHUNG */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <div className="admin-users-page">
          <h1>Quản lý người dùng</h1>
          <p>Tổng số user: {users.length}</p>

          <input
            type="text"
            placeholder="Tìm theo username hoặc email..."
            value={searchKey}
            onChange={(event) => setSearchKey(event.target.value)}
          />

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Ngày tạo</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Đang tải danh sách người dùng...</td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan="6">{errorMessage}</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6">Không tìm thấy người dùng nào.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        className="btn-delete"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={cancelDeleteUser}>
          <div
            className="delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <Trash2 size={22} />
            </div>

            <div className="delete-modal-content">
              <h2>Delete User?</h2>
              <p>
                Are you sure you want to delete this user? This action cannot
                be undone.
              </p>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={cancelDeleteUser}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-delete"
                onClick={confirmDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUser;
