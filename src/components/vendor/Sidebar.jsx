import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="vendor-sidebar">
      <h2 className="vendor-logo">Crossing Points</h2>

      <nav>
        <ul>

          <li>
            <NavLink
              to="/vendor/dashboard"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              📊 Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/vendor/products"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              🎮 My Products
            </NavLink>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
