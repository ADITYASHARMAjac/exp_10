package com.tournament.service;

import com.tournament.dto.DashboardStatsDTO;
import com.tournament.dto.TournamentRequestDTO;
import com.tournament.exception.ResourceNotFoundException;
import com.tournament.model.*;
import com.tournament.repository.MatchRepository;
import com.tournament.repository.ParticipantRepository;
import com.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final ParticipantRepository participantRepository;
    private final MatchRepository matchRepository;
    private final BracketGeneratorService bracketGeneratorService;

    public TournamentService(TournamentRepository tournamentRepository,
                             ParticipantRepository participantRepository,
                             MatchRepository matchRepository,
                             BracketGeneratorService bracketGeneratorService) {
        this.tournamentRepository = tournamentRepository;
        this.participantRepository = participantRepository;
        this.matchRepository = matchRepository;
        this.bracketGeneratorService = bracketGeneratorService;
    }

    public Tournament createTournament(TournamentRequestDTO dto) {
        Tournament tournament = new Tournament();
        tournament.setTitle(dto.getTitle());
        tournament.setDescription(dto.getDescription());
        tournament.setGame(dto.getGame());
        tournament.setFormat(dto.getFormat() != null ? dto.getFormat() : TournamentFormat.SINGLE_ELIMINATION);
        tournament.setStatus(dto.getStatus() != null ? dto.getStatus() : TournamentStatus.UPCOMING);
        tournament.setStartDate(dto.getStartDate());
        tournament.setEndDate(dto.getEndDate());
        tournament.setMaxParticipants(dto.getMaxParticipants() != null ? dto.getMaxParticipants() : 8);
        tournament.setPrizePool(dto.getPrizePool());
        tournament.setLocation(dto.getLocation());
        tournament.setRules(dto.getRules());
        tournament.setBannerUrl(dto.getBannerUrl());
        tournament.setCurrentParticipantsCount(0);
        tournament.setCreatedAt(LocalDateTime.now());
        tournament.setUpdatedAt(LocalDateTime.now());

        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getAllTournaments(String search, TournamentStatus status) {
        if (search != null && !search.trim().isEmpty()) {
            return tournamentRepository.searchByKeyword(search.trim());
        }
        if (status != null) {
            return tournamentRepository.findByStatus(status);
        }
        return tournamentRepository.findAll();
    }

    public Tournament getTournamentById(String id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }

    public Tournament updateTournament(String id, TournamentRequestDTO dto) {
        Tournament tournament = getTournamentById(id);

        tournament.setTitle(dto.getTitle());
        tournament.setDescription(dto.getDescription());
        tournament.setGame(dto.getGame());
        if (dto.getFormat() != null) {
            tournament.setFormat(dto.getFormat());
        }
        if (dto.getStatus() != null) {
            tournament.setStatus(dto.getStatus());
        }
        tournament.setStartDate(dto.getStartDate());
        tournament.setEndDate(dto.getEndDate());
        if (dto.getMaxParticipants() != null) {
            tournament.setMaxParticipants(dto.getMaxParticipants());
        }
        tournament.setPrizePool(dto.getPrizePool());
        tournament.setLocation(dto.getLocation());
        tournament.setRules(dto.getRules());
        tournament.setBannerUrl(dto.getBannerUrl());
        tournament.setUpdatedAt(LocalDateTime.now());

        return tournamentRepository.save(tournament);
    }

    public void deleteTournament(String id) {
        Tournament tournament = getTournamentById(id);

        // Cascade delete all associated participants and matches
        participantRepository.deleteByTournamentId(id);
        matchRepository.deleteByTournamentId(id);
        tournamentRepository.delete(tournament);
    }

    public DashboardStatsDTO getDashboardStats() {
        long total = tournamentRepository.count();
        long active = tournamentRepository.countByStatus(TournamentStatus.ONGOING);
        long upcoming = tournamentRepository.countByStatus(TournamentStatus.UPCOMING);
        long completed = tournamentRepository.countByStatus(TournamentStatus.COMPLETED);
        long participants = participantRepository.count();
        long matches = matchRepository.count();
        long matchesDone = matchRepository.countByStatus(MatchStatus.COMPLETED);

        return new DashboardStatsDTO(total, active, upcoming, completed, participants, matches, matchesDone);
    }

    public void seedDemoData() {
        if (tournamentRepository.count() > 0) {
            return; // Already has data
        }

        // 1. Valorant Global Championship (Single Elimination, Ongoing)
        Tournament t1 = new Tournament(
                null,
                "Valorant Champions Invitational 2026",
                "Tier 1 tactical shooter championship featuring top global esports franchises.",
                "Valorant",
                TournamentFormat.SINGLE_ELIMINATION,
                TournamentStatus.ONGOING,
                "2026-11-15",
                "2026-11-20",
                8,
                8,
                "$50,000 USD",
                "Reykjavik Arena & Twitch Stream",
                "Standard 5v5 Competitive defusal rules. Best of 3 matches, Grand Final Best of 5.",
                "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
        );
        t1 = tournamentRepository.save(t1);

        String[] t1Teams = {
                "Sentinels Prime", "Fnatic Legion", "Paper Rex Elite", "DRX Titans",
                "LOUD Esports", "Team Liquid", "NRG Shock", "Leviatán Apex"
        };
        for (int i = 0; i < t1Teams.length; i++) {
            Participant p = new Participant(null, t1.getId(), t1Teams[i], "contact@" + t1Teams[i].toLowerCase().replace(" ", "") + ".gg", i + 1, null, "Team Lead: Player " + (i + 1));
            participantRepository.save(p);
        }
        bracketGeneratorService.generateFixtures(t1.getId());

        // 2. Champions League Round Robin (Football / EA Sports FC)
        Tournament t2 = new Tournament(
                null,
                "Apex FC Premier Cup",
                "Premier round-robin tournament for competitive virtual football clubs.",
                "EA Sports FC 25",
                TournamentFormat.ROUND_ROBIN,
                TournamentStatus.ONGOING,
                "2026-11-10",
                "2026-11-25",
                4,
                4,
                "$15,000 USD",
                "Online - European Server",
                "90-minute competitive matches. Win gives 3 pts, Draw gives 1 pt.",
                "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80"
        );
        t2 = tournamentRepository.save(t2);

        String[] t2Teams = {"Madrid Kings", "Manchester Storm", "Bayern Blitz", "Paris Zenith"};
        for (int i = 0; i < t2Teams.length; i++) {
            Participant p = new Participant(null, t2.getId(), t2Teams[i], "admin@" + t2Teams[i].toLowerCase().replace(" ", "") + ".org", i + 1, null, "Captain " + (i + 1));
            participantRepository.save(p);
        }
        bracketGeneratorService.generateFixtures(t2.getId());

        // 3. Upcoming Chess Masters
        Tournament t3 = new Tournament(
                null,
                "Grandmaster Rapid Chess Open",
                "World-class Swiss & Single Elimination rapid tournament for international masters.",
                "Chess",
                TournamentFormat.SINGLE_ELIMINATION,
                TournamentStatus.UPCOMING,
                "2026-12-01",
                "2026-12-05",
                16,
                2,
                "$10,000 USD",
                "Zurich Convention Hall",
                "FIDE Rapid time controls: 15 minutes + 10 seconds increment per move.",
                "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80"
        );
        t3 = tournamentRepository.save(t3);
        participantRepository.save(new Participant(null, t3.getId(), "Magnus Carlsen", "magnus@chess.com", 1, null, "Grandmaster #1"));
        participantRepository.save(new Participant(null, t3.getId(), "Hikaru Nakamura", "hikaru@chess.com", 2, null, "Grandmaster #2"));
    }
}
