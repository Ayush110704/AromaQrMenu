import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Added

export default function AdminLogin() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const ADMIN_ID = "Ayush";
    const ADMIN_PASS = "1234";

    if (adminId === ADMIN_ID && adminPass === ADMIN_PASS) {
      localStorage.setItem("isAdminLoggedIn", "true");

      // ✅ Notify navbar (custom event)
      window.dispatchEvent(new Event("admin-login-change"));

      await Swal.fire({
        icon: "success",
        title: "Admin Login Successful ✅",
        text: "Welcome Admin!",
        timer: 1400,
        showConfirmButton: false,
        position: "top",
      });

      navigate("/admin");
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: "Wrong Admin ID or Password",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#f97316",
      });
    }
  };

  return (
    <div className="bg-gray-50 pt-28 px-4 pb-20 min-h-screen">
      <div className="max-w-lg mx-auto">
        <div className="bg-white shadow rounded-2xl p-6 md:p-7 border">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admin Login 🔐
          </h1>
          <p className="text-gray-600 mt-1">
            Only admin can access orders panel
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="font-semibold text-gray-800">Admin ID</label>
              <input
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter admin id"
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-800">Password</label>
              <input
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Enter password"
                type="password"
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 rounded-2xl font-extrabold text-white text-lg
                         bg-gradient-to-r from-black to-gray-800
                         shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95
                         transition-all duration-200"
            >
              Login ✅
            </button>

            <div className="text-center">
              <Link
                to="/menu"
                className="text-orange-600 font-bold hover:underline"
              >
                Back to Menu 🍽️
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
