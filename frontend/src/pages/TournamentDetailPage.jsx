import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit3, Trash2, Sparkles, Trophy, Calendar, MapPin, 
  Award, Users, BookOpen, Swords, Table2, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { tournamentApi } from '../api/tournamentApi';
import BracketViewer from '../components/BracketViewer';
import StandingsTable from '../components/StandingsTable';
import ParticipantManager from '../components/ParticipantManager';
import MatchScoreModal from '../components/MatchScoreModal';

export default function TournamentDetailPage({
  tournamentId,
  onBack,
  onEditTournament,
  onDeleteTournament,
  onRefreshAll
}) {
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [activeTab, setActiveTab] = useState('brackets');
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadTournamentData();
  }, [tournamentId]);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      const [tData, pData, mData, sData] = await Promise.all([
        tournamentApi.getById(tournamentId),
        tournamentApi.getParticipants(tournamentId),
        tournamentApi.getMatches(tournamentId),
        tournamentApi.getStandings(tournamentId),
      ]);
      setTournament(tData);
      setParticipants(pData);
      setMatches(mData);
      setStandings(sData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFixtures = async () => {
    try {
      setGenerating(true);
      await tournamentApi.generateBrackets(tournamentId);
      await loadTournamentData();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      alert(err.message || 'Failed to generate brackets');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddParticipant = async (dto) => {
    await tournamentApi.addParticipant(tournamentId, dto);
    await loadTournamentData();
    if (onRefreshAll) onRefreshAll();
  };

  const handleRemoveParticipant = async (participantId) => {
    await tournamentApi.removeParticipant(tournamentId, participantId);
    await loadTournamentData();
    if (onRefreshAll) onRefreshAll();
  };

  const handleSaveScore = async (matchId, score1, score2, isCompleted) => {
    await tournamentApi.updateMatchScore(matchId, score1, score2, isCompleted);
    await loadTournamentData();
    if (onRefreshAll) onRefreshAll();
  };

  if (loading || !tournament) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading tournament dashboard...</p>
      </div>
    );
  }

  const defaultBanner = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tournaments</span>
      </button>

      {/* Hero Header Card */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="relative h-60 w-full overflow-hidden bg-slate-900">
          <img
            src={tournament.bannerUrl || defaultBanner}
            alt={tournament.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = defaultBanner; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/60 to-transparent" />

          {/* Floating actions on banner */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onEditTournament(tournament)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-white/10 backdrop-blur-md transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDeleteTournament(tournament)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900/80 text-xs font-semibold text-red-200 border border-red-800/60 backdrop-blur-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          {/* Banner bottom details */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                  {tournament.game}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {tournament.format?.replace('_', ' ')}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                  tournament.status === 'ONGOING'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : tournament.status === 'COMPLETED'
                    ? 'bg-slate-800 text-slate-300 border-slate-600'
                    : 'bg-blue-950/80 text-blue-300 border-blue-700'
                }`}>
                  {tournament.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {tournament.title}
              </h1>
            </div>

            {/* Generate Brackets CTA */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateFixtures}
                disabled={generating || participants.length < 2}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title={participants.length < 2 ? "Add at least 2 participants first" : "Generate or reset brackets"}
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Generating...' : matches.length > 0 ? 'Regenerate Brackets' : 'Generate Brackets'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 border-t border-slate-800 bg-slate-900/40 text-xs">
          <div className="p-4 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Tournament Schedule</p>
              <p className="font-bold text-slate-200 mt-0.5">{tournament.startDate || 'TBA'} - {tournament.endDate || 'TBA'}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Prize Pool</p>
              <p className="font-bold text-amber-300 mt-0.5">{tournament.prizePool || 'Glory & Honor'}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Location / Realm</p>
              <p className="font-bold text-slate-200 mt-0.5 truncate">{tournament.location || 'Online'}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Roster Capacity</p>
              <p className="font-bold text-slate-200 mt-0.5">
                {participants.length} / {tournament.maxParticipants} Teams Registered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('brackets')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'brackets'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Brackets &amp; Fixtures ({matches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('participants')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'participants'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Roster &amp; Participants ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('standings')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'standings'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table2 className="w-4 h-4" />
          <span>Standings &amp; Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'rules'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Rules &amp; Guidelines</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'brackets' && (
        <BracketViewer
          matches={matches}
          format={tournament.format}
          participantCount={participants.length}
          onSelectMatch={(m) => setSelectedMatch(m)}
          onGenerateFixtures={handleGenerateFixtures}
        />
      )}

      {activeTab === 'participants' && (
        <ParticipantManager
          participants={participants}
          tournament={tournament}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
        />
      )}

      {activeTab === 'standings' && (
        <StandingsTable standings={standings} />
      )}

      {activeTab === 'rules' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-300">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Tournament Description
            </h4>
            <p>{tournament.description || 'No custom description provided for this tournament.'}</p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Official Rules &amp; Regulations
            </h4>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line font-mono text-[11px] text-slate-300">
              {tournament.rules || 'Standard rules apply. All teams must report on time. Organizers maintain discretion.'}
            </div>
          </div>
        </div>
      )}

      {/* Match Score Editor Modal */}
      <MatchScoreModal
        isOpen={Boolean(selectedMatch)}
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onSaveScore={handleSaveScore}
      />
    </div>
  );
}
