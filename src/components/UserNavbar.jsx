import { Link, useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="user-navbar">
      <div className="user-navbar-container">

        <h2 className="logo">
          <Link to="/">Crossing Points</Link>
        </h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>

          {token ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default UserNavbar;
