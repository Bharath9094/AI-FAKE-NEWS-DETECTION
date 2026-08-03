"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Search, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Multi-Modal Input",
    description: "Paste headline or text, submit news URL, upload PDF/DOCX document, or drop a social media screenshot."
  },
  {
    step: "02",
    icon: Cpu,
    title: "NLP Preprocessing & Feature Extraction",
    description: "Cleans text, strips noise, tokenizes, lemmatizes, and computes caps ratios, exclamation frequency, and sensational trigger words."
  },
  {
    step: "03",
    icon: Search,
    title: "Voting Ensemble & LLM Reasoning",
    description: "Evaluates article across pre-trained TF-IDF Logistic Regression, Random Forest & Gradient Boosting, followed by NVIDIA NIM LLM breakdown."
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Detailed Verdict & Fact Dossier",
    description: "Receive probability gauge score, highlighted sentence heatmap, fact check evidence from Reuters/AP, and export report."
  }
];

export const HowItWorks = () => {
  return (
    <div id="how-it-works" className="py-20 bg-slate-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">AI Pipeline Architecture</h2>
          <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How <span className="gradient-text">Veritas AI</span> Detects Deception
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 relative border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-blue-500/30 font-mono">{step.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
