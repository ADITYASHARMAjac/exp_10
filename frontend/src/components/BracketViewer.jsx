import React from 'react';
import { Trophy, CheckCircle, Clock, Edit2, Play, Sparkles } from 'lucide-react';

export default function BracketViewer({ matches, format, onSelectMatch, onGenerateFixtures, participantCount }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center mx-auto text-indigo-400 mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Fixtures Generated Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5">
          {participantCount < 2 
            ? "Register at least 2 participants/teams before generating the tournament fixtures."
            : "Generate the single-elimination bracket or round-robin match fixtures based on your current roster."}
        </p>

        {participantCount >= 2 && (
          <button
            onClick={onGenerateFixtures}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Tournament Brackets</span>
          </button>
        )}
      </div>
    );
  }

  // Group matches by round
  const roundsMap = matches.reduce((acc, m) => {
    const r = m.round || 1;
    if (!acc[r]) acc[r] = [];
    acc[r].push(m);
    return acc;
  }, {});

  const roundNumbers = Object.keys(roundsMap).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Visual Bracket Columns */}
      <div className="overflow-x-auto pb-6 pt-2">
        <div className="flex gap-8 min-w-max items-start justify-start px-2">
          {roundNumbers.map((roundNum) => {
            const roundMatches = roundsMap[roundNum];
            const roundTitle = roundMatches[0]?.roundName || `Round ${roundNum}`;

            return (
              <div key={roundNum} className="w-72 flex flex-col space-y-4">
                {/* Round Header */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-center shadow-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1.5">
                    {roundNum === roundNumbers[roundNumbers.length - 1] && (
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {roundTitle}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {roundMatches.length} {roundMatches.length === 1 ? 'Match' : 'Matches'}
                  </span>
                </div>

                {/* Match Cards in this round */}
                <div className="space-y-4">
                  {roundMatches.map((m) => {
                    const isCompleted = m.status === 'COMPLETED';
                    const isP1Winner = isCompleted && m.winnerId && m.winnerId === m.participant1Id;
                    const isP2Winner = isCompleted && m.winnerId && m.winnerId === m.participant2Id;

                    return (
                      <div
                        key={m.id}
                        onClick={() => onSelectMatch(m)}
                        className="group glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 relative"
                      >
                        {/* Match Status Bar */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                          <span className="font-semibold text-slate-500">#{m.matchNumber}</span>
                          <div className="flex items-center gap-1">
                            {isCompleted ? (
                              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                                <CheckCircle className="w-3 h-3" /> Done
                              </span>
                            ) : m.status === 'IN_PROGRESS' ? (
                              <span className="flex items-center gap-1 text-amber-400 font-bold">
                                <Play className="w-3 h-3" /> Live
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock className="w-3 h-3" /> Scheduled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Participant 1 */}
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                          isP1Winner ? 'bg-indigo-950/70 border border-indigo-700/50' : 'bg-slate-900/60'
                        }`}>
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              isP1Winner ? 'bg-indigo-400 shadow-sm shadow-indigo-400' : 'bg-slate-600'
                            }`} />
                            <span className={`text-xs truncate ${
                              isP1Winner ? 'font-bold text-white' : m.participant1Name ? 'text-slate-200' : 'text-slate-500 italic'
                            }`}>
                              {m.participant1Name || 'TBD'}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                            isP1Winner ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}>
                            {m.score1 !== null && m.score1 !== undefined ? m.score1 : '-'}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-slate-800 my-1.5" />

                        {/* Participant 2 */}
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                          isP2Winner ? 'bg-indigo-950/70 border border-indigo-700/50' : 'bg-slate-900/60'
                        }`}>
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              isP2Winner ? 'bg-indigo-400 shadow-sm shadow-indigo-400' : 'bg-slate-600'
                            }`} />
                            <span className={`text-xs truncate ${
                              isP2Winner ? 'font-bold text-white' : m.participant2Name ? 'text-slate-200' : 'text-slate-500 italic'
                            }`}>
                              {m.participant2Name || 'TBD'}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                            isP2Winner ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}>
                            {m.score2 !== null && m.score2 !== undefined ? m.score2 : '-'}
                          </span>
                        </div>

                        {/* Hover Prompt to edit score */}
                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-indigo-400">
                          <span className="truncate">
                            {m.winnerName ? `Winner: ${m.winnerName}` : 'Click to submit score'}
                          </span>
                          <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
