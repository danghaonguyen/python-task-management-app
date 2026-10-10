
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  LogOut,
  LayoutGrid,
} from "lucide-react";

import "../../pages/css/admin/AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="admin-logo">
          <LayoutGrid size={22} strokeWidth={2.3} />
          <span>Administrator</span>
        </div>

        <div className="admin-menu-label">QUẢN TRỊ</div>

        <nav className="admin-nav">
          {/* Dashboard chưa có trang riêng */}
          <button
            type="button"
            className="admin-nav-item"
            disabled
            title="Dashboard chưa được triển khai"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <NavLink
            to="/admin/users"
            end
            className={({ isActive }) =>
              `admin-nav-item${isActive ? " active" : ""}`
            }
          >
            <Users size={18} />
            <span>Quản lý người dùng</span>
          </NavLink>

          <NavLink
            to="/admin/tasks"
            end
            className={({ isActive }) =>
              `admin-nav-item${isActive ? " active" : ""}`
            }
          >
            <ListTodo size={18} />
            <span>Quản lý tasks</span>
          </NavLink>
        </nav>
      </div>

      <div className="admin-sidebar-bottom">
        <div className="admin-user-avatar">
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="admin-user-info">
          <strong>{username}</strong>
          <span>Administrator</span>
        </div>

        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={handleLogout}
          title="Đăng xuất"
          aria-label="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
