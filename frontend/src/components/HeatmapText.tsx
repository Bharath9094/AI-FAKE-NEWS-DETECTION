"use client";

import React, { useState } from 'react';
import { HighlightedSentence } from '../types';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';

interface HeatmapTextProps {
  sentences: HighlightedSentence[];
  originalText: string;
}

export const HeatmapText: React.FC<HeatmapTextProps> = ({ sentences, originalText }) => {
  const [selectedSentence, setSelectedSentence] = useState<HighlightedSentence | null>(null);

  if (!sentences || sentences.length === 0) {
    return (
      <div className="p-4 bg-slate-900/50 rounded-xl text-slate-300 text-sm leading-relaxed">
        {originalText}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-white/5">
        <span className="font-semibold text-slate-300">Sentence Analysis Heatmap:</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500/50" />
            <span className="text-rose-300 font-medium">High Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50" />
            <span className="text-amber-300 font-medium">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            <span className="text-slate-400 font-medium">Normal</span>
          </div>
        </div>
      </div>

      {/* Paragraph Render */}
      <div className="p-5 bg-slate-950/80 rounded-xl border border-white/10 text-sm leading-loose font-normal tracking-wide space-x-1">
        {sentences.map((s) => {
          let styleClass = "cursor-pointer rounded px-1.5 py-0.5 transition-all inline ";
          if (s.risk_level === "HIGH") {
            styleClass += "bg-rose-500/20 text-rose-200 border border-rose-500/40 hover:bg-rose-500/30 font-semibold";
          } else if (s.risk_level === "MEDIUM") {
            styleClass += "bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30";
          } else {
            styleClass += "text-slate-300 hover:bg-white/5";
          }

          return (
            <span
              key={s.id}
              onClick={() => setSelectedSentence(s)}
              className={styleClass}
              title={s.is_suspicious ? `Flagged: ${s.matched_triggers.join(', ') || 'Sensational pattern'}` : 'Normal sentence'}
            >
              {s.text}{' '}
            </span>
          );
        })}
      </div>

      {/* Selected Sentence Inspector Box */}
      {selectedSentence && (
        <div className="p-4 rounded-xl glass-card border border-blue-500/30 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {selectedSentence.risk_level === "HIGH" ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : selectedSentence.risk_level === "MEDIUM" ? (
                <Info className="w-4 h-4 text-amber-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Sentence #{selectedSentence.id} Details ({selectedSentence.risk_level} RISK)
              </span>
            </div>
            <button 
              onClick={() => setSelectedSentence(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 italic mb-2 bg-slate-900 p-2.5 rounded border border-white/5">
            "{selectedSentence.text}"
          </p>

          {selectedSentence.matched_triggers && selectedSentence.matched_triggers.length > 0 && (
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-rose-400">Trigger Keywords Identified:</span>{' '}
              {selectedSentence.matched_triggers.map((t, idx) => (
                <span key={idx} className="mr-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
