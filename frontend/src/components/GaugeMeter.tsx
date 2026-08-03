"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface GaugeMeterProps {
  score: number; // 0 to 100
  prediction: "REAL" | "FAKE";
  title?: string;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({ score, prediction, title }) => {
  const isFake = prediction === "FAKE";
  const angle = (score / 100) * 180; // 0 to 180 deg

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {title && <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</span>}
      
      <div className="relative w-52 h-28 flex items-end justify-center">
        {/* SVG Arc Background */}
        <svg className="w-full h-full" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            className="transition-all duration-1000 ease-out"
          />

          {/* Ticks */}
          <circle cx="20" cy="100" r="3" fill="#10b981" />
          <circle cx="100" cy="20" r="3" fill="#f59e0b" />
          <circle cx="180" cy="100" r="3" fill="#f43f5e" />
        </svg>

        {/* Center Needle Indicator */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: angle - 90 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ originX: "50%", originY: "100%" }}
          className="absolute bottom-2 left-[calc(50%-2px)] w-1 h-20 bg-white rounded-full shadow-lg z-10"
        />

        {/* Center Pivot Circle */}
        <div className="absolute bottom-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-white shadow-md z-20" />
      </div>

      {/* Score Badge */}
      <div className="mt-3 text-center">
        <div className={`text-3xl font-black ${isFake ? 'text-rose-400' : 'text-emerald-400'}`}>
          {score}%
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          {isFake ? 'Deception Probability' : 'Authenticity Confidence'}
        </span>
      </div>
    </div>
  );
};
