import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setProducts(res.data);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    };

    if (token) fetchProducts();

  }, [token]);

  return (
    <>
      <h1 className="page-title">Vendor Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="card">
          <h3>Total Sales</h3>
          <p>₹0</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>0</p>
        </div>

      </div>
    </>
  );
}
