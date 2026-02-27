import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================= VALIDATION =================
  const validateForm = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password.trim())
      newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
// ================= LOGIN =================
const handleLogin = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const response = await axios.post(
      `${BASE_URL}/api/users/login`,
      { email, password }
    );

    const data = response.data;

    const userData = data.data?.user || data.user;
    const token = data.data?.token || data.token;

    // Use AuthContext login ONLY
    login({ user: userData, token });

    if (userData.role === "vendor") {
      navigate("/vendor/dashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
    setErrors({
      api: error.response?.data?.message || "Login failed",
    });
  }
};

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        {errors.api && <p className="error">{errors.api}</p>}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
}
