import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Bannervideo from "../assets/Bannervideo.mp4";
import Bannerfood from "../assets/Bannerfood.png";
import BannerArrow from "../assets/BannerArrow.png";
import BannerClock from "../assets/BannerClock.png";
import Bannersmall1 from "../assets/Bannersmall1.png";
import Bannersmall2 from "../assets/Bannersmall2.png";
import Bannersmall3 from "../assets/Bannersmall3.png";
import FireIcon from "../assets/FireIcon.png";

const Banner = () => {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  // ✅ Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.35 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const pop = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
  };

  return (
    <div className="bg-white pt-12 md:pt-24 min-h-[500px] flex items-center">
      {/* ✅ VIDEO MODAL */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={pop}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 md:p-6 rounded-2xl w-full max-w-4xl relative shadow-2xl"
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-10 right-0 text-white text-4xl font-bold"
              >
                &times;
              </button>

              <div className="aspect-video">
                <video
                  src={Bannervideo}
                  controls
                  autoPlay
                  className="w-full h-full rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* ✅ LEFT CONTENT */}
        <motion.div
          className="w-full lg:flex-1 text-center lg:text-left"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.h3
            variants={fadeUp}
            className="text-lg mt-5 md:text-xl lg:text-2xl font-bold text-gray-600 mb-2 md:mb-3"
          >
            Make Your Day Faster
          </motion.h3>

          {/* ✅ Writing / Typing Effect Heading */}
          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight mb-4">
            {/* Line 1 */}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "fit-content" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="block overflow-hidden whitespace-nowrap"
            >
              Claim Best Offer on
            </motion.span>

            {/* Line 2 */}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "fit-content" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="block overflow-hidden whitespace-nowrap text-orange-600"
            >
              Aroma
            </motion.span>

            {/* Line 3 */}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "fit-content" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="block overflow-hidden whitespace-nowrap text-yellow-500"
            >
              The Urban Kitchen
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base lg:text-lg text-gray-600 mb-6"
          >
            Our job is to fill your tummy with delicious food{" "}
            <br className="hidden sm:block" />
            and with fast and free delivery.
          </motion.p>

          {/* ✅ Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center lg:justify-start gap-4"
          >
            {/* ✅ Redirect to Full Menu */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/menu")}
              className="bg-red-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-red-600 transition text-sm md:text-base shadow"
            >
              Get Started
            </motion.button>

            {/* ✅ Watch Video */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 md:gap-3 group"
              onClick={() => setShowVideo(true)}
            >
              <motion.span
                whileHover={{ scale: 1.12 }}
                className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-full flex items-center justify-center transition group-hover:bg-red-600 shadow-lg relative"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="text-white text-lg">&#9654;</span>
              </motion.span>

              <span className="text-gray-600 group-hover:text-red-500 font-semibold text-sm md:text-base">
                Watch Video
              </span>
            </motion.button>
          </motion.div>

          {/* ✅ Customers */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6 justify-center lg:justify-start"
          >
            <motion.div
              className="flex -space-x-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={Bannersmall1}
                alt="customer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md"
              />
              <img
                src={Bannersmall2}
                alt="customer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md"
              />
              <img
                src={Bannersmall3}
                alt="customer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md"
              />
            </motion.div>

            <div>
              <p className="text-lg md:text-xl font-bold flex items-center justify-center lg:justify-start">
                <span className="text-yellow-500 mr-2">★★★★</span> 7.48k
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                Our Happy Customers
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ✅ RIGHT IMAGE SECTION */}
        <motion.div
          className="w-full lg:flex-1 relative max-w-sm sm:max-w-md md:max-w-lg lg:max-w-none mx-auto"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative mx-auto">
            <motion.img
              src={Bannerfood}
              alt="Banner food"
              className="w-full h-auto object-cover transform -rotate-180 hover:rotate-0 transition duration-500"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute left-2 sm:left-4 md:-left-6 top-4 sm:top-6 w-14 sm:w-16 md:w-20"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={BannerClock} alt="Clock" className="w-full h-auto" />
            </motion.div>
          </div>

          <motion.div
            className="absolute right-2 sm:-right-6 md:-right-12 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.img
                src={FireIcon}
                alt="Fire"
                className="w-10 sm:w-12 md:w-14 mb-20 sm:mb-32 md:mb-40"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.img
                src={BannerArrow}
                alt="Arrow"
                className="w-12 sm:w-16 md:w-20 transform rotate-12"
                animate={{ x: [0, 8, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;