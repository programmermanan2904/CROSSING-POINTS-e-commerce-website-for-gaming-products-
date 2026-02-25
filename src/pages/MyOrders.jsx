import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/myOrders.css";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:5000";
const CLOUD_NAME = "dv251twzd";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW STATES FOR MODAL
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/orders/my`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

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
    } else {
      setLoading(false);
    }
  }, [user]);

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

      // Remove cancelled order from UI
      setOrders((prev) =>
        prev.filter((order) => order._id !== selectedOrderId)
      );

      setShowCancelModal(false);
      setSelectedOrderId(null);

    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  const renderTimeline = (status) => {
    const steps = ["processing", "shipped", "delivered"];

    return (
      <div className="timeline">
        {steps.map((step, index) => {
          const isActive = steps.indexOf(status) >= index;

          return (
            <div
              key={step}
              className={`timeline-step ${isActive ? "active" : ""}`}
            >
              <div className="circle"></div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading)
    return (
      <div className="orders-loading">
        Loading your battle history...
      </div>
    );

  if (!Array.isArray(orders) || orders.length === 0)
    return (
      <div className="orders-empty">
        <h2>No Orders Found</h2>
        <p>Your gaming journey hasn’t started yet 🚀</p>
      </div>
    );

  const totalOrders = orders.length;
  const totalSpent = orders
  .filter(order => order.orderStatus !== "delivered")
  .reduce(
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

  return (
    <div className="orders-container">
      <h2 className="orders-title">⚔ My Battle Orders</h2>

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
            <span className="order-id">
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

          {/* Items */}
          <div className="order-items">
            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map((item, index) => {

                const imagePublicId = item?.product?.image;
                const imageUrl = imagePublicId
                  ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${imagePublicId}`
                  : null;

                return (
                  <div key={item._id || index} className="order-item">

                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={item?.product?.name || "Product"}
                        className="order-image"
                      />
                    )}

                    <div className="item-info">
                      <h4>{item?.product?.name || "Product"}</h4>
                      <p>₹ {item?.price}</p>
                      <p>Qty: {item?.quantity}</p>
                    </div>

                  </div>
                );
              })
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>

          {/* Footer */}
          <div className="order-footer">
            <div className="delivery-info">
              <p>
                Expected Delivery:{" "}
                {order.estimatedDelivery
                  ? new Date(order.estimatedDelivery).toLocaleDateString()
                  : "N/A"}
              </p>

              <p className="order-total">
                Total: ₹ {order.totalAmount}
              </p>
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

      {/* 🔥 CONFIRMATION MODAL */}
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