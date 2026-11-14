import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800">
        <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-white">No Standings Available</h4>
        <p className="text-xs text-slate-400 mt-1">
          Standings will be updated once matches are played and scores recorded.
        </p>
      </div>
    );
  }

  const getRankBadge = (idx) => {
    switch (idx) {
      case 0:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-400/30">
            <Medal className="w-3.5 h-3.5" />
          </div>
        );
      case 1:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-300/20 text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-300/30">
            <Medal className="w-3.5 h-3.5" />
          </div>
        );
      case 2:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-700/30">
            <Medal className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return <span className="font-mono font-bold text-xs text-slate-500 pl-1.5">{idx + 1}</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Rank</th>
              <th className="py-3 px-4">Participant / Team</th>
              <th className="py-3 px-3 text-center">MP</th>
              <th className="py-3 px-3 text-center">W</th>
              <th className="py-3 px-3 text-center">D</th>
              <th className="py-3 px-3 text-center">L</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">GF</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">GA</th>
              <th className="py-3 px-3 text-center">GD</th>
              <th className="py-3 px-4 text-center font-bold text-indigo-400">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {standings.map((p, idx) => {
              const diff = (p.scoreFor || 0) - (p.scoreAgainst || 0);
              return (
                <tr
                  key={p.id}
                  className={`hover:bg-slate-800/30 transition-colors ${
                    idx === 0 ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">{getRankBadge(idx)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200 text-sm">{p.name}</div>
                    {p.email && <div className="text-[11px] text-slate-500 truncate">{p.email}</div>}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{p.matchesPlayed || 0}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">{p.wins || 0}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{p.draws || 0}</td>
                  <td className="py-3 px-3 text-center font-mono text-red-400">{p.losses || 0}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400 hidden sm:table-cell">{p.scoreFor || 0}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400 hidden sm:table-cell">{p.scoreAgainst || 0}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-300">
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-sm text-indigo-400 bg-indigo-950/40">
                    {p.points || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
