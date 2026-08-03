"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileSearch, Flame, Link2, FileText, Image as ImageIcon, CheckCircle, ShieldAlert, Cpu, Download } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "NVIDIA NIM LLM Explanation",
    description: "Generates clear natural-language reasons, political bias breakdown, emotional manipulation score, and actionable trust guidance using Llama 3.3 70B Instruct.",
    tag: "AI Reasoning",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400"
  },
  {
    icon: Flame,
    title: "Suspicious Sentence Heatmap",
    description: "Interactive sentence-level risk highlighting with clickbait detection, sensationalist triggers, and all-caps manipulation identification.",
    tag: "NLP Heatmap",
    color: "from-rose-500/20 to-orange-500/20 border-rose-500/30 text-rose-400"
  },
  {
    icon: FileSearch,
    title: "Fact Check Cross-Reference",
    description: "Automatically queries international fact-checking wires (Reuters, AP, BBC, Wikipedia, WHO, UN) to locate corroborating or conflicting evidence.",
    tag: "Verification Engine",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
  },
  {
    icon: ImageIcon,
    title: "Image OCR & Screenshot Analysis",
    description: "Upload social media screenshots or newspaper scans. Our optical character recognition engine extracts embedded text and analyzes authenticity.",
    tag: "Multi-Modal OCR",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
  },
  {
    icon: Link2,
    title: "Live URL Web Scraper",
    description: "Paste any online news article URL. The system scrapes the web page, extracts headline and body copy, and feeds it into the classification pipeline.",
    tag: "Web Scraper",
    color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400"
  },
  {
    icon: Download,
    title: "PDF, CSV & JSON Export Reports",
    description: "Download formal verification dossiers formatted for journalism desks, research papers, legal auditing, or social media distribution.",
    tag: "Export Engine",
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400"
  }
];

export const Features = () => {
  return (
    <div id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Core Platform Capabilities</h2>
          <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Comprehensive <span className="gradient-text">AI Verification Suite</span>
          </p>
          <p className="mt-4 text-slate-400 text-base">
            Equipped with multi-stage machine learning, optical character recognition, web scraping, and LLM reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} border`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore module details</span>
                  <span className="ml-1">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
