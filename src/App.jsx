import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

import VendorLayout from "./layouts/VendorLayout";
import Dashboard from "./pages/vendor/VendorDashboard";
import Products from "./pages/vendor/Products";
import VendorOrders from "./pages/vendor/vendorOrders";

import VeltrixWidget from "./components/VeltrixWidget";
import VeltrixPage from "./pages/VeltrixPage";

function App() {
  const location = useLocation();
  const isVendorPage = location.pathname.startsWith("/vendor");
  const isVeltrixPage = location.pathname === "/veltrix";

  return (
    <>
      {/* Hide Navbar on vendor pages */}
      {!isVendorPage && <Navbar />}

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />

        {/* ================= PROTECTED USER ROUTES ================= */}

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

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* ================= VELTRIX FULL PAGE ================= */}
        <Route path="/veltrix" element={<VeltrixPage />} />

        {/* ================= PROTECTED VENDOR ROUTES ================= */}

        <Route
          path="/vendor"
          element={
            <ProtectedRoute role="vendor">
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          {/* Auto redirect /vendor → /vendor/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<VendorOrders />} />

          {/* Safety redirect for old analytics link */}
          <Route
            path="analytics"
            element={<Navigate to="/vendor/dashboard" replace />}
          />
        </Route>

      </Routes>

      {/* Hide Footer on vendor pages */}
      {!isVendorPage && <Footer />}

      {/* Global Veltrix (hidden on vendor + full page) */}
      {!isVendorPage && !isVeltrixPage && <VeltrixWidget />}
    </>
  );
}

export default App;
