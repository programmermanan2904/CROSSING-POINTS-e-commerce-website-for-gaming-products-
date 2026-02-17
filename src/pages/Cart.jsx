import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

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

  // 🔥 Backend base URL (change if deployed)
  const BASE_URL = import.meta.env.VITE_API_URL;

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>🛒 Your Cart Is Empty</h2>
        <p>Level Up Your Setup</p>
        <Link to="/shop" className="shop-btn">
          Go To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item._id} className="cart-item">

            {/* ✅ FIXED IMAGE PATH */}
            <img
              src={
                item.image?.startsWith("http")
                  ? item.image
                  : `${BASE_URL}${item.image}`
              }
              alt={item.name}
            />

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
        ))}
      </div>

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
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
