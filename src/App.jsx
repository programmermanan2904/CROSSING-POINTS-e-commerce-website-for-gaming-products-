import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Dashboard from "./pages/vendor/DashBoard";
import Products from "./pages/vendor/Products";
import VendorOrders from "./pages/vendor/VendorOrders";
import Checkout from "./pages/Checkout";
import VendorOrders from "./pages/vendor/VendorOrders";

function App() {
  const location = useLocation();
  const isVendorPage = location.pathname.startsWith("/vendor");

  return (
    <>
      {!isVendorPage && <Navbar />}

      <Routes>

        {/* ===========================
            PUBLIC ROUTES
        ============================ */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />

        {/* ===========================
            PROTECTED USER ROUTES
        ============================ */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ===========================
            PROTECTED VENDOR ROUTES
        ============================ */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute role="vendor">
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<VendorOrders />} />
        </Route>

      </Routes>

      {!isVendorPage && <Footer />}
    </>
  );
}

export default App;
