import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

const CLOUD_NAME = "dv251twzd"; // 🔥 Put your real cloud name here

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addItem, decreaseItem, removeItem } =
    useContext(CartContext);

  const subtotal = Array.isArray(cart)
    ? cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
    : 0;

  const shipping = subtotal > 0 ? 199 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  /* ================= EMPTY CART ================= */
  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>🛒 Your Cart Is Empty</h2>
        <p>Level Up Your Setup</p>

        <div className="empty-cart-buttons">
          <Link to="/shop" className="primary-btn">
            Go To Shop
          </Link>

          <Link to="/my-orders" className="primary-btn secondary-style">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  /* ================= CART WITH ITEMS ================= */
  return (
    <div className="cart-container">
      <div className="cart-items">
        {cart.map((item) => {
          const imageUrl = item.image
            ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.image}`
            : null;

          return (
            <div key={item._id} className="cart-item">

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                  }}
                />
              )}

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹ {item.price}</p>

                <div className="quantity-control">
                  <button onClick={() => decreaseItem(item._id)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => addItem(item)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="cart-summary">
        <h2>Order Summary</h2>

        <div className="summary-line">
          <span>Subtotal</span>
          <span>₹ {subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-line">
          <span>Shipping</span>
          <span>₹ {shipping}</span>
        </div>

        <div className="summary-line">
          <span>Tax (5%)</span>
          <span>₹ {tax.toFixed(2)}</span>
        </div>

        <hr />

        <div className="summary-total">
          <span>Total</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>

        <button
          className="primary-btn full-width-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed To Checkout
        </button>

        <Link
          to="/my-orders"
          className="secondary-link-btn"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default Cart;