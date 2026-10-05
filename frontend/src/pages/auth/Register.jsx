import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../api/axiosAuth";

import "../css/auth/Register.css";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      navigate("/tasks");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Mật khẩu không khớp");
      return;
    }

    try {
      await axiosAuth.post("/users", {
        username: username,
        email: email,
        password: password,
      });

      console.log("Register thành công");
      navigate("/login");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("ERROR:", error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register</h2>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Nhập tên..."
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit">Register</button>

          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => navigate("/login")} className="login-link">
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
