import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Home from "./Components/Home.jsx";
import Cart from "./Components/Cart.jsx";
import FullMenu from "./Components/FullMenu.jsx";
import Checkout from "./Components/CheckOut.jsx";
import AdminLogin from "./Components/AdminLogin.jsx";
import AdminPanel from "./Components/AdminPanel.jsx";

import Loader from "./Components/loder.jsx";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // ✅ 2.5 sec loader
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<FullMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* ✅ Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
