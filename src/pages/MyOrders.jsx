import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "../styles/myOrders.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const CLOUD_NAME = "dv251twzd";

export default function MyOrders() {
  const { user } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // ✅ Success banner state
  const [showSuccessBanner, setShowSuccessBanner] = useState(
    location.state?.orderSuccess || false
  );

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/orders/my`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchOrders();
    }
  }, [user]);

  // ✅ Auto hide success banner after 3 seconds
  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);

  /* ================= CANCEL ORDER ================= */
  const handleCancel = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/orders/${selectedOrderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      await fetchOrders();
      setShowCancelModal(false);
      setSelectedOrderId(null);
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  /* ================= TIMELINE ================= */
  const renderTimeline = (status) => {
    const steps = ["processing", "shipped", "delivered"];
    const currentIndex = steps.indexOf(status);
    const progressPercent =
      currentIndex >= 0
        ? (currentIndex / (steps.length - 1)) * 66.66
        : 0;

    return (
      <div className="timeline-wrapper">
        <div
          className="timeline-progress"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="timeline-steps">
          {steps.map((step, index) => (
            <div key={step} className="timeline-step">
              <div
                className={`timeline-dot ${
                  index <= currentIndex ? "active-dot" : ""
                }`}
              />
              <span
                className={`timeline-label ${
                  index <= currentIndex ? "active-label" : ""
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="orders-loading">
        Loading your battle history...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!orders.length) {
    return (
      <div className="orders-empty">
        <h2>No Orders Found</h2>
        <p>Your gaming journey hasn’t started yet 🚀</p>
      </div>
    );
  }

  /* ================= STATS ================= */
  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0
  );

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus === "processing" ||
      order.orderStatus === "shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  /* ================= UI ================= */
  return (
    <div className="orders-container">
      <h2 className="orders-title">⚔ My Battle Orders</h2>

      {/* ✅ Success Banner */}
      {showSuccessBanner && (
        <div className="order-success-banner">
          🎉 Order Placed Successfully!
        </div>
      )}

      {/* Stats */}
      <div className="orders-stats">
        <div className="stat-card">
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>

        <div className="stat-card">
          <h3>₹ {totalSpent}</h3>
          <p>Total Spent</p>
        </div>

        <div className="stat-card">
          <h3>{activeOrders}</h3>
          <p>Active Orders</p>
        </div>

        <div className="stat-card">
          <h3>{deliveredOrders}</h3>
          <p>Delivered</p>
        </div>
      </div>

      {/* Orders */}
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <span>
              Order ID: {order._id.slice(-6).toUpperCase()}
            </span>

            <span className={`status ${order.orderStatus}`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="order-date">
            Ordered on:{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>

          {renderTimeline(order.orderStatus)}

          <div className="order-items">
            {order.items.map((item) => {
              const imagePublicId = item?.product?.image;
              const imageUrl = imagePublicId
                ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${imagePublicId}`
                : null;

              return (
                <div key={item._id} className="order-item">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={item?.product?.name || "Product"}
                    />
                  )}

                  <div>
                    <h4>{item?.product?.name}</h4>
                    <p>₹ {item?.price}</p>
                    <p>Qty: {item?.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-footer">
            <div>
              <p>
                Expected Delivery:{" "}
                {order.estimatedDelivery
                  ? new Date(
                      order.estimatedDelivery
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>Total: ₹ {order.totalAmount}</p>
            </div>

            {order.orderStatus === "processing" && (
              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedOrderId(order._id);
                  setShowCancelModal(true);
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h3>⚠ Cancel Order?</h3>
            <p>
              Are you sure you want to cancel this order?
              This action cannot be undone.
            </p>

            <div className="modal-buttons">
              <button
                className="no-btn"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrderId(null);
                }}
              >
                No
              </button>

              <button
                className="yes-btn"
                onClick={handleCancel}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}