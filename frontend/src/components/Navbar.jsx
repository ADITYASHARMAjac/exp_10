import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Database, Sparkles, RefreshCw, Radio } from 'lucide-react';
import { tournamentApi } from '../api/tournamentApi';

export default function Navbar({ activePage, setActivePage, onOpenCreateModal, onRefreshData }) {
  const [backendOnline, setBackendOnline] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    const isOnline = await tournamentApi.getBackendStatus();
    setBackendOnline(isOnline);
  };

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      await tournamentApi.seedDemo();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0a0e17]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActivePage('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Arena<span className="text-indigo-400">Pulse</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase font-semibold text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded-full border border-indigo-800/50">
                Spring + Mongo
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activePage === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActivePage('tournaments')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activePage === 'tournaments'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Tournaments
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend Connection Indicator */}
            <div 
              title={backendOnline ? "Spring Boot REST API & MongoDB Connected" : "Local Mock/Demo Mode (Backend offline or not yet started)"}
              className={`hidden lg:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                backendOnline
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/50 text-amber-300 border-amber-800/50'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${backendOnline ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span>{backendOnline ? 'Spring API Live' : 'Demo Fallback'}</span>
            </div>

            {/* Seed Sample Tournaments */}
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 hover:text-white transition-all disabled:opacity-50"
              title="Reset or load sample tournaments"
            >
              {seeding ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span className="hidden sm:inline">Load Sample Data</span>
            </button>

            {/* Create Tournament CTA */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Tournament</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
