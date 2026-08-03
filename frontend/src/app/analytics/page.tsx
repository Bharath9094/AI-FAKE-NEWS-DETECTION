"use client";

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShieldCheck, ShieldAlert, PieChart as PieIcon, Layers } from 'lucide-react';
import { getAnalytics } from '../../lib/api';
import { AnalyticsData } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAnalytics().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return <div className="max-w-7xl mx-auto px-4 pt-32 text-center text-slate-400 text-sm">Loading Analytics Data...</div>;
  }

  const pieData = [
    { name: 'Real Articles', value: data.real_count, color: '#10b981' },
    { name: 'Fake Articles', value: data.fake_count, color: '#f43f5e' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
      
      {/* Title */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-cyan-400" />
          Global Misinformation Analytics Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Aggregated authenticity statistics, common deceptive topics, and temporal verification trends.
        </p>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Scans Executed</span>
          <span className="text-3xl font-black text-white">{data.total_scans.toLocaleString()}</span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Authentic Articles</span>
          <span className="text-3xl font-black text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            {data.real_count.toLocaleString()}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Deceptive / Fake Articles</span>
          <span className="text-3xl font-black text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" />
            {data.fake_count.toLocaleString()}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Avg Model Confidence</span>
          <span className="text-3xl font-black text-cyan-400">{data.avg_confidence}%</span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Trend Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Weekly Detection Trends
            </h3>
            <span className="text-xs text-slate-400">Real vs Fake Articles</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="real" name="Real News" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fake" name="Fake News" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real vs Fake Ratio Pie Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-400" />
              Authenticity Proportion Ratio
            </h3>
            <span className="text-xs text-slate-400">Global Share</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Misinformation Categories List */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          Most Targeted Misinformation Domains & Topics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.top_topics.map((item, idx) => (
            <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{item.topic}</span>
                <span className="text-[11px] text-slate-400">{item.count} articles flagged</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/20">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
