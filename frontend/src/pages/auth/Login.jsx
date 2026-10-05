import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "../css/auth/Login.css";

import axiosAuth from "../../api/axiosAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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

      const decoded = jwtDecode(response.data.access_token);
      
      localStorage.setItem("user_id", decoded.user_id);

      console.log("Login thành công");
      navigate("/tasks");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
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
            <span className="register-link" onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
