"use client";

import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-800 shadow-xl rounded-2xl p-10 w-full max-w-lg text-center"
      >
        <h1 className="text-4xl font-bold text-blue-400">Dashboard</h1>
        <motion.p
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-4 text-lg text-gray-300"
        >
          Coming Soon...
        </motion.p>
      </motion.div>
    </div>
  );
}
