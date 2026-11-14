import React, { useState, useEffect } from 'react';
import { X, Trophy, Swords } from 'lucide-react';

export default function MatchScoreModal({ isOpen, onClose, match, onSaveScore }) {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isCompleted, setIsCompleted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (match) {
      setScore1(match.score1 !== null && match.score1 !== undefined ? match.score1 : 0);
      setScore2(match.score2 !== null && match.score2 !== undefined ? match.score2 : 0);
      setIsCompleted(match.status === 'COMPLETED' || match.status === 'SCHEDULED');
      setError('');
    }
  }, [match, isOpen]);

  if (!isOpen || !match) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onSaveScore(match.id, parseInt(score1) || 0, parseInt(score2) || 0, isCompleted);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update score');
    } finally {
      setLoading(false);
    }
  };

  const p1Name = match.participant1Name || 'Participant 1';
  const p2Name = match.participant2Name || 'Participant 2';

  const previewWinner = () => {
    if (score1 > score2) return p1Name;
    if (score2 > score1) return p2Name;
    return 'Draw';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Update Match Result</h3>
            <p className="text-xs text-slate-400">{match.roundName} • Match #{match.matchNumber}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Score Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
            {/* Team 1 */}
            <div>
              <p className="text-xs font-bold text-white truncate mb-2">{p1Name}</p>
              <input
                type="number"
                min="0"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                className="w-20 mx-auto text-center py-2 bg-slate-800 border border-slate-700 rounded-xl text-2xl font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Team 2 */}
            <div>
              <p className="text-xs font-bold text-white truncate mb-2">{p2Name}</p>
              <input
                type="number"
                min="0"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                className="w-20 mx-auto text-center py-2 bg-slate-800 border border-slate-700 rounded-xl text-2xl font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Winner indication */}
          <div className="flex items-center justify-between px-3 py-2 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Declared Winner:
            </span>
            <span className="font-bold text-indigo-300">{previewWinner()}</span>
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="isCompletedCheck"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="isCompletedCheck" className="text-xs text-slate-300 cursor-pointer select-none">
              Mark match as completed (advances winner in bracket)
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
