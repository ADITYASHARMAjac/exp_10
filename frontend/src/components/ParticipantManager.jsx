import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Mail, Shield, X, AlertCircle } from 'lucide-react';

export default function ParticipantManager({
  participants,
  tournament,
  onAddParticipant,
  onRemoveParticipant
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [seed, setSeed] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentCount = participants?.length || 0;
  const maxCapacity = tournament?.maxParticipants || 8;
  const isFull = currentCount >= maxCapacity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Participant/Team name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAddParticipant({
        name: name.trim(),
        email: email.trim(),
        seed: seed ? parseInt(seed) : currentCount + 1,
        contactInfo: contactInfo.trim()
      });
      setName('');
      setEmail('');
      setSeed('');
      setContactInfo('');
      setShowAddModal(false);
    } catch (err) {
      setError(err.message || 'Failed to add participant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Registered Teams &amp; Players ({currentCount} / {maxCapacity})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage tournament seeds and rosters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={isFull}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isFull ? 'Tournament Full' : 'Register Team / Player'}</span>
        </button>
      </div>

      {/* Participant Grid */}
      {participants && participants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {participants.map((p, idx) => (
            <div
              key={p.id}
              className="glass-card rounded-xl p-4 border border-slate-800/80 flex items-center justify-between group hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 shrink-0">
                  #{p.seed || idx + 1}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-white truncate">{p.name}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate mt-0.5">
                    {p.email ? (
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                        {p.email}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No contact specified</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemoveParticipant(p.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                title="Remove participant"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800">
          <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No Registered Participants Yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Register Team / Player" to add competing participants to this tournament.
          </p>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add Participant / Team</h3>
                <p className="text-xs text-slate-400">Add to tournament roster</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Team / Player Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sentinels, Magnus Carlsen"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Seed # (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder={String(currentCount + 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="team@domain.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Contact Info
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Discord handle, phone or captain name"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
