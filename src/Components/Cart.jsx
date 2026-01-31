import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2"; // ✅ Added

export default function Cart() {
  const {
    cart,
    cartCount,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  } = useCart();

  // ✅ Status Check States
  const [checkName, setCheckName] = useState("");
  const [checkTable, setCheckTable] = useState("");
  const [statusResult, setStatusResult] = useState(null);

  // ✅ Total qty
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  }, [cart]);

  // ✅ SweetAlert helpers
  const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1300,
    timerProgressBar: true,
  });

  const showSuccess = (msg) => {
    toast.fire({ icon: "success", title: msg });
  };

  const showInfo = (msg) => {
    toast.fire({ icon: "info", title: msg });
  };

  const showError = (msg) => {
    toast.fire({ icon: "error", title: msg });
  };

  // ✅ Check order status (from localStorage)
  const handleCheckStatus = () => {
    if (!checkName.trim() || !checkTable.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details ❌",
        text: "Please enter Customer Name and Table No",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // ✅ Find latest matching order (same name + table)
    const matchedOrders = orders.filter(
      (o) =>
        String(o.name).toLowerCase().trim() ===
          String(checkName).toLowerCase().trim() &&
        String(o.tableNo).toLowerCase().trim() ===
          String(checkTable).toLowerCase().trim()
    );

    if (matchedOrders.length === 0) {
      setStatusResult({
        found: false,
        message: "No order found ❌",
      });

      showError("No order found ❌");
      return;
    }

    // ✅ Latest order = last one
    const latest = matchedOrders[matchedOrders.length - 1];

    // ✅ Get status from orderStep if status is not Completed
    let displayStatus = latest.status;
    if (latest.status !== "Completed" && latest.orderStep) {
      if (latest.orderStep === "preparing") {
        displayStatus = "Preparing 👨‍🍳";
      } else if (latest.orderStep === "onTable2Min") {
        displayStatus = "2 min Order is on Table ⏱️✅";
      }
    }

    setStatusResult({
      found: true,
      name: latest.name,
      tableNo: latest.tableNo,
      status: displayStatus, // Use the calculated display status
      time: latest.time,
      orderId: latest.id,
      rawStatus: latest.status, // Keep original status
      orderStep: latest.orderStep, // Keep orderStep
    });

    showSuccess(`Status: ${displayStatus} ✅`);
  };

  // ✅ Framer Motion Variants
  const listVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const statusVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  // ✅ Confirm Remove
  const handleRemoveItem = async (itemName) => {
    const res = await Swal.fire({
      title: "Remove item? 🗑️",
      text: `Do you want to remove ${itemName} from cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#111827",
    });

    if (res.isConfirmed) {
      removeFromCart(itemName);
      showSuccess("Item removed ✅");
    } else {
      showInfo("Cancelled ❌");
    }
  };

  // ✅ Confirm Clear Cart
  const handleClearCart = async () => {
    const res = await Swal.fire({
      title: "Clear Cart? 🧹",
      text: "All items will be removed from cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#111827",
      cancelButtonColor: "#dc2626",
    });

    if (res.isConfirmed) {
      clearCart();
      showSuccess("Cart cleared ✅");
    } else {
      showInfo("Cancelled ❌");
    }
  };

  return (
    <div className="bg-gray-50 pt-28 px-4 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* ✅ Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white shadow rounded-2xl p-5 md:p-6 mb-6 flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            {/* ✅ Normal Heading (No Typing Effect) */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Cart 🛒
            </h1>

            <p className="text-gray-600 mt-1">
              Total Items: <span className="font-bold">{cartCount}</span>
            </p>

            {cart.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                Qty Total: <span className="font-bold">{totalItems}</span>
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              to="/menu"
              className="px-5 py-2 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 transition"
            >
              Back to Menu
            </Link>

            {cart.length > 0 && (
              <button
                onClick={handleClearCart} // ✅ SweetAlert
                className="px-5 py-2 rounded-xl font-bold text-white bg-black hover:bg-gray-900 transition"
              >
                Clear Cart
              </button>
            )}
          </div>
        </motion.div>

        {/* ✅ Empty cart */}
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow rounded-2xl p-6 text-center font-semibold text-gray-600"
          >
            Cart is Empty ❌
          </motion.div>
        ) : (
          <>
            {/* ✅ Cart Items with Stagger Animation */}
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <AnimatePresence>
                {cart.map((c) => (
                  <motion.div
                    key={c.name}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="bg-white shadow rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">
                        {c.name}
                      </div>
                      <div className="text-sm text-gray-500">{c.category}</div>
                      <div className="text-red-600 font-bold mt-1">
                        {c.priceText}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => {
                          decreaseQty(c.name);
                          showInfo("Quantity decreased ➖");
                        }}
                        className="px-4 py-2 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 transition"
                      >
                        -
                      </motion.button>

                      <motion.div
                        key={c.qty}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ duration: 0.25 }}
                        className="font-bold text-gray-900 min-w-[70px] text-center"
                      >
                        Qty: {c.qty}
                      </motion.div>

                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => {
                          increaseQty(c.name);
                          showSuccess("Quantity increased ➕");
                        }}
                        className="px-4 py-2 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 transition"
                      >
                        +
                      </motion.button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleRemoveItem(c.name)} // ✅ SweetAlert confirm
                      className="px-5 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition"
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ✅ Order Now Button */}
            <div className="mt-8 flex justify-center">
              <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}>
                <Link
                  to="/checkout"
                  className="px-10 py-4 rounded-2xl font-extrabold text-white text-lg
                           bg-gradient-to-r from-green-700 to-green-500
                           shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                           transition-all duration-200"
                >
                  Order Now ✅
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {/* ✅ ✅ Check Order Status at END */}
        <div className="bg-white shadow rounded-2xl p-5 md:p-6 mt-10 border">
          {/* ✅ Normal Heading (No Typing Effect) */}
          <h2 className="text-xl font-extrabold text-gray-900">
            Check Order Status ✅
          </h2>

          <p className="text-gray-600 text-sm mt-1">
            Enter same Name + Table No you used while confirming order
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={checkName}
              onChange={(e) => setCheckName(e.target.value)}
              placeholder="Customer Name"
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              value={checkTable}
              onChange={(e) => setCheckTable(e.target.value)}
              placeholder="Table No"
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckStatus}
              className="px-6 py-3 rounded-xl font-bold text-white
                         bg-gradient-to-r from-orange-600 to-red-500
                         shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95
                         transition-all duration-200"
            >
              Check Status
            </motion.button>
          </div>

          {/* ✅ Status Result Animated */}
          <AnimatePresence>
            {statusResult && (
              <motion.div
                key="statusResult"
                variants={statusVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-4"
              >
                {!statusResult.found ? (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold">
                    {statusResult.message}
                  </div>
                ) : (
                  <div
                    className={`p-4 rounded-xl border font-bold ${
                      statusResult.status === "Completed" || statusResult.rawStatus === "Completed"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : statusResult.status.includes("2 min") || statusResult.orderStep === "onTable2Min"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : statusResult.status.includes("Preparing") || statusResult.orderStep === "preparing"
                        ? "bg-orange-50 border-orange-200 text-orange-700"
                        : "bg-orange-50 border-orange-200 text-orange-700"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">Status:</span>
                        <span className="text-lg">{statusResult.status} ✅</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-semibold text-gray-700 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">👤 Customer:</span>
                          <span className="font-bold">{statusResult.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">🍽️ Table No:</span>
                          <span className="font-bold">{statusResult.tableNo}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">🆔 Order ID:</span>
                          <span className="font-bold">{statusResult.orderId}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">🕒 Time:</span>
                          <span className="font-bold">{statusResult.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}