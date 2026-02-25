import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/navbar.css";

const BASE_URL = "http://localhost:5000";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isShopPage = location.pathname === "/shop";

  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef();

  /* ================= FETCH CATEGORIES DYNAMICALLY ================= */
  useEffect(() => {
    if (isShopPage) {
      axios
        .get(`${BASE_URL}/api/products`)
        .then((res) => {
          const uniqueCategories = [
            ...new Set(
              res.data
                .map((p) => p.category)
                .filter(Boolean)
            ),
          ];
          setCategories(uniqueCategories);
        })
        .catch((err) => {
          console.log(err.response?.data || err.message);
        });
    }
  }, [isShopPage]);

  /* ================= SCROLL WITH OFFSET ================= */
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      const yOffset = -80;
      const y =
        section.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

      setOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
                {categories.map((category) => {
                  const sectionId = category
                    .toLowerCase()
                    .replace(/\s+/g, "");

                  return (
                    <button
                      key={category}
                      onClick={() => scrollToSection(sectionId)}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <Link to="/cart" className="cart-link">
          Cart
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {user ? (
          <button onClick={handleLogout} className="logout-btn">
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