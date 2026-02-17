import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isShopPage = location.pathname === "/shop";

  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  // ✅ SAFE cart count calculation
  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        CROSSING POINTS
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/shop">Shop</Link>

        {isShopPage && (
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropbtn"
              onClick={() => setOpen(!open)}
            >
              Categories ▼
            </button>

            {open && (
              <div className="dropdown-content">
                <button onClick={() => scrollToSection("headphones")}>
                  Headphones
                </button>
                <button onClick={() => scrollToSection("keyboard")}>
                  Keyboard
                </button>
                <button onClick={() => scrollToSection("mouse")}>
                  Mouse
                </button>
                <button onClick={() => scrollToSection("monitor")}>
                  Monitor
                </button>
                <button onClick={() => scrollToSection("mousepads")}>
                  Mousepads
                </button>
              </div>
            )}
          </div>
        )}

        <Link to="/cart" className="cart-link">
          Cart
          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
