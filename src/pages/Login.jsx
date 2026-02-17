import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // ✅ IMPORTANT
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL,
        {
          email,
          password,
        }
      );

      const data = response.data;

      // ✅ Store correct token
      localStorage.setItem("token", data.token);

      // ✅ Store user
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Update AuthContext (very important)
      login(data);

      alert("Login successful");

      // ✅ Use navigate instead of window.location
      if (data.user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        {/* ✅ FIXED HERE */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
