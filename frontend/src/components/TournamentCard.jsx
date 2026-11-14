import React from 'react';
import { Calendar, MapPin, Award, Users, Edit3, Trash2, ArrowRight } from 'lucide-react';

export default function TournamentCard({ tournament, onSelect, onEdit, onDelete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ONGOING':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Upcoming
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-700/60 text-slate-300 border border-slate-600/50">
            Concluded
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {status}
          </span>
        );
    }
  };

  const getFormatLabel = (fmt) => {
    switch (fmt) {
      case 'ROUND_ROBIN': return 'Round Robin';
      case 'LEADERBOARD': return 'Leaderboard';
      default: return 'Single Elimination';
    }
  };

  const current = tournament.currentParticipantsCount || 0;
  const max = tournament.maxParticipants || 8;
  const percentFilled = Math.min(100, Math.round((current / max) * 100));

  const defaultBanner = "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 group flex flex-col justify-between">
      {/* Banner & Badges */}
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={tournament.bannerUrl || defaultBanner}
            alt={tournament.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = defaultBanner; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-black/40" />
          
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {getStatusBadge(tournament.status)}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
              {getFormatLabel(tournament.format)}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-bold uppercase tracking-wider">
              {tournament.game}
            </span>
            {tournament.prizePool && (
              <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-800/40">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {tournament.prizePool}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 
            onClick={() => onSelect(tournament)}
            className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {tournament.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
            {tournament.description || "Exciting tournament bracket with high-stakes competitive matches."}
          </p>

          {/* Details list */}
          <div className="mt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{tournament.startDate || 'TBA'} {tournament.endDate ? `— ${tournament.endDate}` : ''}</span>
            </div>
            {tournament.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{tournament.location}</span>
              </div>
            )}
          </div>

          {/* Capacity Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Capacity
              </span>
              <span className="font-bold text-slate-200">
                {current} / {max} Teams ({percentFilled}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentFilled >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-1 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(tournament)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all"
        >
          <span>View Matches &amp; Roster</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(tournament)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Edit tournament"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(tournament)}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 border border-red-800/40 transition-colors"
            title="Delete tournament"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
