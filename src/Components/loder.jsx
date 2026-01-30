import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/Logo.png";

export default function Loader() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
        }, 40);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
            <div className="text-center px-6 w-full max-w-md">
                {/* ✅ Circle Loader */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                    {/* ✅ Outer Dark Ring */}
                    <div className="absolute inset-0 rounded-full border-[10px] border-[#1f2937]" />

                    {/* ✅ Yellow Arc (Rotating) */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-yellow-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* ✅ Logo Circle (ZOOMED) */}
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl">
                        <img
                            src={logo}
                            alt="Aroma Logo"
                            className="w-full h-full object-cover rounded-full scale-110"
                            draggable="false"
                        />
                    </div>
                </div>

                {/* ✅ Text */}
                <motion.h1
                    className="text-white text-2xl md:text-4xl font-bold tracking-wide mt-6"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Welcome to
                </motion.h1>

                <motion.h2
                    className="text-yellow-400 text-3xl md:text-5xl font-extrabold mt-2 leading-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    Aroma <br />
                    <span className="whitespace-nowrap">The Urban Kitchen</span>
                </motion.h2>


                {/* ✅ Progress */}
                <div className="mt-8 w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                        className="h-3 bg-yellow-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>

                <p className="text-gray-300 mt-3 text-sm font-medium">
                    Loading... {progress}%
                </p>
            </div>
        </div>
    );
} 