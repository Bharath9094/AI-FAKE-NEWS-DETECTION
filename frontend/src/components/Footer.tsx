import React from 'react';
import { ShieldCheck, Github, Twitter, Cpu, Database, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-cardBorder bg-background/80 relative overflow-hidden pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">VERITAS AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Production-grade AI Fake News Detection Platform leveraging ML Voting Ensembles, NVIDIA NIM Llama 3.3 LLM explanations, OCR, and multi-source fact-checking.
            </p>
          </div>

          {/* Core Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              AI & Tech Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-blue-400 transition-colors">NVIDIA NIM (Llama 3.3 70B)</li>
              <li className="hover:text-purple-400 transition-colors">Scikit-Learn Voting Ensemble</li>
              <li className="hover:text-cyan-400 transition-colors">FastAPI Backend (Python)</li>
              <li className="hover:text-indigo-400 transition-colors">Next.js & TypeScript</li>
            </ul>
          </div>

          {/* Direct Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Multi-Modal OCR & PDF Reader</li>
              <li>Live URL Web Scraper</li>
              <li>Sentence Highlight Heatmap</li>
              <li>Reuters / BBC Fact Verification</li>
              <li>PDF / CSV Automated Export</li>
            </ul>
          </div>

          {/* Compliance & API */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              API & Trust
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              REST API endpoints secured with JWT tokens, password hashing, and input validation.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 rounded-lg glass-card hover:border-blue-500/50 text-slate-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg glass-card hover:border-blue-500/50 text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VERITAS AI Platform. Built with Next.js, FastAPI & Scikit-Learn.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
