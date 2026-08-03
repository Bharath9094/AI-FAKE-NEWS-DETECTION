"use client";

import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { PredictionResponse } from '../types';

interface ChartsProps {
  data: PredictionResponse;
}

export const ProbabilityPieChart: React.FC<{ fake: number; real: number }> = ({ fake, real }) => {
  const chartData = [
    { name: 'Authentic (Real)', value: real, color: '#10b981' },
    { name: 'Deceptive (Fake)', value: fake, color: '#f43f5e' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            formatter={(value: any) => [`${value}%`, 'Score']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BreakdownBarChart: React.FC<ChartsProps> = ({ data }) => {
  const chartData = [
    { metric: 'Bias', Score: data.bias_score },
    { metric: 'Emotion', Score: data.emotion_score },
    { metric: 'Propaganda', Score: data.propaganda_score },
    { metric: 'Clickbait', Score: data.clickbait_score },
    { metric: 'Trust Index', Score: data.trust_score }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
          />
          <Bar dataKey="Score" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ManipulationRadarChart: React.FC<ChartsProps> = ({ data }) => {
  const chartData = [
    { subject: 'Sensationalism', A: data.clickbait_score, fullMark: 100 },
    { subject: 'Emotional Leverage', A: data.emotion_score, fullMark: 100 },
    { subject: 'Political Skew', A: data.bias_score, fullMark: 100 },
    { subject: 'Propaganda Risk', A: data.propaganda_score, fullMark: 100 },
    { subject: 'Unverified Claims', A: 100 - data.trust_score, fullMark: 100 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" />
          <Radar name="Deception Footprint" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
