"use client";

import { motion } from "framer-motion";

export default function ProfileComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6">
      <motion.h1 
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Profile Page is Coming Soon!
      </motion.h1>
      
      <motion.p 
        className="text-gray-400 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        Stay tuned for updates.
      </motion.p>
      
      <motion.div 
        className="w-16 h-16 border-t-4 border-blue-500 rounded-full mt-6 animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
    </div>
  );
}
