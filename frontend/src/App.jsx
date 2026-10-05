import "./App.css";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";



import Tasks from "./pages/Tasks.jsx";
import Login from "./pages/auth/Login.jsx";
import ProtectRoute from "./components/ProtectRoute.jsx";
import Register from "./pages/auth/Register.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route
          path="/tasks"
          element={
            <ProtectRoute>
              <Tasks />
            </ProtectRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
