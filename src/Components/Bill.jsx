import React, { useEffect, useMemo, useState } from "react";

export default function Bill({ orderId, onClose }) {
  const [billOrder, setBillOrder] = useState(null);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];
    const found = all.find((o) => String(o.id) === String(orderId));
    setBillOrder(found || null);
  }, [orderId]);

  const totalAmount = useMemo(() => {
    if (!billOrder?.items?.length) return 0;
    return billOrder.items.reduce(
      (sum, it) =>
        sum + Number(it.itemTotal || (it.price || 0) * (it.qty || 1)),
      0
    );
  }, [billOrder]);

  const handlePrint = () => {
    const printContents = document.getElementById("bill-print-area")?.innerHTML;

    if (!printContents) return;

    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin: 0; }
            .box { border: 1px solid #ddd; padding: 18px; border-radius: 12px; }
            .row { display:flex; justify-content:space-between; }
            .item { padding: 10px; border: 1px solid #eee; border-radius: 10px; margin-top: 10px; }
            .muted { color: #555; font-size: 13px; }
            .bold { font-weight: 700; }
            .total { margin-top: 15px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="box">
            ${printContents}
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (!billOrder) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl">
          <h2 className="text-xl font-extrabold text-gray-900">Bill 🧾</h2>

          <p className="mt-2 font-bold text-red-600">
            Order not found for ID: {orderId}
          </p>

          <button
            onClick={onClose}
            className="mt-4 w-full py-2 rounded-xl font-extrabold bg-black text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 relative">
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-extrabold"
        >
          ✕
        </button>

        {/* ✅ Bill Content */}
        <div id="bill-print-area">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Aroma Restaurant 🧾
              </h2>

              <p className="text-gray-600 mt-1 font-semibold">
                Order ID: <span className="font-bold">{billOrder.id}</span>
              </p>

              <p className="text-gray-600 font-semibold">
                Customer: <span className="font-bold">{billOrder.name}</span>
              </p>

              <p className="text-gray-600 font-semibold">
                Table No: <span className="font-bold">{billOrder.tableNo}</span>
              </p>

              <p className="text-gray-600 font-semibold">
                Date & Time:{" "}
                <span className="font-bold">{billOrder.time}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-extrabold text-gray-500">TOTAL</p>
              <p className="text-2xl font-extrabold text-green-700">
                ₹{totalAmount}/-
              </p>
            </div>
          </div>

          <div className="mt-5 border-t pt-4">
            <h3 className="font-bold text-gray-900 mb-3">Bill Items</h3>

            <div className="grid gap-2">
              {(billOrder.items || []).map((it, idx) => {
                const price = Number(it.price || 0);
                const qty = Number(it.qty || 1);
                const itemTotal = Number(it.itemTotal || price * qty);

                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 border rounded-xl p-3"
                  >
                    <div>
                      <div className="font-bold text-gray-900">{it.name}</div>
                      <div className="text-xs text-gray-500">
                        Qty: {qty} • Price: ₹{price}/-
                      </div>
                    </div>

                    <div className="font-extrabold text-red-600">
                      ₹{itemTotal}/-
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ THANK YOU MESSAGE */}
            <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-2xl text-center">
              <p className="text-lg font-extrabold text-green-700">
                Thank you 😊🙏
              </p>
              <p className="text-gray-700 font-semibold mt-1">
                We hope you enjoy your meal 🍽️😋
              </p>
              <p className="text-gray-700 font-semibold">Visit again ❤️✨</p>
            </div>
          </div>
        </div>

        {/* ✅ Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handlePrint}
            className="w-full py-3 rounded-2xl font-extrabold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Print Bill 🖨️
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-extrabold bg-black text-white hover:bg-gray-900 transition"
          >
            Close ✖️
          </button>
        </div>
      </div>
    </div>
  );
}
