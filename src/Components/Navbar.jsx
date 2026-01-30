import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaListAlt,
  FaQuoteLeft,
  FaUtensils,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // ✅ Check admin login status
  const checkAdmin = () => {
    const admin = localStorage.getItem("isAdminLoggedIn");
    setIsAdminLoggedIn(admin === "true");
  };

  useEffect(() => {
    checkAdmin();

    // ✅ Listen for login/logout changes
    const handleChange = () => checkAdmin();
    window.addEventListener("admin-login-change", handleChange);

    return () => {
      window.removeEventListener("admin-login-change", handleChange);
    };
  }, []);

  const menuItems = [
    { icon: <FaHome />, text: "Home", link: "/#top" },
    { icon: <FaUtensils />, text: "Services", link: "/#services" },
    { icon: <FaListAlt />, text: "Menu", link: "/#menuPreview" },
    { icon: <FaQuoteLeft />, text: "Reviews", link: "/#reviews" },
  ];

  // ✅ Search functionality (ONLY SCROLL)
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase().trim();

    if (!value) return;

    // ✅ menu
    if (value.includes("menu")) {
      document.getElementById("menuPreview")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // ✅ reviews
    if (value.includes("review") || value.includes("reviews")) {
      document.getElementById("reviews")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // ✅ home
    if (value.includes("home")) {
      document.getElementById("top")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // ✅ services
    if (value.includes("service") || value.includes("services")) {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg rounded-full px-3 sm:px-4 lg:px-8 py-2 md:py-3 w-[95%] md:w-[90%] max-w-7xl flex items-center justify-between backdrop-blur-md border border-white/20 z-50">
      {/* LOGO */}
      <Link to="/#top" className="flex items-center space-x-2 cursor-pointer">
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
          <FaUtensils className="text-xl text-white animate-pulse" />
        </div>

        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
          Aroma <span className="text-orange-800 ml-1">Restaurant</span>
        </h1>
      </Link>

      {/* CENTER NAVIGATION */}
      <div className="hidden md:flex space-x-4 lg:space-x-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="group flex items-center space-x-2 text-black hover:text-orange-700 transition-all duration-300"
          >
            <span className="text-lg transition-transform group-hover:scale-125">
              {item.icon}
            </span>

            <span className="text-base font-semibold group-hover:underline underline-offset-4 decoration-2">
              {item.text}
            </span>
          </Link>
        ))}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center space-x-3">
        {/* ✅ SEARCH (Scroll Feature Added) */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearchChange}
            className="w-28 md:w-32 lg:w-48 border border-gray-300 rounded-full py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:scale-110 transition-transform text-base" />
        </div>

        {/* CART */}
        <Link
          to="/cart"
          className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
        >
          <FaShoppingCart className="text-lg text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* ✅ LOGIN -> ADMIN */}
        <button
          onClick={() => {
            if (isAdminLoggedIn) {
              navigate("/admin");
            } else {
              navigate("/admin-login");
            }
          }}
          className="hidden sm:flex items-center space-x-2 bg-gradient-to-br from-yellow-300 to-orange-400 px-3 lg:px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
        >
          <FaUser className="text-white text-lg" />
          <span className="font-semibold text-white text-sm lg:text-base">
            {isAdminLoggedIn ? "Admin" : "Login"}
          </span>
        </button>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white hover:text-yellow-300 transition-all"
        >
          {isOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-red-500 to-orange-600 rounded-2xl shadow-xl mt-3 mx-4 transition-all duration-300 transform ${
          isOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
        }`}
      >
        <div className="p-4 space-y-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-3 text-white hover:bg-white/20 px-4 py-3 rounded-xl transition-all"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-lg">{item.text}</span>
            </Link>
          ))}

          {/* ✅ MOBILE LOGIN -> ADMIN */}
          <button
            onClick={() => {
              setIsOpen(false);
              if (isAdminLoggedIn) navigate("/admin");
              else navigate("/admin-login");
            }}
            className="w-full sm:hidden flex items-center justify-center space-x-2 bg-gradient-to-br from-yellow-300 to-orange-400 px-4 py-3 rounded-full hover:shadow-lg transition-all"
          >
            <FaUser className="text-white" />
            <span className="font-semibold text-white text-base">
              {isAdminLoggedIn ? "Admin" : "Login"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
