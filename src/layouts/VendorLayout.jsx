import { Link, Outlet } from "react-router-dom";
import "../styles/Vendor.css";

export default function VendorLayout() {
  return (
    <div className="vendor-layout">

      <aside className="vendor-sidebar">
        <h2 className="logo">Crossing Points</h2>

        <nav>
          <Link to="/vendor/dashboard">Dashboard</Link>
          <Link to="/vendor/products">My Products</Link>
          <Link to="/vendor/orders">Orders</Link> {/* ✅ NEW */}
        </nav>
      </aside>

      <main className="vendor-content">
        <Outlet />
      </main>

    </div>
  );
}
