import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaFlask, FaArrowDown } from 'react-icons/fa';

const HeroSection = ({ onScrollToContent }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* NASA Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <FaRocket className="text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm uppercase tracking-wider">
                NASA Space Apps Challenge 2024
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Space Biology
          </span>
          <br />
          <span className="text-white">Knowledge Engine</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Unlock insights from <span className="text-blue-400 font-semibold">600+ NASA bioscience publications</span> to enable safe and efficient human exploration of the Moon and Mars
        </motion.p>

        {/* Feature highlights */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
        >
          <div className="bg-slate-800/40 backdrop-blur-sm border border-indigo-800/30 rounded-xl p-6 hover:border-indigo-600/50 transition-all hover:scale-105">
            <FaFlask className="text-blue-400 text-3xl mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-400 text-sm">
              Advanced insights from space biology research using Gemini AI
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-indigo-800/30 rounded-xl p-6 hover:border-indigo-600/50 transition-all hover:scale-105">
            <FaChartLine className="text-purple-400 text-3xl mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">Knowledge Gaps</h3>
            <p className="text-gray-400 text-sm">
              Identify under-researched areas and future opportunities
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-indigo-800/30 rounded-xl p-6 hover:border-indigo-600/50 transition-all hover:scale-105">
            <FaRocket className="text-green-400 text-3xl mb-3 mx-auto" />
            <h3 className="text-white font-semibold mb-2">Mission Planning</h3>
            <p className="text-gray-400 text-sm">
              Actionable insights for scientists, managers & architects
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onScrollToContent}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
          >
            Explore Research
            <FaArrowDown className="group-hover:translate-y-1 transition-transform" />
          </button>

          <button
            onClick={() => window.scrollTo({ top: document.getElementById('stats')?.offsetTop, behavior: 'smooth' })}
            className="px-8 py-4 bg-slate-800/60 hover:bg-slate-700/60 text-white border border-indigo-800/40 hover:border-indigo-600/60 rounded-full font-semibold text-lg transition-all hover:scale-105 backdrop-blur-sm"
          >
            View Statistics
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onScrollToContent}>
            <span className="text-gray-400 text-sm">Scroll to explore</span>
            <FaArrowDown className="text-blue-400 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
