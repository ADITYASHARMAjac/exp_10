const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// In-memory / localStorage fallback store for seamless offline preview
const STORAGE_KEY_TOURNAMENTS = 'arenapulse_tournaments';
const STORAGE_KEY_PARTICIPANTS = 'arenapulse_participants';
const STORAGE_KEY_MATCHES = 'arenapulse_matches';

let isBackendAvailable = null;

async function checkBackend() {
  if (isBackendAvailable !== null) return isBackendAvailable;
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, { signal: AbortSignal.timeout(1800) });
    isBackendAvailable = res.ok;
  } catch (err) {
    isBackendAvailable = false;
  }
  return isBackendAvailable;
}

// Initial demo seed for client storage fallback
const INITIAL_DEMO_TOURNAMENTS = [
  {
    id: "tour-101",
    title: "Valorant Champions Invitational 2026",
    description: "Tier 1 tactical shooter championship featuring top global esports franchises.",
    game: "Valorant",
    format: "SINGLE_ELIMINATION",
    status: "ONGOING",
    startDate: "2026-11-15",
    endDate: "2026-11-20",
    maxParticipants: 8,
    currentParticipantsCount: 8,
    prizePool: "$50,000 USD",
    location: "Reykjavik Arena & Twitch Stream",
    rules: "Standard 5v5 Competitive defusal rules. Best of 3 matches, Grand Final Best of 5.",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "tour-102",
    title: "Apex FC Premier Cup",
    description: "Premier round-robin tournament for competitive virtual football clubs.",
    game: "EA Sports FC 25",
    format: "ROUND_ROBIN",
    status: "ONGOING",
    startDate: "2026-11-10",
    endDate: "2026-11-25",
    maxParticipants: 4,
    currentParticipantsCount: 4,
    prizePool: "$15,000 USD",
    location: "Online - European Server",
    rules: "90-minute competitive matches. Win gives 3 pts, Draw gives 1 pt.",
    bannerUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "tour-103",
    title: "Grandmaster Rapid Chess Open",
    description: "World-class Swiss & Single Elimination rapid tournament for international masters.",
    game: "Chess",
    format: "SINGLE_ELIMINATION",
    status: "UPCOMING",
    startDate: "2026-12-01",
    endDate: "2026-12-05",
    maxParticipants: 16,
    currentParticipantsCount: 4,
    prizePool: "$10,000 USD",
    location: "Zurich Convention Hall",
    rules: "FIDE Rapid time controls: 15 minutes + 10 seconds increment per move.",
    bannerUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_DEMO_PARTICIPANTS = [
  // Tour 101 participants
  { id: "p1", tournamentId: "tour-101", name: "Sentinels Prime", email: "sentinels@gg.com", seed: 1, wins: 1, losses: 0, draws: 0, points: 3, scoreFor: 2, scoreAgainst: 0, matchesPlayed: 1 },
  { id: "p2", tournamentId: "tour-101", name: "Fnatic Legion", email: "fnatic@gg.com", seed: 2, wins: 1, losses: 0, draws: 0, points: 3, scoreFor: 2, scoreAgainst: 1, matchesPlayed: 1 },
  { id: "p3", tournamentId: "tour-101", name: "Paper Rex Elite", email: "prx@gg.com", seed: 3, wins: 0, losses: 0, draws: 0, points: 0, scoreFor: 0, scoreAgainst: 0, matchesPlayed: 0 },
  { id: "p4", tournamentId: "tour-101", name: "DRX Titans", email: "drx@gg.com", seed: 4, wins: 0, losses: 0, draws: 0, points: 0, scoreFor: 0, scoreAgainst: 0, matchesPlayed: 0 },
  { id: "p5", tournamentId: "tour-101", name: "LOUD Esports", email: "loud@gg.com", seed: 5, wins: 0, losses: 0, draws: 0, points: 0, scoreFor: 0, scoreAgainst: 0, matchesPlayed: 0 },
  { id: "p6", tournamentId: "tour-101", name: "Team Liquid", email: "liquid@gg.com", seed: 6, wins: 0, losses: 0, draws: 0, points: 0, scoreFor: 0, scoreAgainst: 0, matchesPlayed: 0 },
  { id: "p7", tournamentId: "tour-101", name: "NRG Shock", email: "nrg@gg.com", seed: 7, wins: 0, losses: 1, draws: 0, points: 0, scoreFor: 1, scoreAgainst: 2, matchesPlayed: 1 },
  { id: "p8", tournamentId: "tour-101", name: "Leviatán Apex", email: "lev@gg.com", seed: 8, wins: 0, losses: 1, draws: 0, points: 0, scoreFor: 0, scoreAgainst: 2, matchesPlayed: 1 },

  // Tour 102 participants
  { id: "p10", tournamentId: "tour-102", name: "Madrid Kings", email: "madrid@fc.com", seed: 1, wins: 2, losses: 0, draws: 0, points: 6, scoreFor: 5, scoreAgainst: 1, matchesPlayed: 2 },
  { id: "p11", tournamentId: "tour-102", name: "Manchester Storm", email: "manc@fc.com", seed: 2, wins: 1, losses: 1, draws: 0, points: 3, scoreFor: 3, scoreAgainst: 3, matchesPlayed: 2 },
  { id: "p12", tournamentId: "tour-102", name: "Bayern Blitz", email: "bayern@fc.com", seed: 3, wins: 0, losses: 1, draws: 1, points: 1, scoreFor: 2, scoreAgainst: 4, matchesPlayed: 2 },
  { id: "p13", tournamentId: "tour-102", name: "Paris Zenith", email: "paris@fc.com", seed: 4, wins: 0, losses: 1, draws: 1, points: 1, scoreFor: 1, scoreAgainst: 3, matchesPlayed: 2 }
];

const INITIAL_DEMO_MATCHES = [
  // Tour 101: Quarter-Finals (Round 1)
  {
    id: "m1", tournamentId: "tour-101", round: 1, matchNumber: 1, roundName: "Quarter-Finals",
    participant1Id: "p1", participant1Name: "Sentinels Prime", score1: 2,
    participant2Id: "p8", participant2Name: "Leviatán Apex", score2: 0,
    winnerId: "p1", winnerName: "Sentinels Prime", status: "COMPLETED",
    nextMatchId: "m5", nextMatchSlot: 1
  },
  {
    id: "m2", tournamentId: "tour-101", round: 1, matchNumber: 2, roundName: "Quarter-Finals",
    participant1Id: "p4", participant1Name: "DRX Titans", score1: null,
    participant2Id: "p5", participant2Name: "LOUD Esports", score2: null,
    winnerId: null, winnerName: null, status: "SCHEDULED",
    nextMatchId: "m5", nextMatchSlot: 2
  },
  {
    id: "m3", tournamentId: "tour-101", round: 1, matchNumber: 3, roundName: "Quarter-Finals",
    participant1Id: "p2", participant1Name: "Fnatic Legion", score1: 2,
    participant2Id: "p7", participant2Name: "NRG Shock", score2: 1,
    winnerId: "p2", winnerName: "Fnatic Legion", status: "COMPLETED",
    nextMatchId: "m6", nextMatchSlot: 1
  },
  {
    id: "m4", tournamentId: "tour-101", round: 1, matchNumber: 4, roundName: "Quarter-Finals",
    participant1Id: "p3", participant1Name: "Paper Rex Elite", score1: null,
    participant2Id: "p6", participant2Name: "Team Liquid", score2: null,
    winnerId: null, winnerName: null, status: "SCHEDULED",
    nextMatchId: "m6", nextMatchSlot: 2
  },
  // Tour 101: Semi-Finals (Round 2)
  {
    id: "m5", tournamentId: "tour-101", round: 2, matchNumber: 1, roundName: "Semi-Finals",
    participant1Id: "p1", participant1Name: "Sentinels Prime", score1: null,
    participant2Id: null, participant2Name: "TBD", score2: null,
    winnerId: null, winnerName: null, status: "SCHEDULED",
    nextMatchId: "m7", nextMatchSlot: 1
  },
  {
    id: "m6", tournamentId: "tour-101", round: 2, matchNumber: 2, roundName: "Semi-Finals",
    participant1Id: "p2", participant1Name: "Fnatic Legion", score1: null,
    participant2Id: null, participant2Name: "TBD", score2: null,
    winnerId: null, winnerName: null, status: "SCHEDULED",
    nextMatchId: "m7", nextMatchSlot: 2
  },
  // Tour 101: Finals (Round 3)
  {
    id: "m7", tournamentId: "tour-101", round: 3, matchNumber: 1, roundName: "Final",
    participant1Id: null, participant1Name: "TBD", score1: null,
    participant2Id: null, participant2Name: "TBD", score2: null,
    winnerId: null, winnerName: null, status: "SCHEDULED",
    nextMatchId: null, nextMatchSlot: null
  }
];

function getStored(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

// API methods with graceful fallback
export const tournamentApi = {
  getBackendStatus: async () => {
    return await checkBackend();
  },

  // 1. Tournaments CRUD
  getAll: async (search = '', status = '') => {
    if (await checkBackend()) {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const res = await fetch(`${API_BASE_URL}/tournaments?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tournaments');
      return await res.json();
    } else {
      let list = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(t => t.title.toLowerCase().includes(q) || t.game.toLowerCase().includes(q));
      }
      if (status) {
        list = list.filter(t => t.status === status);
      }
      return list;
    }
  },

  getById: async (id) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${id}`);
      if (!res.ok) throw new Error('Tournament not found');
      return await res.json();
    } else {
      const list = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      const item = list.find(t => t.id === id);
      if (!item) throw new Error('Tournament not found');
      return item;
    }
  },

  create: async (data) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create tournament');
      }
      return await res.json();
    } else {
      const list = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      const newTournament = {
        ...data,
        id: 'tour-' + Date.now(),
        currentParticipantsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      list.unshift(newTournament);
      setStored(STORAGE_KEY_TOURNAMENTS, list);
      return newTournament;
    }
  },

  update: async (id, data) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update tournament');
      }
      return await res.json();
    } else {
      const list = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      const idx = list.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Tournament not found');
      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      setStored(STORAGE_KEY_TOURNAMENTS, list);
      return list[idx];
    }
  },

  delete: async (id) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete tournament');
      return await res.json();
    } else {
      let list = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      list = list.filter(t => t.id !== id);
      setStored(STORAGE_KEY_TOURNAMENTS, list);

      let parts = getStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS);
      parts = parts.filter(p => p.tournamentId !== id);
      setStored(STORAGE_KEY_PARTICIPANTS, parts);

      let matches = getStored(STORAGE_KEY_MATCHES, INITIAL_DEMO_MATCHES);
      matches = matches.filter(m => m.tournamentId !== id);
      setStored(STORAGE_KEY_MATCHES, matches);

      return { message: 'Tournament deleted' };
    }
  },

  // 2. Bracket generation
  generateBrackets: async (id) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${id}/generate-brackets`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to generate brackets');
      }
      return await res.json();
    } else {
      // Local generator simulation
      const participants = getStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS).filter(p => p.tournamentId === id);
      if (participants.length < 2) throw new Error("At least 2 participants required to generate matches.");

      const newMatches = [
        {
          id: 'gen-m1', tournamentId: id, round: 1, matchNumber: 1, roundName: "Semi-Finals",
          participant1Id: participants[0]?.id, participant1Name: participants[0]?.name, score1: null,
          participant2Id: participants[1]?.id, participant2Name: participants[1]?.name, score2: null,
          winnerId: null, winnerName: null, status: "SCHEDULED", nextMatchId: "gen-m3", nextMatchSlot: 1
        },
        {
          id: 'gen-m2', tournamentId: id, round: 1, matchNumber: 2, roundName: "Semi-Finals",
          participant1Id: participants[2]?.id || null, participant1Name: participants[2]?.name || "TBD", score1: null,
          participant2Id: participants[3]?.id || null, participant2Name: participants[3]?.name || "TBD", score2: null,
          winnerId: null, winnerName: null, status: "SCHEDULED", nextMatchId: "gen-m3", nextMatchSlot: 2
        },
        {
          id: 'gen-m3', tournamentId: id, round: 2, matchNumber: 1, roundName: "Final",
          participant1Id: null, participant1Name: "TBD", score1: null,
          participant2Id: null, participant2Name: "TBD", score2: null,
          winnerId: null, winnerName: null, status: "SCHEDULED", nextMatchId: null, nextMatchSlot: null
        }
      ];

      let allMatches = getStored(STORAGE_KEY_MATCHES, INITIAL_DEMO_MATCHES).filter(m => m.tournamentId !== id);
      allMatches = [...allMatches, ...newMatches];
      setStored(STORAGE_KEY_MATCHES, allMatches);

      // update tournament status to ONGOING
      let tourList = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      const tIdx = tourList.findIndex(t => t.id === id);
      if (tIdx >= 0) {
        tourList[tIdx].status = "ONGOING";
        setStored(STORAGE_KEY_TOURNAMENTS, tourList);
      }

      return newMatches;
    }
  },

  // 3. Participants
  getParticipants: async (tournamentId) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/participants`);
      if (!res.ok) throw new Error('Failed to fetch participants');
      return await res.json();
    } else {
      const all = getStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS);
      return all.filter(p => p.tournamentId === tournamentId);
    }
  },

  addParticipant: async (tournamentId, data) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add participant');
      }
      return await res.json();
    } else {
      const all = getStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS);
      const current = all.filter(p => p.tournamentId === tournamentId);
      const newPart = {
        ...data,
        id: 'p-' + Date.now(),
        tournamentId,
        seed: data.seed || (current.length + 1),
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        scoreFor: 0,
        scoreAgainst: 0,
        registeredAt: new Date().toISOString()
      };
      all.push(newPart);
      setStored(STORAGE_KEY_PARTICIPANTS, all);

      // increment currentParticipantsCount
      const tours = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      const t = tours.find(x => x.id === tournamentId);
      if (t) {
        t.currentParticipantsCount = (t.currentParticipantsCount || 0) + 1;
        setStored(STORAGE_KEY_TOURNAMENTS, tours);
      }

      return newPart;
    }
  },

  removeParticipant: async (tournamentId, participantId) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/participants/${participantId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove participant');
      return await res.json();
    } else {
      let all = getStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS);
      all = all.filter(p => p.id !== participantId);
      setStored(STORAGE_KEY_PARTICIPANTS, all);

      const tours = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      const t = tours.find(x => x.id === tournamentId);
      if (t && t.currentParticipantsCount > 0) {
        t.currentParticipantsCount -= 1;
        setStored(STORAGE_KEY_TOURNAMENTS, tours);
      }
      return { message: 'Participant removed' };
    }
  },

  // 4. Matches
  getMatches: async (tournamentId) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/matches`);
      if (!res.ok) throw new Error('Failed to fetch matches');
      return await res.json();
    } else {
      const all = getStored(STORAGE_KEY_MATCHES, INITIAL_DEMO_MATCHES);
      return all.filter(m => m.tournamentId === tournamentId);
    }
  },

  updateMatchScore: async (matchId, score1, score2, isCompleted = true) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/matches/${matchId}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score1: Number(score1), score2: Number(score2), isCompleted }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update score');
      }
      return await res.json();
    } else {
      const all = getStored(STORAGE_KEY_MATCHES, INITIAL_DEMO_MATCHES);
      const match = all.find(m => m.id === matchId);
      if (!match) throw new Error('Match not found');

      match.score1 = Number(score1);
      match.score2 = Number(score2);
      if (isCompleted) {
        match.status = "COMPLETED";
        if (score1 > score2) {
          match.winnerId = match.participant1Id;
          match.winnerName = match.participant1Name;
        } else if (score2 > score1) {
          match.winnerId = match.participant2Id;
          match.winnerName = match.participant2Name;
        } else {
          match.winnerId = null;
          match.winnerName = "Draw";
        }

        // Propagate to next match
        if (match.nextMatchId && match.winnerId) {
          const nextM = all.find(m => m.id === match.nextMatchId);
          if (nextM) {
            if (match.nextMatchSlot === 1) {
              nextM.participant1Id = match.winnerId;
              nextM.participant1Name = match.winnerName;
            } else {
              nextM.participant2Id = match.winnerId;
              nextM.participant2Name = match.winnerName;
            }
          }
        }
      }
      setStored(STORAGE_KEY_MATCHES, all);
      return match;
    }
  },

  // 5. Standings
  getStandings: async (tournamentId) => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/standings`);
      if (!res.ok) throw new Error('Failed to fetch standings');
      return await res.json();
    } else {
      const parts = getStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS).filter(p => p.tournamentId === tournamentId);
      return parts.sort((a, b) => (b.points || 0) - (a.points || 0));
    }
  },

  // 6. Dashboard Stats
  getDashboardStats: async () => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return await res.json();
    } else {
      const tours = getStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      const parts = getStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS);
      const matches = getStored(STORAGE_KEY_MATCHES, INITIAL_DEMO_MATCHES);
      return {
        totalTournaments: tours.length,
        activeTournaments: tours.filter(t => t.status === 'ONGOING').length,
        upcomingTournaments: tours.filter(t => t.status === 'UPCOMING').length,
        completedTournaments: tours.filter(t => t.status === 'COMPLETED').length,
        totalParticipants: parts.length,
        totalMatches: matches.length,
        completedMatches: matches.filter(m => m.status === 'COMPLETED').length,
      };
    }
  },

  // 7. Seed Demo Data
  seedDemo: async () => {
    if (await checkBackend()) {
      const res = await fetch(`${API_BASE_URL}/tournaments/seed-demo`, { method: 'POST' });
      return await res.json();
    } else {
      setStored(STORAGE_KEY_TOURNAMENTS, INITIAL_DEMO_TOURNAMENTS);
      setStored(STORAGE_KEY_PARTICIPANTS, INITIAL_DEMO_PARTICIPANTS);
      setStored(STORAGE_KEY_MATCHES, INITIAL_DEMO_MATCHES);
      return { message: "Demo data reset" };
    }
  }
};
