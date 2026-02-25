import React, { useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../styles/checkout.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Checkout = () => {
  const { cart, setCart } = useContext(CartContext);

  const [step, setStep] = useState(1);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // 🔥 NEW PAYMENT STATES
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const [upiId, setUpiId] = useState("");

  // ================= HANDLE ADDRESS CHANGE =================
  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VALIDATE ADDRESS =================
  const validateAddress = () => {
    let newErrors = {};

    if (!address.fullName.trim() || address.fullName.length < 2)
      newErrors.fullName = "Full name must be at least 2 characters";

    if (!/^[0-9]{10}$/.test(address.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!address.addressLine.trim())
      newErrors.addressLine = "Address is required";

    if (!address.city.trim())
      newErrors.city = "City is required";

    if (!address.state.trim())
      newErrors.state = "State is required";

    if (!/^[0-9]{6}$/.test(address.postalCode))
      newErrors.postalCode = "Postal code must be 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= NEXT STEP =================
  const handleNext = (e) => {
    e.preventDefault();
    if (!validateAddress()) return;
    setIsAddressValid(true);
    setStep(2);
  };

  // ================= VALIDATE PAYMENT =================
  const validatePayment = () => {
    let newErrors = {};

    if (!paymentMethod)
      newErrors.payment = "Please select a payment method";

    if (paymentMethod === "card") {
      if (!/^[0-9]{16}$/.test(cardDetails.cardNumber))
        newErrors.cardNumber = "Card number must be 16 digits";

      if (!cardDetails.expiry)
        newErrors.expiry = "Expiry required";

      if (!/^[0-9]{3,4}$/.test(cardDetails.cvv))
        newErrors.cvv = "Invalid CVV";

      if (!cardDetails.name.trim())
        newErrors.name = "Card holder name required";
    }

    if (paymentMethod === "upi") {
      if (!upiId.includes("@"))
        newErrors.upiId = "Valid UPI ID required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {

    if (!validatePayment()) return;

    if (!cart || cart.length === 0) {
      setErrors({ cart: "Cart is empty" });
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

      await axios.post(
        `${BASE_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart([]);
      localStorage.removeItem("cart");

      setOrderPlaced(true);
      setPaymentMethod("");
      setUpiId("");
      setCardDetails({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
      });

      setStep(1);
      setErrors({});
      setIsAddressValid(false);

    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Order failed",
      });
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

        {errors.api && <p className="error">{errors.api}</p>}
        {errors.cart && <p className="error">{errors.cart}</p>}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <form onSubmit={handleNext}>
            <h2 className="checkout-title">Shipping Address</h2>

            <div className="form-grid">
              {Object.keys(address).map((key) => (
                <React.Fragment key={key}>
                  <input
                    type="text"
                    name={key}
                    placeholder={key}
                    value={address[key]}
                    onChange={handleChange}
                    className={key === "addressLine" ? "full-width" : ""}
                  />
                  {errors[key] && (
                    <span className="error">{errors[key]}</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button type="submit" className="checkout-btn">
              Continue to Payment
            </button>
          </form>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div>
            <h2 className="checkout-title">Select Payment Method</h2>
            {errors.payment && <p className="error">{errors.payment}</p>}

            <div className="payment-options">

              <div
                className={`payment-card ${paymentMethod === "card" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                💳 Card
              </div>

              <div
                className={`payment-card ${paymentMethod === "upi" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("upi")}
              >
                📱 UPI
              </div>

              <div
                className={`payment-card ${paymentMethod === "cod" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                💵 Cash On Delivery
              </div>
            </div>

            {/* CARD DETAILS */}
            {paymentMethod === "card" && (
              <div className="payment-details">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                />
                {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}

                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
                {errors.expiry && <span className="error">{errors.expiry}</span>}

                <input
                  type="password"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
                {errors.cvv && <span className="error">{errors.cvv}</span>}

                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, name: e.target.value })
                  }
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
            )}

            {/* UPI DETAILS */}
            {paymentMethod === "upi" && (
              <div className="payment-details">
                <input
                  type="text"
                  placeholder="Enter UPI ID (example@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                {errors.upiId && <span className="error">{errors.upiId}</span>}
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