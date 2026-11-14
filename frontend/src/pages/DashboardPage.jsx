import React from 'react';
import { Trophy, Swords, Sparkles, ArrowRight, PlusCircle, Gamepad2 } from 'lucide-react';
import StatsOverview from '../components/StatsOverview';
import TournamentCard from '../components/TournamentCard';

export default function DashboardPage({
  stats,
  tournaments,
  onSelectTournament,
  onOpenCreateModal,
  onEditTournament,
  onDeleteTournament,
  onNavigateToTournaments
}) {
  const ongoingTournaments = tournaments.filter(t => t.status === 'ONGOING');
  const upcomingTournaments = tournaments.filter(t => t.status === 'UPCOMING');

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-slate-800 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Esports &amp; Sports Tournament Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Manage, Bracket &amp; Elevate <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Any Competitive Tournament
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Full-stack tournament engine powered by React, Java Spring Boot &amp; MongoDB. 
            Generate dynamic brackets, track live scores, manage rosters, and automate standings in real time.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Tournament</span>
            </button>
            <button
              onClick={onNavigateToTournaments}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <span>Explore All Tournaments</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <StatsOverview stats={stats} />

      {/* Ongoing Tournaments */}
      {ongoingTournaments.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-emerald-400" />
                Live &amp; Ongoing Battles
              </h2>
            </div>
            <button
              onClick={onNavigateToTournaments}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all ({tournaments.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ongoingTournaments.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onSelect={onSelectTournament}
                onEdit={onEditTournament}
                onDelete={onDeleteTournament}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Tournaments */}
      {upcomingTournaments.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-indigo-400" />
              Upcoming Tournaments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingTournaments.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onSelect={onSelectTournament}
                onEdit={onEditTournament}
                onDelete={onDeleteTournament}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
