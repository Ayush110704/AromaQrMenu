import React from "react";
import { motion } from "framer-motion";
import wws1 from "../assets/wws1.png";
import wws2 from "../assets/wws2.png";
import wws3 from "../assets/wws3.png";

const Service = () => {
  const services = [
    {
      img: wws1,
      title: "One-Tap Ordering 📱",
      text: "Skip the hassle! With just one tap, your cravings are on their way to your doorstep!",
    },
    {
      img: wws2,
      title: "Flash-Speed Delivery ⚡",
      text: "We don’t just deliver food, we deliver happiness—hot & fresh, faster than ever!",
    },
    {
      img: wws3,
      title: "Five-Star Quality ⭐",
      text: "Every bite is a masterpiece! Only the best ingredients for an unforgettable experience.",
    },
  ];

  // ✅ Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      id="services"
      className="w-full min-h-screen bg-gradient-to-r from-red-50 to-yellow-50 px-4 sm:px-6 lg:px-20 py-28 md:py-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto text-center max-w-7xl">
        {/* ✅ Heading Animation */}
        <motion.h2
          variants={fadeUp}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 uppercase tracking-widest mb-3"
        >
          Our Services
        </motion.h2>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight mb-8 md:mb-12 lg:mb-16"
        >
          Delicious Delivered, <br className="hidden sm:block" />
          Just The Way You Love! 🍕🚀
        </motion.h1>

        {/* ✅ Cards Stagger Animation */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.04,
                rotate: 0.3,
                transition: { duration: 0.25 },
              }}
              className="group bg-white shadow-md hover:shadow-xl rounded-2xl p-4 sm:p-6 transition-all duration-300"
            >
              {/* ✅ Image Motion */}
              <div className="overflow-hidden rounded-xl">
                <motion.img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-52 sm:h-56 md:h-48 lg:h-56 xl:h-64 object-cover"
                  whileHover={{ scale: 1.12, rotate: 1.5 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>

              {/* ✅ Text Motion */}
              <motion.h3
                variants={fadeUp}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mt-4"
              >
                {service.title}
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg text-gray-700 leading-relaxed mt-2"
              >
                {service.text}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Service;
