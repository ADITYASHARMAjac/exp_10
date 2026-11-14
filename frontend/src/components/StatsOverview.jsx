import React from 'react';
import { Trophy, Users, Swords, CheckCircle2 } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    {
      label: 'Total Tournaments',
      value: stats?.totalTournaments ?? 0,
      subtext: `${stats?.upcomingTournaments ?? 0} upcoming`,
      icon: Trophy,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      label: 'Active Battles',
      value: stats?.activeTournaments ?? 0,
      subtext: 'Live tournaments in action',
      icon: Swords,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      label: 'Registered Teams',
      value: stats?.totalParticipants ?? 0,
      subtext: 'Players & competing rosters',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      label: 'Matches Concluded',
      value: stats?.completedMatches ?? 0,
      subtext: `Out of ${stats?.totalMatches ?? 0} total fixtures`,
      icon: CheckCircle2,
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
