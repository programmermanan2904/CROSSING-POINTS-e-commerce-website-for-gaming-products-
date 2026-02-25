import { NavLink, Outlet } from "react-router-dom";
import "../styles/vendor.css";

export default function VendorLayout() {
  return (
    <div className="vendor-layout">

      <aside className="vendor-sidebar">
        <h2 className="logo">Crossing Points</h2>

        <nav>
          <NavLink
            to="/vendor/dashboard"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/vendor/products"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            🎮 My Products
          </NavLink>

          <NavLink
            to="/vendor/orders"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            📦 Orders
          </NavLink>

        </nav>
      </aside>

      <main className="vendor-content">
        <Outlet />
      </main>

    </div>
  );
}
