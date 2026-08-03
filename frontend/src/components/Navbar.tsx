"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, History, BarChart3, ShieldAlert, User, LogOut, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_info');
      if (stored) setUser(JSON.parse(stored));
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/85 backdrop-blur-md border-b border-cardBorder py-3 shadow-xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              VERITAS<span className="text-blue-400 font-medium text-sm px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Fake News Detection</p>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-1 glass-card px-4 py-1.5 rounded-full">
          <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Dashboard</span>
          </Link>
          <Link href="/history" className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <History className="w-4 h-4 text-purple-400" />
            <span>History</span>
          </Link>
          <Link href="/analytics" className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Analytics</span>
          </Link>
          <Link href="/admin" className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Action Buttons / Auth Profile */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/profile" className="flex items-center space-x-2 glass-card px-3 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:border-blue-500/50 transition-colors">
                <User className="w-4 h-4 text-blue-400" />
                <span>{user.full_name || user.email}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full glass-card hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log In
              </Link>
              <Link href="/dashboard" className="relative group overflow-hidden rounded-xl p-[1px] font-medium text-sm">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl group-hover:opacity-90 transition-opacity"></span>
                <span className="relative px-4 py-2 rounded-[11px] bg-slate-950 flex items-center space-x-2 text-white font-semibold transition-colors group-hover:bg-opacity-80">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span>Analyze Now</span>
                </span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
