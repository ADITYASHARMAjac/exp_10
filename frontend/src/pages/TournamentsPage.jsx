import React, { useState } from 'react';
import { Trophy, Plus, Layers } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import TournamentCard from '../components/TournamentCard';

export default function TournamentsPage({
  tournaments,
  onSelectTournament,
  onOpenCreateModal,
  onEditTournament,
  onDeleteTournament
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');

  const filteredTournaments = tournaments.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchGame = t.game?.toLowerCase().includes(q);
      const matchLoc = t.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchGame && !matchLoc) return false;
    }
    if (statusFilter && t.status !== statusFilter) return false;
    if (formatFilter && t.format !== formatFilter) return false;
    return true;
  });

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setFormatFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-indigo-400" />
            Tournament Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, edit, or create competitive tournaments.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Tournament</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        formatFilter={formatFilter}
        setFormatFilter={setFormatFilter}
        onReset={handleResetFilters}
      />

      {/* Grid of Tournaments */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTournaments.map(tournament => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              onSelect={onSelectTournament}
              onEdit={onEditTournament}
              onDelete={onDeleteTournament}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center mx-auto text-indigo-400 mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">No Tournaments Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1.5">
            {search || statusFilter || formatFilter
              ? "No tournaments matched your search or active filter criteria. Try resetting filters."
              : "No tournaments are registered yet in MongoDB. Create your first one to get started!"}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {(search || statusFilter || formatFilter) ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
              >
                Create Tournament Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
