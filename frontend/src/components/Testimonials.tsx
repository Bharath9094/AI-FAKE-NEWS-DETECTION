"use client";

import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Dr. Elena Rostova",
    role: "Senior Investigative Journalist",
    organization: "Global Media Watch",
    content: "Veritas AI has fundamentally transformed our newsroom verification workflow. The sentence heatmap pinpointing sensationalism combined with Reuters fact checking gives us 100% confidence before publishing.",
    stars: 5
  },
  {
    name: "Marcus Vance",
    role: "Digital Misinformation Analyst",
    organization: "Cyber Policy Institute",
    content: "The NVIDIA NIM LLM explanation breakdown is unmatched. It doesn't just output a binary Real/Fake tag — it breaks down emotional manipulation techniques and political bias with surgical precision.",
    stars: 5
  },
  {
    name: "Sarah Jenkins",
    role: "Fact-Checker & Researcher",
    organization: "Open Journalism Network",
    content: "Being able to drop a social media screenshot and have the image OCR automatically extract text and run through voting ensembles in under a second is incredible.",
    stars: 5
  }
];

export const Testimonials = () => {
  return (
    <div className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Trusted Worldwide</h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Used by Leading Journalists & Researchers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-7 relative flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-blue-500/20 mb-4" />
                <div className="flex space-x-1 mb-4">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{review.content}"</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-sm font-bold text-white">{review.name}</h4>
                <p className="text-[11px] text-blue-400">{review.role} • <span className="text-slate-400">{review.organization}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
