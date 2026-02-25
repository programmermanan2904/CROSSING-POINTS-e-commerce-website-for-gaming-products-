import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/vendororder.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function VendorOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  // ================= FETCH VENDOR ORDERS =================
  const fetchVendorOrders = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/orders/vendor`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchVendorOrders();
    }
  }, [user]);

  // ================= UPDATE STATUS =================
  const updateStatus = async (orderId, itemId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/orders/${orderId}/item/${itemId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      fetchVendorOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="vendor-orders-container">
      <h2 className="vendor-orders-title">Vendor Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className={`order-card ${
              order.orderStatus === "cancelled" ? "cancelled-order" : ""
            }`}
          >
            {/* ===== ORDER HEADER ===== */}
            <div className="order-header">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Customer:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> {order.user?.email}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {order.orderStatus === "cancelled" && (
                <div className="cancelled-badge">
                  ❌ Cancelled by Customer
                </div>
              )}
            </div>

            {/* ===== SHIPPING ADDRESS ===== */}
            <div className="order-address">
              <h4>Shipping Address</h4>
              <p><strong>Name:</strong> {order.shippingAddress?.fullName}</p>
              <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
              <p>
                <strong>Address:</strong>{" "}
                {order.shippingAddress?.addressLine},{" "}
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.postalCode}
              </p>
            </div>

            {/* ===== ORDER ITEMS ===== */}
            <div className="order-items">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className={`order-item ${
                    item.status === "cancelled" ? "cancelled-item" : ""
                  }`}
                >
                  <p><strong>Product:</strong> {item.product?.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={
                        item.status === "cancelled"
                          ? "status-cancelled"
                          : ""
                      }
                    >
                      {item.status}
                    </span>
                  </p>

                  <select
                    className="status-select"
                    value={item.status}
                    disabled={item.status === "cancelled"}
                    onChange={(e) =>
                      updateStatus(order._id, item._id, e.target.value)
                    }
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              ))}
            </div>

          </div>
        ))
      )}
    </div>
  );
}
