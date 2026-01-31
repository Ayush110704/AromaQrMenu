import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import Swal from "sweetalert2";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [customGuests, setCustomGuests] = useState("");
  const [contact, setContact] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const isCartEmpty = cart.length === 0;

  const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1400,
    timerProgressBar: true,
  });

  const showSuccessToast = (msg) => toast.fire({ icon: "success", title: msg });

  const getItemPriceNumber = (item) => {
    if (typeof item.price === "number") return item.price;
    if (typeof item.full === "number") return item.full;
    if (typeof item.half === "number") return item.half;
    return 0;
  };

  // ✅ Only current cart total (new items)
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, c) => {
      const price = getItemPriceNumber(c);
      const qty = c.qty || 1;
      return sum + price * qty;
    }, 0);
  }, [cart]);

  const generateOrderId = () => {
    const lastNumber = Number(localStorage.getItem("lastOrderNumber") || "1000");
    const nextNumber = lastNumber + 1;
    localStorage.setItem("lastOrderNumber", String(nextNumber));
    return `AROMA-${nextNumber}`;
  };

  const finalGuests = guests === "custom" ? customGuests : guests;

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!contact.trim()) newErrors.contact = "Contact is required";
    if (!tableNo.trim()) newErrors.tableNo = "Table No is required";

    if (!guests.trim()) {
      newErrors.guests = "Guests is required";
    } else if (guests === "custom" && !customGuests.trim()) {
      newErrors.customGuests = "Enter guests count";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all required fields ❌",
        text: "Some details are missing. Check form errors below.",
        confirmButtonColor: "#f97316",
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const cartToItems = (cartArr = []) => {
    return cartArr.map((c) => ({
      name: c.name,
      qty: c.qty || 1,
      category: c.category,
      priceText: c.priceText,
      price: getItemPriceNumber(c),
      itemTotal: getItemPriceNumber(c) * (c.qty || 1),
    }));
  };

  const mergeItems = (existingItems = [], addedCart = []) => {
    const merged = [...existingItems];
    const addedItems = cartToItems(addedCart);

    addedItems.forEach((c) => {
      const foundIndex = merged.findIndex(
        (it) => it.name === c.name && Number(it.price) === Number(c.price)
      );

      if (foundIndex !== -1) {
        merged[foundIndex].qty += c.qty;
        merged[foundIndex].itemTotal =
          merged[foundIndex].qty * merged[foundIndex].price;
      } else {
        merged.push(c);
      }
    });

    return merged;
  };

  const calculateTotalFromItems = (items = []) => {
    return items.reduce((sum, it) => sum + (Number(it.itemTotal) || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCartEmpty) {
      Swal.fire({
        icon: "error",
        title: "Cart is empty ❌",
        text: "Please add items before placing order",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

      // ✅ Running order on same table (not completed)
      const runningOnTable = allOrders.find(
        (o) =>
          String(o.tableNo).trim() === String(tableNo).trim() &&
          String(o.status || "").toLowerCase().trim() !== "completed"
      );

      // ✅ table engaged
      if (runningOnTable) {
        // ✅ Check if it's the SAME CUSTOMER by checking ALL THREE: name, contact, AND tableNo
        const sameName = 
          String(runningOnTable.name || "").trim().toLowerCase() === 
          name.trim().toLowerCase();
        
        const sameContact = 
          String(runningOnTable.contact || "").trim() === 
          contact.trim();
        
        const sameTableNo =
          String(runningOnTable.tableNo || "").trim() ===
          tableNo.trim();

        // ✅ same customer => add items (must match ALL THREE: name, contact, AND tableNo)
        if (sameName && sameContact && sameTableNo) {
          const index = allOrders.findIndex((o) => o.id === runningOnTable.id);

          const mergedItems = mergeItems(runningOnTable.items || [], cart);
          const updatedTotal = calculateTotalFromItems(mergedItems);

          const addedItems = cartToItems(cart);

          allOrders[index] = {
            ...runningOnTable,
            guests: String(finalGuests).trim(),
            items: mergedItems,
            totalAmount: updatedTotal,

            // ✅ history of added items
            updates: [
              ...(runningOnTable.updates || []),
              {
                time: new Date().toLocaleString(),
                addedItems,
                addedTotal: totalAmount,
              },
            ],

            // ✅ Admin flags
            hasNewItems: true,
            delivered: false, // ✅ new items added => not delivered yet
            lastUpdated: new Date().toLocaleString(),
          };

          localStorage.setItem("orders", JSON.stringify(allOrders));

          setLoading(false);

          Swal.fire({
            icon: "success",
            title: "Items Added to Same Bill ✅",
            html: `<b>Order ID:</b> ${runningOnTable.id}<br/>
                   <b>Added Items Total:</b> ₹${totalAmount}/-`,
            confirmButtonText: "OK",
            confirmButtonColor: "#16a34a",
          }).then(() => {
            clearCart();
            navigate("/menu");
            showSuccessToast("More items added ✅");
          });

          return;
        }

        // ❌ NOT the same customer (different name OR different contact OR different table)
        setLoading(false);
        Swal.fire({
          icon: "warning",
          title: "Table Engaged 🔴",
          text: `Table ${tableNo} already has a running order. Please wait until it is completed.`,
          confirmButtonColor: "#f97316",
        });
        return;
      }

      // ✅ Create new order
      const orderId = generateOrderId();

      const newOrderItems = cartToItems(cart);

      const newOrder = {
        id: orderId,
        name: name.trim(),
        guests: String(finalGuests).trim(),
        contact: contact.trim(),
        tableNo: tableNo.trim(),
        items: newOrderItems,
        status: "Pending",
        time: new Date().toLocaleString(),
        totalAmount: totalAmount,

        // ✅ updates history first entry
        updates: [
          {
            time: new Date().toLocaleString(),
            addedItems: newOrderItems,
            addedTotal: totalAmount,
          },
        ],

        hasNewItems: true,
        delivered: false,
        lastUpdated: new Date().toLocaleString(),
      };

      localStorage.setItem("orders", JSON.stringify([...allOrders, newOrder]));

      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Order Successful ✅",
        html: `<b>Order ID:</b> ${orderId}<br/><b>Total:</b> ₹${totalAmount}/-`,
        confirmButtonText: "OK",
        confirmButtonColor: "#16a34a",
      }).then(() => {
        clearCart();
        navigate("/menu");
        showSuccessToast("Thank you! Order placed ✅");
      });
    }, 500);
  };

  return (
    <div className="bg-gray-50 pt-28 px-4 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* ✅ Header */}
        <div className="bg-white shadow rounded-2xl p-5 md:p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Checkout ✅
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              to="/cart"
              className="px-5 py-2 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 transition"
            >
              Back to Cart
            </Link>
          </div>
        </div>

        {isCartEmpty ? (
          <div className="bg-white shadow rounded-2xl p-6 text-center font-semibold text-gray-600">
            Cart is Empty ❌ <br />
            <Link
              to="/menu"
              className="inline-block mt-4 px-6 py-2 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 transition"
            >
              Go To Menu 🍽️
            </Link>
          </div>
        ) : (
          <>
            {/* ✅ Only new cart items shown */}
            <div className="bg-white shadow rounded-2xl p-5 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Order Summary (New Items)
              </h2>

              <div className="mt-4 space-y-3">
                {cart.map((c, idx) => {
                  const price = getItemPriceNumber(c);
                  const qty = c.qty || 1;
                  const itemTotal = price * qty;

                  return (
                    <div key={idx} className="bg-gray-50 border rounded-xl p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-gray-900">{c.name}</div>
                          <div className="text-sm text-gray-500">
                            {c.category} • Qty: {qty}
                          </div>
                          <div className="text-sm font-semibold text-gray-700 mt-1">
                            Price: ₹{price}/-
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-600">
                            ₹{price} × {qty}
                          </div>
                          <div className="text-lg font-extrabold text-red-600">
                            ₹{itemTotal}/-
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t pt-4 flex items-center justify-between">
                <p className="text-lg font-extrabold text-gray-900">
                  Added Items Total
                </p>
                <p className="text-lg font-extrabold text-green-700">
                  ₹{totalAmount}/-
                </p>
              </div>

              <p className="text-xs mt-3 text-gray-500 font-semibold">
                ✅ Note: Only newly added items are shown here.
              </p>
            </div>

            {/* ✅ Customer Details */}
            <div className="bg-white shadow-xl rounded-3xl p-5 md:p-7 border border-gray-100">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                  Customer Details ✨
                </h2>
                <p className="text-sm font-semibold text-gray-500">
                  * All fields mandatory
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Customer Name <span className="text-red-600">*</span>
                  </label>

                  <div
                    className={`mt-2 flex items-center gap-3 bg-white border rounded-full px-4 py-3 shadow-sm
                    ${errors.name ? "border-red-500" : "border-gray-200"}`}
                  >
                    <span className="text-lg">👤</span>
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                      }}
                      placeholder="Enter customer name"
                      className="w-full outline-none bg-transparent font-semibold text-gray-700 placeholder:text-gray-400"
                    />
                  </div>

                  {errors.name && (
                    <p className="text-red-600 text-sm font-semibold mt-2">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Guests */}
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    No of Guests <span className="text-red-600">*</span>
                  </label>

                  <div
                    className={`mt-2 flex items-center gap-3 bg-white border rounded-full px-4 py-3 shadow-sm
                    ${errors.guests ? "border-red-500" : "border-gray-200"}`}
                  >
                    <span className="text-lg">👥</span>
                    <select
                      value={guests}
                      onChange={(e) => {
                        setGuests(e.target.value);
                        if (e.target.value !== "custom") setCustomGuests("");
                        setErrors((p) => ({
                          ...p,
                          guests: "",
                          customGuests: "",
                        }));
                      }}
                      className="w-full outline-none bg-transparent font-semibold text-gray-700"
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="custom">More than 5</option>
                    </select>
                  </div>

                  {errors.guests && (
                    <p className="text-red-600 text-sm font-semibold mt-2">
                      {errors.guests}
                    </p>
                  )}

                  {guests === "custom" && (
                    <>
                      <div
                        className={`mt-3 flex items-center gap-3 bg-white border rounded-full px-4 py-3 shadow-sm
                        ${
                          errors.customGuests
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      >
                        <span className="text-lg">✍️</span>
                        <input
                          value={customGuests}
                          onChange={(e) => {
                            setCustomGuests(e.target.value);
                            if (errors.customGuests)
                              setErrors((p) => ({ ...p, customGuests: "" }));
                          }}
                          placeholder="Enter guests count"
                          type="number"
                          min="1"
                          className="w-full outline-none bg-transparent font-semibold text-gray-700 placeholder:text-gray-400"
                        />
                      </div>

                      {errors.customGuests && (
                        <p className="text-red-600 text-sm font-semibold mt-2">
                          {errors.customGuests}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Contact Number <span className="text-red-600">*</span>
                  </label>

                  <div
                    className={`mt-2 flex items-center gap-3 bg-white border rounded-full px-4 py-3 shadow-sm
                    ${errors.contact ? "border-red-500" : "border-gray-200"}`}
                  >
                    <span className="text-lg">📞</span>
                    <input
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        if (errors.contact)
                          setErrors((p) => ({ ...p, contact: "" }));
                      }}
                      placeholder="Enter mobile number"
                      type="tel"
                      className="w-full outline-none bg-transparent font-semibold text-gray-700 placeholder:text-gray-400"
                    />
                  </div>

                  {errors.contact && (
                    <p className="text-red-600 text-sm font-semibold mt-2">
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Table No */}
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Table No <span className="text-red-600">*</span>
                  </label>

                  <div
                    className={`mt-2 flex items-center gap-3 bg-white border rounded-full px-4 py-3 shadow-sm
                    ${errors.tableNo ? "border-red-500" : "border-gray-200"}`}
                  >
                    <span className="text-lg">🍽️</span>
                    <select
                      value={tableNo}
                      onChange={(e) => {
                        setTableNo(e.target.value);
                        if (errors.tableNo)
                          setErrors((p) => ({ ...p, tableNo: "" }));
                      }}
                      className="w-full outline-none bg-transparent font-semibold text-gray-700"
                    >
                      <option value="">Select</option>
                      {Array.from({ length: 15 }, (_, i) => i + 1).map((t) => (
                        <option key={t} value={String(t)}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.tableNo && (
                    <p className="text-red-600 text-sm font-semibold mt-2">
                      {errors.tableNo}
                    </p>
                  )}
                </div>

                {/* Button */}
                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full h-[60px] rounded-full font-extrabold text-white text-lg
                  shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-400 hover:shadow-xl hover:scale-[1.01] active:scale-95"
                  }`}
                >
                  {loading ? "Placing Order..." : "Confirm Order"}
                  <span className="text-2xl leading-none">→</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}