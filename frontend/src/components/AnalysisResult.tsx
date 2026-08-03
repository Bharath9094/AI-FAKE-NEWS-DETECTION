"use client";

import React, { useState } from 'react';
import { PredictionResponse } from '../types';
import { GaugeMeter } from './GaugeMeter';
import { HeatmapText } from './HeatmapText';
import { ProbabilityPieChart, BreakdownBarChart, ManipulationRadarChart } from './Charts';
import { 
  ShieldAlert, ShieldCheck, Download, ExternalLink, Sparkles, 
  Brain, AlertTriangle, FileText, Share2, CheckCircle2, Bookmark
} from 'lucide-react';
import { toggleBookmark } from '../lib/api';

interface AnalysisResultProps {
  data: PredictionResponse;
  onReset?: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
  const isFake = data.prediction === "FAKE";
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleExport = (format: string) => {
    if (!data.id) {
      alert("Scan ID missing for export");
      return;
    }
    window.open(`http://127.0.0.1:8000/api/v1/export/${data.id}?format=${format}`, '_blank');
  };

  const handleBookmark = async () => {
    if (data.id) {
      await toggleBookmark(data.id);
      setIsBookmarked(!isBookmarked);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Verdict Banner */}
      <div className={`glass-card rounded-2xl p-6 md:p-8 border-2 shadow-2xl relative overflow-hidden ${
        isFake ? 'border-rose-500/50 shadow-rose-500/10' : 'border-emerald-500/50 shadow-emerald-500/10'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-2 ${
                isFake ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              }`}>
                {isFake ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                CLASSIFIED AS {data.prediction}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: #{data.id || 'LIVE'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Article Authenticity Analysis
            </h2>
            <p className="text-xs text-slate-300">
              Evaluated with <strong className="text-blue-400">{data.confidence}% confidence</strong> using Scikit-Learn Voting Ensemble & NVIDIA NIM Llama 3.3.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2.5 rounded-xl glass-card text-xs font-semibold flex items-center gap-2 transition-all ${
                isBookmarked ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
            </button>

            <div className="flex items-center space-x-1 glass-card p-1 rounded-xl">
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Report</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                JSON
              </button>
            </div>

            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-all"
              >
                New Scan
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gauge Meter */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center">
          <GaugeMeter score={data.fake_probability} prediction={data.prediction} title="Risk Gauge" />
        </div>

        {/* Score Breakdown Cards */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Core AI Indicators
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Clickbait Index</span>
              <span className="text-xl font-bold text-rose-400">{data.clickbait_score}/100</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Emotional Bias</span>
              <span className="text-xl font-bold text-amber-400">{data.emotion_score}/100</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Propaganda Score</span>
              <span className="text-xl font-bold text-purple-400">{data.propaganda_score}/100</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Trust Rating</span>
              <span className="text-xl font-bold text-emerald-400">{data.trust_score}/100</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">NLP Metrics:</span>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5">
                Word Count: <strong className="text-white">{data.nlp_features?.word_count || 0}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5">
                Caps Ratio: <strong className="text-white">{data.nlp_features?.caps_ratio || 0}%</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5">
                Exclamations: <strong className="text-white">{data.nlp_features?.exclamations || 0}</strong>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. LLM Explanation Section */}
      {data.llm_analysis && (
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">NVIDIA NIM Llama 3.3 Explanation</h3>
              <p className="text-xs text-slate-400">Deep AI analysis of claims, political skew, and manipulation tactics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Executive Summary</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
                  {data.llm_analysis.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Deception / Authenticity Reasoning</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-white/5">
                  {data.llm_analysis.explanation}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Key Flagged Factors</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {data.llm_analysis.reasons?.map((reason, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Guidance & Suggestions</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {data.llm_analysis.suggestions?.map((sugg, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{sugg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. Sentence Heatmap Inspector */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-rose-400" />
          Interactive Sentence Risk Heatmap
        </h3>
        <HeatmapText sentences={data.highlighted_sentences} originalText={data.original_input} />
      </div>

      {/* 5. Recharts Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Probability Distribution</h4>
          <ProbabilityPieChart fake={data.fake_probability} real={data.real_probability} />
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Indicator Breakdown</h4>
          <BreakdownBarChart data={data} />
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Deception Footprint</h4>
          <ManipulationRadarChart data={data} />
        </div>

      </div>

      {/* 6. Fact Check Reference Sources */}
      {data.fact_checks && data.fact_checks.length > 0 && (
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Cross-Referenced Fact Check Archives
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.fact_checks.map((fc, idx) => (
              <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{fc.source_name}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {fc.trust_score}% TRUST
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                  Verdict: {fc.claim_verdict}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {fc.matching_info}
                </p>

                <a 
                  href={fc.source_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-semibold pt-1"
                >
                  <span>View Wire Citation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
