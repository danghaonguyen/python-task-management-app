import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "../css/auth/Login.css";

import axiosAuth from "../../api/axiosAuth";
import Toast from "../../components/Toast.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      navigate("/tasks");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosAuth.post("/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);

      const decoded = jwtDecode(response.data.access_token);

      localStorage.setItem("user_id", decoded.user_id);

      showToast("Đăng nhập thành công!", "success");

      setTimeout(() => {
        if (response.data.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/tasks");
        }
      }, 1000);
    } catch (error) {
      console.log(error.response?.data);
      showToast("Đăng nhập thất bại!", "error");
    }
  };
  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3000);
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Login</h1>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>

            <p>
              Chưa có tài khoản?{" "}
              <span
                className="register-link"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
