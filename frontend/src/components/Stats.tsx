"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Users, Zap } from 'lucide-react';

const stats = [
  {
    icon: Activity,
    value: "1,420,000+",
    label: "Articles Analyzed",
    change: "+12.4% this month",
    color: "text-blue-400"
  },
  {
    icon: ShieldCheck,
    value: "99.2%",
    label: "Detection Accuracy",
    change: "Ensemble Verified",
    color: "text-emerald-400"
  },
  {
    icon: Zap,
    value: "< 350 ms",
    label: "Average Response Time",
    change: "Real-time pipeline",
    color: "text-purple-400"
  },
  {
    icon: Users,
    value: "45,000+",
    label: "Trusted Journalists & Users",
    change: "Global coverage",
    color: "text-cyan-400"
  }
];

export const Stats = () => {
  return (
    <div className="py-12 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                  <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {stat.change}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
