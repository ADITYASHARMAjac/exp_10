import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import TournamentModal from './components/TournamentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { tournamentApi } from './api/tournamentApi';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard' | 'tournaments' | 'detail'
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  const [tournaments, setTournaments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [deletingTournament, setDeletingTournament] = useState(null);

  // Toast / feedback message
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadPlatformData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadPlatformData = async () => {
    try {
      setLoading(true);
      const [tList, sData] = await Promise.all([
        tournamentApi.getAll(),
        tournamentApi.getDashboardStats()
      ]);
      setTournaments(tList);
      setStats(sData);
    } catch (err) {
      console.error("Error loading tournament data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create or Update
  const handleSaveTournament = async (formData) => {
    if (editingTournament) {
      await tournamentApi.update(editingTournament.id, formData);
      showToast('Tournament updated successfully!');
    } else {
      await tournamentApi.create(formData);
      showToast('Tournament created successfully!');
    }
    await loadPlatformData();
    setEditingTournament(null);
  };

  // Delete
  const handleConfirmDelete = async (id) => {
    await tournamentApi.delete(id);
    showToast('Tournament and associated brackets removed.', 'info');
    if (selectedTournamentId === id) {
      setSelectedTournamentId(null);
      setActivePage('tournaments');
    }
    await loadPlatformData();
  };

  const handleSelectTournament = (t) => {
    setSelectedTournamentId(t.id);
    setActivePage('detail');
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs font-bold shadow-2xl transition-all animate-bounce ${
          toast.type === 'info'
            ? 'bg-amber-950/90 text-amber-200 border-amber-800'
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'detail') setSelectedTournamentId(null);
        }}
        onOpenCreateModal={() => {
          setEditingTournament(null);
          setIsModalOpen(true);
        }}
        onRefreshData={loadPlatformData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && tournaments.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-white">Loading ArenaPulse Platform...</h3>
            <p className="text-xs text-slate-400 mt-1">Connecting to tournament repositories...</p>
          </div>
        ) : (
          <>
            {activePage === 'dashboard' && (
              <DashboardPage
                stats={stats}
                tournaments={tournaments}
                onSelectTournament={handleSelectTournament}
                onOpenCreateModal={() => {
                  setEditingTournament(null);
                  setIsModalOpen(true);
                }}
                onEditTournament={(t) => {
                  setEditingTournament(t);
                  setIsModalOpen(true);
                }}
                onDeleteTournament={(t) => setDeletingTournament(t)}
                onNavigateToTournaments={() => setActivePage('tournaments')}
              />
            )}

            {activePage === 'tournaments' && (
              <TournamentsPage
                tournaments={tournaments}
                onSelectTournament={handleSelectTournament}
                onOpenCreateModal={() => {
                  setEditingTournament(null);
                  setIsModalOpen(true);
                }}
                onEditTournament={(t) => {
                  setEditingTournament(t);
                  setIsModalOpen(true);
                }}
                onDeleteTournament={(t) => setDeletingTournament(t)}
              />
            )}

            {activePage === 'detail' && selectedTournamentId && (
              <TournamentDetailPage
                tournamentId={selectedTournamentId}
                onBack={() => {
                  setSelectedTournamentId(null);
                  setActivePage('tournaments');
                }}
                onEditTournament={(t) => {
                  setEditingTournament(t);
                  setIsModalOpen(true);
                }}
                onDeleteTournament={(t) => setDeletingTournament(t)}
                onRefreshAll={loadPlatformData}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <TournamentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTournament(null);
        }}
        onSubmit={handleSaveTournament}
        initialData={editingTournament}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTournament)}
        tournament={deletingTournament}
        onClose={() => setDeletingTournament(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 ArenaPulse Tournament Engine. React + Java Spring Boot + MongoDB.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>REST API Ready</span>
            <span>•</span>
            <span>Single Elimination &amp; Round Robin</span>
            <span>•</span>
            <span>Live Brackets</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
