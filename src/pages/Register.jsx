import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [location, setLocation] = useState("");

  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});

  // ================= VALIDATION =================
  const validateForm = () => {
    let newErrors = {};

    if (!name.trim() || name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email address";

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone))
      newErrors.phone = "Phone must be 10 digits";

    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (role === "vendor") {
      if (!businessName.trim())
        newErrors.businessName = "Business name is required";

      if (!gstNumber.trim())
        newErrors.gstNumber = "GST number is required";

      if (!location.trim())
        newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = {
      name,
      email,
      password,
      phone,
      role,
      ...(role === "vendor" && {
        businessName,
        gstNumber,
        location,
      }),
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/register`,
        userData
      );

      const user = response.data.data?.user || response.data.user;
      const token = response.data.data?.token || response.data.token;

      // 🔥 Use AuthContext instead of manual localStorage
      login({ user, token });

      if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>

        {errors.api && <p className="error">{errors.api}</p>}

        {/* ===== ROLE TOGGLE ===== */}
        <div className="role-toggle">
          <div
            className={`toggle-btn ${role === "user" ? "active" : ""}`}
            onClick={() => setRole("user")}
          >
            User
          </div>

          <div
            className={`toggle-btn ${role === "vendor" ? "active" : ""}`}
            onClick={() => setRole("vendor")}
          >
            Vendor
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          {role === "vendor" && (
            <>
              <input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              {errors.businessName && (
                <span className="error">{errors.businessName}</span>
              )}

              <input
                type="text"
                placeholder="GST Number"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
              {errors.gstNumber && (
                <span className="error">{errors.gstNumber}</span>
              )}

              <input
                type="text"
                placeholder="Business Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && (
                <span className="error">{errors.location}</span>
              )}
            </>
          )}

          <button className="auth-btn">Register</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}