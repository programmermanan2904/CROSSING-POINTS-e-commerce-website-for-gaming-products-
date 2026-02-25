import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const CLOUD_NAME = "dv251twzd"; // 🔥 PUT YOUR REAL CLOUD NAME HERE

export default function Dashboard() {
  const [data, setData] = useState(null);

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).token
    : null;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/vendor/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  if (!data) return <p>Loading...</p>;

  const pieData = [
    { name: "Delivered", value: data.statusCounts.delivered },
    { name: "Processing", value: data.statusCounts.processing },
    { name: "Cancelled", value: data.statusCounts.cancelled },
    { name: "Shipped", value: data.statusCounts.shipped },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF4444", "#3399FF"];

  return (
    <>
      <h1 className="page-title">Vendor Dashboard</h1>

      {/* Stats Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{data.totalProducts}</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹ {data.totalRevenue}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{data.totalOrders}</p>
        </div>

        <div className="card">
          <h3>Cancelled Orders</h3>
          <p>{data.cancelledOrders}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">

        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Order Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Top Products */}
      <div className="table-section">
        <h3>Top Selling Products</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sold</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.topProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.sold}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Section */}
      <div className="low-stock-section">
        <h3>Low Stock Alerts</h3>

        <div className="low-stock-grid">
          {data.lowStockProducts.length === 0 ? (
            <p>All products have sufficient stock.</p>
          ) : (
            data.lowStockProducts.map((product) => (
              <div key={product._id} className="low-stock-card">

                {product.image && (
                  <img
                    src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${product.image}`}
                    alt={product.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                )}

                <div className="low-stock-info">
                  <p className="product-name">{product.name}</p>
                  <p className="stock-left">
                    {product.stock} left
                  </p>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}