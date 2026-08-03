"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Registration failed');

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_info', JSON.stringify(data.user));

      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-xs text-slate-400">Join the VERITAS AI verification platform</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Dr. Alex Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="alex@journalism-wire.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 font-bold hover:underline">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}
