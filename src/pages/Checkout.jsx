import React, { useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../styles/checkout.css";

const Checkout = () => {
  const { cart, setCart } = useContext(CartContext);

  const [step, setStep] = useState(1);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();

    const { fullName, phone, addressLine, city, state, postalCode } = address;

    if (
      fullName &&
      phone &&
      addressLine &&
      city &&
      state &&
      postalCode
    ) {
      setIsAddressValid(true);
      setStep(2);
    } else {
      alert("Please fill all address details");
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order Response:", response.data);

      // Clear cart
      setCart([]);
      localStorage.removeItem("cart");

      // Show success
      setOrderPlaced(true);

      // Reset state
      setPaymentMethod("");
      setIsAddressValid(false);
      setStep(1);

      setAddress({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        postalCode: "",
      });

    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      alert("Order failed. Please try again.");
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-box">

        {orderPlaced && (
          <div className="order-success">
            🎉 Order Placed Successfully!
          </div>
        )}

        {/* Step Navigation */}
        <div className="checkout-steps">
          <div
            className={`step ${step === 1 ? "active" : ""}`}
            onClick={() => setStep(1)}
          >
            1. Address
          </div>

          <div
            className={`step ${step === 2 ? "active" : ""} ${
              !isAddressValid ? "disabled" : ""
            }`}
            onClick={() => {
              if (isAddressValid) setStep(2);
            }}
          >
            2. Payment
          </div>
        </div>

        {/* Address Step */}
        {step === 1 && (
          <form onSubmit={handleNext}>
            <h2 className="checkout-title">Shipping Address</h2>

            <div className="form-grid">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={address.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="addressLine"
                placeholder="Address"
                value={address.addressLine}
                onChange={handleChange}
                required
                className="full-width"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="checkout-btn">
              Continue to Payment
            </button>
          </form>
        )}

        {/* Payment Step */}
        {step === 2 && (
  <div>
    <h2 className="checkout-title">Select Payment Method</h2>

    <div className="payment-options">
      <div
        className={`payment-card ${
          paymentMethod === "card" ? "selected" : ""
        }`}
        onClick={() => setPaymentMethod("card")}
      >
        💳 Credit / Debit Card
      </div>

      <div
        className={`payment-card ${
          paymentMethod === "upi" ? "selected" : ""
        }`}
        onClick={() => setPaymentMethod("upi")}
      >
        📱 UPI
      </div>

      <div
        className={`payment-card ${
          paymentMethod === "cod" ? "selected" : ""
        }`}
        onClick={() => setPaymentMethod("cod")}
      >
        💵 Cash On Delivery
      </div>
    </div>

    {/* Card Form */}
    {paymentMethod === "card" && (
      <div className="payment-form">
        <input type="text" placeholder="Card Number" required />
        <input type="text" placeholder="Name on Card" required />
        <div className="card-row">
          <input type="text" placeholder="Expiry (MM/YY)" required />
          <input type="text" placeholder="CVV" required />
        </div>
      </div>
    )}

    {/* UPI Form */}
    {paymentMethod === "upi" && (
      <div className="payment-form">
        <input type="text" placeholder="Enter UPI ID (example@upi)" required />
      </div>
    )}

    {/* COD Info */}
    {paymentMethod === "cod" && (
      <div className="payment-form">
        <p style={{ color: "#aaa" }}>
          Pay in cash when your order is delivered.
        </p>
      </div>
    )}

    <button
      className="checkout-btn"
      style={{ marginTop: "25px" }}
      onClick={handlePlaceOrder}
    >
      Place Order
    </button>

    <button
      className="back-btn"
      onClick={() => setStep(1)}
    >
      ← Back to Address
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default Checkout;
