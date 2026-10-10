import "./App.css";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

import Tasks from "./pages/Tasks.jsx";
import Login from "./pages/auth/Login.jsx";
import ProtectRoute from "./components/ProtectRoute.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminUsers from "./pages/admin/AdminUser.jsx";
import AdminTasks from "./pages/admin/AdminTask.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <ProtectRoute requiredRole="user">
              <Tasks />
            </ProtectRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectRoute requiredRole="admin">
              <AdminUsers />
            </ProtectRoute>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <ProtectRoute requiredRole="admin">
              <AdminTasks />
            </ProtectRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
