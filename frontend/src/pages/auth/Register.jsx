import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../api/axiosAuth";

import "../css/auth/Register.css";
import Toast from "../../components/Toast.jsx";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Mật khẩu không khớp");
      showToast("Mật khẩu không khớp!", "error");
      return;
    }

    try {
      await axiosAuth.post("/users", {
        username: username,
        email: email,
        password: password,
      });

      showToast("Đăng ký thành công!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("ERROR:", error);
       showToast("Đăng ký thất bại!", "error");
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
    </>
  );
}

export default Register;
