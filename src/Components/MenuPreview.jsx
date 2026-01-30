import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Preview items
const vegPreview = [
  { name: "Paneer Butter Masala", price: 210 },
  { name: "Veg Kolhapuri", price: 180 },
  { name: "Malai Kofta", price: 210 },
];

const nonVegPreview = [
  { name: "Chicken Curry", price: 190 },
  { name: "Chicken Tandoor", half: 260, full: 460 },
  { name: "Mutton Curry", price: 240 },
];

const dessertPreview = [
  { name: "Gulab Jamun", price: 60 },
  { name: "Ice Cream", price: 80 },
  { name: "Fruit Salad", price: 90 },
];

function showPrice(item) {
  if (typeof item.price === "number") return `₹${item.price}/-`;
  if (typeof item.half === "number" && typeof item.full === "number")
    return `Half ₹${item.half}/- | Full ₹${item.full}/-`;
  return "-";
}

export default function MenuPreview() {
  // ✅ Typing Effect for sub text only
  const subTextFull = "(Veg / Non-Veg / Desserts)";
  const [subTyped, setSubTyped] = useState("");

  // ✅ Card animation
  const cardAnim = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // ✅ Items container (stagger effect)
  const listAnim = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // ✅ Each item animation
  const itemAnim = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  // ✅ Typing effect (loop)
  useEffect(() => {
    let i = 0;
    let typingInterval;
    let restartTimeout;

    const startTyping = () => {
      setSubTyped("");
      i = 0;

      typingInterval = setInterval(() => {
        i++;
        setSubTyped(subTextFull.slice(0, i));

        if (i >= subTextFull.length) {
          clearInterval(typingInterval);

          restartTimeout = setTimeout(() => {
            startTyping();
          }, 3000); // ✅ wait 3 sec then restart
        }
      }, 60);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(restartTimeout);
    };
  }, []);

  return (
    <section id="menuPreview" className="max-w-7xl mx-auto px-4 py-14 pb-24">
      {/* ✅ Title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-extrabold text-gray-900">
          Menu Preview 🍽️
        </h2>

        {/* ✅ Typing Effect only here */}
        <p className="text-gray-600 mt-2 font-medium">
          Some popular items{" "}
          <span className="text-gray-800">
            {subTyped}
            <span className="animate-pulse">|</span>
          </span>
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* VEG */}
        <motion.div
          variants={cardAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold text-green-700 mb-4">
            Veg Items 🟢
          </h3>

          <motion.div
            variants={listAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {vegPreview.map((item, i) => (
              <motion.div
                key={i}
                variants={itemAnim}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="font-bold text-red-600">{showPrice(item)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* NON VEG */}
        <motion.div
          variants={cardAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold text-red-700 mb-4">
            Non-Veg Items 🔴
          </h3>

          <motion.div
            variants={listAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {nonVegPreview.map((item, i) => (
              <motion.div
                key={i}
                variants={itemAnim}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="font-bold text-red-600">{showPrice(item)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* DESSERT */}
        <motion.div
          variants={cardAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold text-yellow-700 mb-4">
            Desserts 🍨
          </h3>

          <motion.div
            variants={listAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {dessertPreview.map((item, i) => (
              <motion.div
                key={i}
                variants={itemAnim}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="font-bold text-red-600">{showPrice(item)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ✅ Button */}
      <motion.div
        className="flex justify-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/menu"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition"
          >
            Show Full Menu 🍴
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
