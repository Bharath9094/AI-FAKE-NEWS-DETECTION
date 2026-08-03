"use client";

import React, { useState } from 'react';
import { 
  FileText, Link2, Upload, ImageIcon, Mic, Globe, Sparkles, 
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { analyzeText, analyzeURL, uploadDocument, uploadOCR } from '../../lib/api';
import { PredictionResponse } from '../../types';
import { AnalysisResult } from '../../components/AnalysisResult';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'file' | 'ocr' | 'voice'>('text');
  
  // Inputs
  const [textInput, setTextInput] = useState('');
  const [headlineInput, setHeadlineInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);

  // Execution state
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const sampleFakeNews = () => {
    setTextInput("SHOCKING BREAKING NEWS: Secret Government Satellite Telepathy Network Secretly Activated World Wide Today! Pharmaceutical Giants Banned Publication Of The Cure To All Known Diseases Immediately!");
    setHeadlineInput("SHOCKING: Secret Telepathy Network Activated!");
    setActiveTab('text');
  };

  const sampleRealNews = () => {
    setTextInput("The Federal Reserve announced an interest rate adjustment following quarterly inflation metrics review. Central bank governors expressed cautious optimism about stabilizing energy commodity prices.");
    setHeadlineInput("Federal Reserve Adjusts Interest Rates Following Inflation Review");
    setActiveTab('text');
  };

  const handleVoiceRecord = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Web Speech API is not supported in your browser.");
      return;
    }
    
    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : language;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTextInput(prev => prev + " " + transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      setLoadingStage("1/4 Normalizing text and stripping noise...");
      await new Promise(r => setTimeout(r, 400));
      
      setLoadingStage("2/4 Computing TF-IDF & ML Ensemble probabilities...");
      await new Promise(r => setTimeout(r, 400));

      setLoadingStage("3/4 Invoking NVIDIA NIM Llama 3.3 LLM explanation...");

      let res: PredictionResponse;

      if (activeTab === 'text') {
        if (!textInput.trim()) throw new Error("Please enter article text to analyze.");
        res = await analyzeText(textInput, headlineInput, language);
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) throw new Error("Please enter a valid webpage URL.");
        const urlData = await analyzeURL(urlInput, language);
        res = urlData.analysis;
      } else if (activeTab === 'file') {
        if (!selectedFile) throw new Error("Please upload a PDF, DOCX, or TXT document.");
        res = await uploadDocument(selectedFile);
      } else if (activeTab === 'ocr') {
        if (!ocrFile) throw new Error("Please upload an image screenshot.");
        const ocrData = await uploadOCR(ocrFile);
        res = ocrData.analysis;
      } else {
        if (!textInput.trim()) throw new Error("No voice input recorded yet.");
        res = await analyzeText(textInput, headlineInput, language);
      }

      setLoadingStage("4/4 Cross-referencing Reuters / AP wire archives...");
      await new Promise(r => setTimeout(r, 300));

      setResult(res);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze article.");
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      
      {/* Workspace Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
            AI Verification Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze news articles, web links, documents, or screenshots in real-time.
          </p>
        </div>

        {/* Quick Sample Action Pill */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Try Quick Sample:</span>
          <button
            onClick={sampleFakeNews}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            Sample Fake News
          </button>
          <button
            onClick={sampleRealNews}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            Sample Real News
          </button>
        </div>
      </div>

      {/* Main Analysis Input Box */}
      {!result ? (
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl relative">
          
          {/* Input Type Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'text' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Article / Headline</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'url' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Paste Article URL</span>
            </button>

            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'file' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF / DOCX / TXT</span>
            </button>

            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'ocr' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image OCR Screenshot</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'voice' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Input</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl mb-6 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAnalyze} className="space-y-6">
            
            {/* 1. TEXT TAB */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Headline (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Breaking: Major Climate Summit Reaches Landmark Accord"
                    value={headlineInput}
                    onChange={(e) => setHeadlineInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Article Body Content *</label>
                  <textarea
                    rows={7}
                    placeholder="Paste the full news article text, statement, or post content here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                    required
                  />
                </div>
              </div>
            )}

            {/* 2. URL TAB */}
            {activeTab === 'url' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">News Webpage URL *</label>
                <div className="relative">
                  <Link2 className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="url"
                    placeholder="https://example-news-site.com/article/12345"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Our automated web scraper will fetch page elements, headline, and article text instantly.
                </p>
              </div>
            )}

            {/* 3. FILE TAB */}
            {activeTab === 'file' && (
              <div className="border-2 border-dashed border-white/15 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors">
                <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">
                  {selectedFile ? selectedFile.name : 'Click or Drag PDF / DOCX / TXT Document'}
                </p>
                <p className="text-xs text-slate-400 mb-4">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="doc-upload"
                />
                <label
                  htmlFor="doc-upload"
                  className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer transition-colors"
                >
                  Browse Files
                </label>
              </div>
            )}

            {/* 4. OCR TAB */}
            {activeTab === 'ocr' && (
              <div className="border-2 border-dashed border-white/15 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors">
                <ImageIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">
                  {ocrFile ? ocrFile.name : 'Upload Social Media Screenshot or Image Scan'}
                </p>
                <p className="text-xs text-slate-400 mb-4">Supported formats: PNG, JPG, JPEG, WEBP</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOcrFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="ocr-upload"
                />
                <label
                  htmlFor="ocr-upload"
                  className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer transition-colors"
                >
                  Select Image
                </label>
              </div>
            )}

            {/* 5. VOICE TAB */}
            {activeTab === 'voice' && (
              <div className="p-8 bg-slate-900/60 rounded-2xl text-center space-y-4 border border-white/5">
                <button
                  type="button"
                  onClick={handleVoiceRecord}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all ${
                    isRecording ? 'bg-rose-500 animate-pulse text-white shadow-xl shadow-rose-500/30' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
                <div>
                  <p className="text-sm font-bold text-white">
                    {isRecording ? 'Listening... Speak clearly into your microphone' : 'Click microphone to record news transcript'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Uses Web Speech API engine</p>
                </div>

                {textInput && (
                  <div className="p-4 bg-slate-950 rounded-xl text-left border border-white/5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Recorded Speech Text:</span>
                    <p className="text-xs text-slate-300 italic">{textInput}</p>
                  </div>
                )}
              </div>
            )}

            {/* Language Selector & Analyze Trigger Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              
              <div className="flex items-center space-x-2 text-xs text-slate-400 w-full sm:w-auto">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="ar">Arabic (العربية)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing AI Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Run Authenticity Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

          </form>

          {/* Progress Stage Pipeline Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 animate-pulse">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Analyzing Article Content</h3>
              <p className="text-xs text-blue-400 font-mono animate-pulse">{loadingStage}</p>
            </div>
          )}

        </div>
      ) : (
        <AnalysisResult data={result} onReset={() => setResult(null)} />
      )}

    </div>
  );
}
