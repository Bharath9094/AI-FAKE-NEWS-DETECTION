"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Cpu, Eye, Lock } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Animated Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-blue-500/30 text-xs font-semibold text-blue-400 mb-8 shadow-lg shadow-blue-500/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          <span>Powered by ML Ensemble & NVIDIA NIM Llama 3.3 70B Instruct</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]"
        >
          Uncover Truth in Seconds with <br />
          <span className="gradient-text">AI Fake News Detection</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Don't just classify news — understand <strong className="text-blue-400 font-semibold">WHY</strong>. 
          Extract articles via URL, text, PDF, image OCR, or voice input. Analyze political bias, propaganda, emotional manipulation, and verify facts instantly.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Free Verification</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-slate-300 hover:text-white font-semibold text-base border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5 text-cyan-400" />
            <span>See How It Works</span>
          </a>
        </motion.div>

        {/* Key USPs list */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>99.2% Model Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-Source Fact Checking</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Image OCR & PDF Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PDF / CSV Export Reports</span>
          </div>
        </motion.div>

        {/* Floating Mockup Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 max-w-4xl mx-auto glass-card rounded-2xl p-6 border border-white/10 shadow-2xl relative"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>veritas-ai-engine.internal/predict</span>
            </div>
            <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              SYSTEM READY
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">VERDICT</span>
              <span className="text-xl font-black text-rose-400 flex items-center gap-2">
                FAKE ARTICLE
              </span>
              <p className="text-xs text-slate-400 mt-2">Confidence Risk: <strong className="text-rose-400 font-bold">96.8%</strong></p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">SUSPICIOUS TRIGGER</span>
              <p className="text-xs text-slate-300 italic font-mono bg-rose-500/10 text-rose-300 p-2 rounded border border-rose-500/20">
                "BOMBSHELL: Secret Miracle Elixir Exposed Today!"
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">FACT CHECK EVIDENCE</span>
              <span className="text-xs text-emerald-400 font-medium block mb-1">Reuters & AP Wire</span>
              <p className="text-[11px] text-slate-400">Zero corroborating documentation in global health registries.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
