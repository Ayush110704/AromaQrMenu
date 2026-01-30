import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-8 pb-5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto grid gap-7 md:grid-cols-4"
      >
        {/* ✅ Brand / About */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white">Aroma Restaurant</h2>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Serving delicious food with fresh ingredients and authentic taste.
            Visit us with your family & friends for a memorable dining
            experience.
          </p>

          {/* ✅ Social (Only Instagram) */}
          <div className="flex gap-3 mt-3">
            <motion.a
              href="https://www.instagram.com/aroma_kitchen___?igsh=MWU2NDhjemd4amJrMw=="
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              <FaInstagram />
            </motion.a>
          </div>
        </motion.div>

        {/* ✅ Opening Hours */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-base font-semibold text-white mb-3">
            Opening Hours
          </h3>

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <FaClock className="text-white" />
              <span>
                <b className="text-white">Daily:</b> 4:00 PM - 11:30 PM
              </span>
            </p>

            <p className="text-gray-400 text-sm">
              Kitchen open till closing time ✅
            </p>
          </div>
        </motion.div>

        {/* ✅ Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-base font-semibold text-white mb-3">
            Quick Links
          </h3>

          <ul className="space-y-1.5 text-sm">
            <li>
              <a href="/#top" className="hover:text-white transition">
                Home
              </a>
            </li>

            <li>
              <a href="/#menuPreview" className="hover:text-white transition">
                Menu Preview
              </a>
            </li>

            <li>
              <a href="/#services" className="hover:text-white transition">
                Services
              </a>
            </li>

            <li>
              <a href="/#reviews" className="hover:text-white transition">
                Reviews
              </a>
            </li>

            <li>
              <a href="/menu" className="hover:text-white transition">
                Full Menu
              </a>
            </li>

            <li>
              <a href="/cart" className="hover:text-white transition">
                Cart / Order
              </a>
            </li>
          </ul>
        </motion.div>

        {/* ✅ Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-base font-semibold text-white mb-3">
            Contact Us
          </h3>

          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-white" />
              <span>
                Aroma Restaurant <br />
                Arvi Rd, Junapani Square, <br />
                Wardha, Maharashtra 442001
              </span>
            </p>

            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-white" />
              <span>+91 9322649906</span>
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope className="text-white" />
              <span>aromarestaurant@gmail.com</span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ✅ Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto mt-7 border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-400"
      >
        <p>© {new Date().getFullYear()} Aroma Restaurant. All rights reserved.</p>

        <p className="text-gray-400">
          Designed by <span className="text-white font-semibold">Ayush</span>
        </p>
      </motion.div>
    </footer>
  );
}
