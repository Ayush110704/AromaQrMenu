import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Bill from "./Bill.jsx";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [billOrderId, setBillOrderId] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);

  const loadOrders = () => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(all.reverse()); // latest first
  };

  useEffect(() => {
    // Set login time when component mounts
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString();
    setLoginTime(`${formattedDate} ${formattedTime}`);
    
    loadOrders();
    const onStorage = () => loadOrders();
    window.addEventListener("storage", onStorage);
    
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    // Set logout time before logging out
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString();
    setLogoutTime(`${formattedDate} ${formattedTime}`);
    
    // Show logout confirmation with times
    Swal.fire({
      title: "Logout?",
      html: `<div class="text-left">
              <p class="mb-2"><strong>Login Time:</strong> ${loginTime}</p>
              <p class="mb-4"><strong>Logout Time:</strong> ${formattedDate} ${formattedTime}</p>
              <p>Are you sure you want to logout?</p>
            </div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("adminLoggedIn");
        navigate("/admin-login");
      }
    });
  };

  const normalize = (val) => String(val || "").toLowerCase().trim();

  const pendingCount = useMemo(() => {
    return orders.filter((o) => normalize(o.status) !== "completed").length;
  }, [orders]);

  const completedCount = useMemo(() => {
    return orders.filter((o) => normalize(o.status) === "completed").length;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (filterStatus === "pending")
      list = list.filter((o) => normalize(o.status) !== "completed");
    if (filterStatus === "completed")
      list = list.filter((o) => normalize(o.status) === "completed");

    if (searchText.trim()) {
      const s = normalize(searchText);
      list = list.filter((o) => {
        return (
          normalize(o.id).includes(s) ||
          normalize(o.name).includes(s) ||
          normalize(o.tableNo).includes(s) ||
          normalize(o.contact).includes(s)
        );
      });
    }

    return list;
  }, [orders, filterStatus, searchText]);

  // ✅ open order -> remove NEW badge
  const openOrder = (orderId) => {
    setOpenOrderId(orderId);

    const all = JSON.parse(localStorage.getItem("orders")) || [];
    const updated = all.map((o) =>
      o.id === orderId ? { ...o, hasNewItems: false } : o
    );

    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated.reverse());
  };

  const closeOrder = () => setOpenOrderId(null);

  const activeOrder = useMemo(() => {
    return filteredOrders.find((o) => o.id === openOrderId) || null;
  }, [filteredOrders, openOrderId]);

  // ✅ only latest update show in Recently Added
  const getLatestUpdate = (order) => {
    const arr = Array.isArray(order?.updates) ? order.updates : [];
    if (arr.length === 0) return null;
    return arr[arr.length - 1];
  };

  // ✅ update orderStep (Preparing / OnTable2Min)
  const updateOrderStep = (orderId, step) => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = all.map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStep: step, // "preparing" | "onTable2Min"
            lastUpdated: new Date().toLocaleString(),
          }
        : o
    );

    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated.reverse());

    Swal.fire({
      icon: "success",
      title: "Updated ✅",
      text:
        step === "preparing"
          ? "Order marked as Preparing 👨‍🍳"
          : "2 min Order is on Table ⏱️✅",
      confirmButtonColor: "#16a34a",
    });
  };

  const markCompleted = (orderId) => {
    Swal.fire({
      title: "Mark as Completed? ✅",
      text: "This table will become free for new orders.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Complete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
    }).then((res) => {
      if (!res.isConfirmed) return;

      const all = JSON.parse(localStorage.getItem("orders")) || [];
      const updated = all.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Completed",
              hasNewItems: false,
              orderStep: "completed",
              lastUpdated: new Date().toLocaleString(),
            }
          : o
      );

      localStorage.setItem("orders", JSON.stringify(updated));
      setOrders(updated.reverse());
      setOpenOrderId(null);

      Swal.fire({
        icon: "success",
        title: "Completed ✅",
        text: "Order marked as completed!",
        confirmButtonColor: "#16a34a",
      });
    });
  };

  const deleteOrder = (orderId) => {
    Swal.fire({
      title: "Delete Order? ❌",
      text: "This will remove the order permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    }).then((res) => {
      if (!res.isConfirmed) return;

      const all = JSON.parse(localStorage.getItem("orders")) || [];
      const updated = all.filter((o) => o.id !== orderId);

      localStorage.setItem("orders", JSON.stringify(updated));
      setOrders(updated.reverse());
      setOpenOrderId(null);

      Swal.fire({
        icon: "success",
        title: "Deleted ✅",
        text: "Order deleted successfully!",
        confirmButtonColor: "#16a34a",
      });
    });
  };

  const openBill = (orderId) => setBillOrderId(orderId);
  const closeBill = () => setBillOrderId(null);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Header */}
        <div className="bg-white shadow rounded-2xl p-5 md:p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Admin Panel 👨‍🍳
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <p className="text-sm font-semibold text-gray-500">
                Pending:{" "}
                <span className="text-orange-600 font-extrabold">
                  {pendingCount}
                </span>{" "}
                • Completed:{" "}
                <span className="text-green-700 font-extrabold">
                  {completedCount}
                </span>
              </p>
              
              {loginTime && (
                <p className="text-sm font-semibold text-gray-500">
                  Login Time:{" "}
                  <span className="text-blue-600 font-extrabold">
                    {loginTime}
                  </span>
                </p>
              )}
              
              {logoutTime && (
                <p className="text-sm font-semibold text-gray-500">
                  Last Logout:{" "}
                  <span className="text-purple-600 font-extrabold">
                    {logoutTime}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout 🚪
            </button>
          </div>
        </div>

        {/* ✅ Filters + Search */}
        <div className="mt-5 bg-white shadow rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filterStatus === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filterStatus === "pending"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                filterStatus === "completed"
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search table / name / contact / order id..."
              className="w-full md:w-[340px] px-4 py-2 rounded-xl border border-gray-200 outline-none font-semibold"
            />

            <button
              onClick={loadOrders}
              className="px-4 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Refresh 🔄
            </button>
          </div>
        </div>

        {/* ✅ Orders Cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-white shadow rounded-2xl p-6 text-center font-bold text-gray-600 md:col-span-2 lg:col-span-3">
              No orders found ❌
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isCompleted = normalize(order.status) === "completed";
              const showNew = order.hasNewItems && !isCompleted;

              return (
                <div
                  key={order.id}
                  onClick={() => openOrder(order.id)}
                  className={`bg-white shadow rounded-2xl p-5 border cursor-pointer transition hover:shadow-lg ${
                    isCompleted ? "border-green-200" : "border-orange-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900">
                        Table {order.tableNo} 🍽️
                      </h2>
                      <p className="text-xs font-bold text-gray-500 mt-1">
                        {order.id}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {showNew && (
                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold animate-pulse">
                          NEW ✨
                        </span>
                      )}

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          isCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {isCompleted ? "Completed ✅" : "Pending ⏳"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-sm font-semibold text-gray-700 space-y-1">
                    <p>
                      👤 <span className="font-bold">{order.name}</span>
                    </p>
                    <p>📞 {order.contact}</p>
                    <p>👥 Guests: {order.guests}</p>
                    <p className="text-xs text-gray-500 font-bold mt-1">
                      🕒 {order.lastUpdated || order.time}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <p className="text-sm font-bold text-gray-500">
                      Items:{" "}
                      <span className="text-gray-900">
                        {order.items?.length || 0}
                      </span>
                    </p>
                    <p className="text-lg font-extrabold text-green-700">
                      ₹{order.totalAmount || 0}/-
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBill(order.id);
                      }}
                      className="w-full py-2 rounded-xl font-extrabold bg-black text-white hover:bg-gray-900 transition"
                    >
                      Bill 🧾
                    </button>

                    {!isCompleted ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markCompleted(order.id);
                        }}
                        className="w-full py-2 rounded-xl font-extrabold bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Complete ✅
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOrder(order.id);
                        }}
                        className="w-full py-2 rounded-xl font-extrabold bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete 🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ✅ Order Details Modal */}
        {activeOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-6 z-50">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative">
              {/* ✅ Header */}
              <div className="p-5 border-b flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Table {activeOrder.tableNo} 🍽️
                  </h2>
                  <p className="text-sm font-bold text-gray-500 mt-1">
                    {activeOrder.id}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-extrabold ${
                      normalize(activeOrder.status) === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {normalize(activeOrder.status) === "completed"
                      ? "Completed ✅"
                      : "Pending ⏳"}
                  </span>

                  <button
                    onClick={closeOrder}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-extrabold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* ✅ Body scroll only inside */}
              <div className="p-5 max-h-[78vh] overflow-y-auto">
                <div className="grid gap-2 text-sm font-semibold text-gray-700">
                  <p>
                    👤 Customer:{" "}
                    <span className="font-extrabold">{activeOrder.name}</span>
                  </p>
                  <p>📞 Contact: {activeOrder.contact}</p>
                  <p>👥 Guests: {activeOrder.guests}</p>
                  <p className="text-xs text-gray-500 font-bold">
                    🕒 {activeOrder.lastUpdated || activeOrder.time}
                  </p>
                </div>

                {/* ✅ Status Display for Admin + Customer use */}
                {activeOrder.orderStep && normalize(activeOrder.status) !== "completed" && (
                  <div className="mt-4">
                    <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold">
                      Status:{" "}
                      {activeOrder.orderStep === "preparing"
                        ? "Preparing 👨‍🍳"
                        : activeOrder.orderStep === "onTable2Min"
                        ? "2 min Order is on Table ⏱️✅"
                        : activeOrder.orderStep}
                    </span>
                  </div>
                )}

                {/* ✅ Recently Added Items (ONLY Latest) */}
                {getLatestUpdate(activeOrder) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-extrabold text-gray-900">
                      Recently Added Items 🆕
                    </h3>

                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                      <p className="text-xs font-extrabold text-gray-600">
                        ⏰ {getLatestUpdate(activeOrder)?.time}
                      </p>

                      <div className="mt-2 space-y-2">
                        {(getLatestUpdate(activeOrder)?.addedItems || []).map(
                          (it, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-white rounded-xl p-2 border"
                            >
                              <div>
                                <p className="font-extrabold text-gray-900">
                                  {it.name}
                                </p>
                                <p className="text-xs font-bold text-gray-500">
                                  {it.category || "Food"} • Qty: {it.qty}
                                </p>
                              </div>

                              <p className="font-extrabold text-green-700">
                                ₹{it.itemTotal}/-
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      <p className="mt-3 text-sm font-extrabold text-gray-900 flex justify-between">
                        <span>Added Total</span>
                        <span className="text-green-700">
                          ₹{getLatestUpdate(activeOrder)?.addedTotal || 0}/-
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* ✅ Full Bill Items */}
                <div className="mt-6">
                  <h3 className="text-lg font-extrabold text-gray-900">
                    Full Bill Items 🍲
                  </h3>

                  <div className="mt-3 space-y-3">
                    {(activeOrder.items || []).map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border rounded-2xl p-3 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-extrabold text-gray-900">
                            {it.name}
                          </p>
                          <p className="text-xs font-bold text-gray-500">
                            {it.category || "Food"} • Qty: {it.qty}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-600">
                            ₹{it.price} × {it.qty}
                          </p>
                          <p className="text-lg font-extrabold text-red-600">
                            ₹{it.itemTotal}/-
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-4 flex items-center justify-between">
                    <p className="text-lg font-extrabold text-gray-900">
                      Total Amount
                    </p>
                    <p className="text-lg font-extrabold text-green-700">
                      ₹{activeOrder.totalAmount || 0}/-
                    </p>
                  </div>
                </div>

                {/* ✅ Actions */}
                <div className="mt-6 flex gap-3 flex-wrap">
                  <button
                    onClick={() => openBill(activeOrder.id)}
                    className="px-5 py-3 rounded-2xl font-extrabold bg-black text-white hover:bg-gray-900 transition"
                  >
                    Print Bill 🧾
                  </button>

                  {normalize(activeOrder.status) !== "completed" && (
                    <>
                      <button
                        onClick={() =>
                          updateOrderStep(activeOrder.id, "preparing")
                        }
                        className="px-5 py-3 rounded-2xl font-extrabold bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Preparing 👨‍🍳
                      </button>

                      {/* ✅ Button name only: 2 min */}
                      <button
                        onClick={() =>
                          updateOrderStep(activeOrder.id, "onTable2Min")
                        }
                        className="px-5 py-3 rounded-2xl font-extrabold bg-purple-600 text-white hover:bg-purple-700 transition"
                      >
                        2 min
                      </button>
                    </>
                  )}

                  {normalize(activeOrder.status) !== "completed" ? (
                    <button
                      onClick={() => markCompleted(activeOrder.id)}
                      className="px-5 py-3 rounded-2xl font-extrabold bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Mark Completed ✅
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteOrder(activeOrder.id)}
                      className="px-5 py-3 rounded-2xl font-extrabold bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete Order 🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Bill Modal */}
        {billOrderId && <Bill orderId={billOrderId} onClose={closeBill} />}
      </div>
    </div>
  );
}