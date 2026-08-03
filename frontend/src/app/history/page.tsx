"use client";

import React, { useState, useEffect } from 'react';
import { History, Bookmark, Search, Trash2, Eye, ShieldAlert, ShieldCheck, Download, Calendar } from 'lucide-react';
import { getHistory, toggleBookmark } from '../../lib/api';
import { AnalysisResult } from '../../components/AnalysisResult';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, [bookmarkedOnly]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getHistory(bookmarkedOnly);
      setHistoryItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (id: number) => {
    await toggleBookmark(id);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this scan log?")) return;
    await fetch(`http://127.0.0.1:8000/api/v1/history/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const filteredItems = historyItems.filter(item => 
    (item.title || item.original_input).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-purple-400" />
            Verification Scan History & Bookmarks
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past news classifications, audit scores, and bookmarked investigations.
          </p>
        </div>

        {/* Filter Toggle Pill */}
        <div className="flex items-center space-x-2 glass-card p-1 rounded-xl">
          <button
            onClick={() => setBookmarkedOnly(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !bookmarkedOnly ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Scans
          </button>
          <button
            onClick={() => setBookmarkedOnly(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              bookmarkedOnly ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked</span>
          </button>
        </div>
      </div>

      {selectedScan ? (
        <AnalysisResult data={selectedScan} onReset={() => setSelectedScan(null)} />
      ) : (
        <div className="space-y-6">
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search scan title or excerpt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* List Table Cards */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading verification logs...</div>
          ) : filteredItems.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center space-y-3">
              <History className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Scan Records Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Run an article check on the Dashboard to save your investigation results here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item) => {
                const isFake = item.prediction === "FAKE";
                return (
                  <div key={item.id} className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                          isFake ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {isFake ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {item.prediction} ({item.confidence}%)
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(item.created_at || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {item.title || item.original_input}
                      </h3>
                      
                      <p className="text-xs text-slate-400 line-clamp-2 italic">
                        "{item.original_input}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setSelectedScan(item)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleBookmarkToggle(item.id)}
                        className={`p-2 rounded-xl glass-card text-xs ${
                          item.is_bookmarked ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className={`w-4 h-4 ${item.is_bookmarked ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl glass-card hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
