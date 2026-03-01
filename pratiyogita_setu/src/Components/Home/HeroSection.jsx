import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PRATIYOGITA_YOGYA_URL =
  import.meta.env.VITE_PRATIYOGITA_YOGYA_URL || "http://localhost:5173";
const PRATIYOGITA_MARG_URL =
  import.meta.env.VITE_PRATIYOGITA_MARG_URL || "http://localhost:8080";
const PRATIYOGITA_GYAN_URL =
  import.meta.env.VITE_PRATIYOGITA_GYAN_URL || "http://localhost:3002";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
             <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-sm font-semibold text-orange-400">
                          Unique Tool for Competative exams
                        </span>
                      </motion.div>
             <Link to="/gyan-posters">
               <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/20 hover:border-orange-500/50 cursor-pointer transition-colors"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <span className="text-sm font-semibold text-white/90">
                          📚 Gyan Posters — Learn Visually
                        </span>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none animate-pulse">NEW</span>
                      </motion.div>
             </Link>
          </div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Path to{" "}
            <span className="text-orange-400">Success</span> in Competitive
            Exams
          </motion.h1>

          {/* Tagline removed as requested */}

          <motion.div
            className="mt-10 lg:mt-14 flex flex-row gap-2 sm:gap-10 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href={`${PRATIYOGITA_YOGYA_URL}/check-eligibility`}
              className="bubble-btn flex flex-col items-center gap-0.5 whitespace-nowrap"
            >
              <span className="font-bold text-xs sm:text-base">Check Now</span>
              <span className="text-[10px] sm:text-xs font-normal opacity-90">Know your Eligibility</span>
            </a>
            <a
              href={`${PRATIYOGITA_MARG_URL}/explore`}
              className="bubble-btn bubble-btn-outline flex flex-col items-center gap-0.5 whitespace-nowrap"
            >
              <span className="font-bold text-xs sm:text-base">Explore</span>
              <span className="text-[10px] sm:text-xs font-normal opacity-90">Explore Mindmaps</span>
            </a>
            <a
              href={PRATIYOGITA_GYAN_URL}
              className="bubble-btn bubble-btn-outline flex flex-col items-center gap-0.5 whitespace-nowrap"
            >
              <span className="font-bold text-xs sm:text-base">Chat with AI</span>
              <span className="text-[10px] sm:text-xs font-normal opacity-90">Chat with Gyan</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
