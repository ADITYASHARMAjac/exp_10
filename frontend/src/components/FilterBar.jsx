import React from 'react';
import { Search, Filter, Layers, X } from 'lucide-react';

export default function FilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  formatFilter,
  setFormatFilter,
  onReset
}) {
  const statuses = [
    { id: '', label: 'All Statuses' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'ONGOING', label: 'Live / Ongoing' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'DRAFT', label: 'Draft' },
  ];

  const formats = [
    { id: '', label: 'All Formats' },
    { id: 'SINGLE_ELIMINATION', label: 'Single Elimination' },
    { id: 'ROUND_ROBIN', label: 'Round Robin' },
    { id: 'LEADERBOARD', label: 'Leaderboard' },
  ];

  const hasActiveFilters = Boolean(search || statusFilter || formatFilter);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 mb-6 space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournament name, sport or game, location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Format Select */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              {formats.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900">
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl border border-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Status Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1 pl-1 pr-2">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === s.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
