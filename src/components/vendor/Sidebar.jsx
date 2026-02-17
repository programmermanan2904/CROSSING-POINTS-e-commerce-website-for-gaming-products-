import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="vendor-sidebar">
      <h2 className="vendor-logo">Crossing Points</h2>

      <nav>
        <ul>
          <li>
            <Link to="/vendor/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/vendor/products">My Products</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
