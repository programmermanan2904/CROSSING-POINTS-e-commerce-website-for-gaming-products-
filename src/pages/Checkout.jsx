import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/checkout.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Checkout = () => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useAuth();   // ✅ get token from AuthContext
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const [upiId, setUpiId] = useState("");

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    let newErrors = {};

    if (!address.fullName.trim()) newErrors.fullName = "Full name required";
    if (!/^[0-9]{10}$/.test(address.phone)) newErrors.phone = "Valid phone required";
    if (!address.addressLine.trim()) newErrors.addressLine = "Address required";
    if (!address.city.trim()) newErrors.city = "City required";
    if (!address.state.trim()) newErrors.state = "State required";
    if (!/^[0-9]{6}$/.test(address.postalCode)) newErrors.postalCode = "Valid postal code required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    let newErrors = {};

    if (!paymentMethod) newErrors.payment = "Select payment method";

    if (paymentMethod === "card") {
      if (!/^[0-9]{16}$/.test(cardDetails.cardNumber))
        newErrors.cardNumber = "Card number must be 16 digits";
      if (!cardDetails.expiry) newErrors.expiry = "Expiry required";
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

  const handlePlaceOrder = async () => {
  if (!validatePayment()) return;

  if (!cart || cart.length === 0) {
    setErrors({ cart: "Cart is empty" });
    return;
  }

  try {
    const orderData = {
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: address,
      paymentMethod,
    };

    await axios.post(`${BASE_URL}/api/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });

    setCart([]);
    localStorage.removeItem("cart");

    // ✅ ONLY CHANGE HERE
    navigate("/my-orders", {
      replace: true,
      state: { orderSuccess: true },
    });

  } catch (error) {
    setErrors({
      api: error.response?.data?.message || "Order failed",
    });
  }
};

  return (
    <div className="checkout-wrapper">
      <div className="checkout-box">

        {errors.api && <p className="error">{errors.api}</p>}
        {errors.cart && <p className="error">{errors.cart}</p>}

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validateAddress()) setStep(2);
            }}
          >
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
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;