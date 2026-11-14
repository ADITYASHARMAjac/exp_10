package com.tournament.service;

import com.tournament.dto.MatchScoreDTO;
import com.tournament.exception.ResourceNotFoundException;
import com.tournament.model.Match;
import com.tournament.model.MatchStatus;
import com.tournament.model.Participant;
import com.tournament.model.Tournament;
import com.tournament.model.TournamentStatus;
import com.tournament.repository.MatchRepository;
import com.tournament.repository.ParticipantRepository;
import com.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final ParticipantRepository participantRepository;
    private final TournamentRepository tournamentRepository;

    public MatchService(MatchRepository matchRepository,
                        ParticipantRepository participantRepository,
                        TournamentRepository tournamentRepository) {
        this.matchRepository = matchRepository;
        this.participantRepository = participantRepository;
        this.tournamentRepository = tournamentRepository;
    }

    public List<Match> getMatchesByTournament(String tournamentId) {
        return matchRepository.findByTournamentIdOrderByRoundAscMatchNumberAsc(tournamentId);
    }

    public Match getMatchById(String matchId) {
        return matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + matchId));
    }

    public Match updateMatchScore(String matchId, MatchScoreDTO scoreDTO) {
        Match match = getMatchById(matchId);

        match.setScore1(scoreDTO.getScore1());
        match.setScore2(scoreDTO.getScore2());
        match.setUpdatedAt(LocalDateTime.now());

        if (Boolean.TRUE.equals(scoreDTO.getIsCompleted())) {
            match.setStatus(MatchStatus.COMPLETED);

            // Determine winner
            if (scoreDTO.getScore1() > scoreDTO.getScore2()) {
                match.setWinnerId(match.getParticipant1Id());
                match.setWinnerName(match.getParticipant1Name());
            } else if (scoreDTO.getScore2() > scoreDTO.getScore1()) {
                match.setWinnerId(match.getParticipant2Id());
                match.setWinnerName(match.getParticipant2Name());
            } else {
                // Draw
                match.setWinnerId(null);
                match.setWinnerName("Draw");
            }

            // If there is a next match in single elimination bracket, advance winner
            if (match.getNextMatchId() != null && match.getWinnerId() != null) {
                matchRepository.findById(match.getNextMatchId()).ifPresent(nextMatch -> {
                    if (match.getNextMatchSlot() != null && match.getNextMatchSlot() == 1) {
                        nextMatch.setParticipant1Id(match.getWinnerId());
                        nextMatch.setParticipant1Name(match.getWinnerName());
                    } else {
                        nextMatch.setParticipant2Id(match.getWinnerId());
                        nextMatch.setParticipant2Name(match.getWinnerName());
                    }
                    nextMatch.setUpdatedAt(LocalDateTime.now());
                    matchRepository.save(nextMatch);
                });
            }

            // Update participant statistics (for standings)
            updateParticipantStats(match);

            // Check if tournament has ended (all matches completed)
            checkTournamentCompletion(match.getTournamentId());
        } else {
            match.setStatus(MatchStatus.IN_PROGRESS);
        }

        return matchRepository.save(match);
    }

    private void updateParticipantStats(Match match) {
        if (match.getParticipant1Id() != null) {
            participantRepository.findById(match.getParticipant1Id()).ifPresent(p1 -> {
                p1.setMatchesPlayed(p1.getMatchesPlayed() + 1);
                p1.setScoreFor(p1.getScoreFor() + (match.getScore1() != null ? match.getScore1() : 0));
                p1.setScoreAgainst(p1.getScoreAgainst() + (match.getScore2() != null ? match.getScore2() : 0));

                if (match.getWinnerId() != null && match.getWinnerId().equals(p1.getId())) {
                    p1.setWins(p1.getWins() + 1);
                    p1.setPoints(p1.getPoints() + 3); // 3 points for win
                } else if ("Draw".equals(match.getWinnerName())) {
                    p1.setDraws(p1.getDraws() + 1);
                    p1.setPoints(p1.getPoints() + 1); // 1 point for draw
                } else {
                    p1.setLosses(p1.getLosses() + 1);
                }
                participantRepository.save(p1);
            });
        }

        if (match.getParticipant2Id() != null) {
            participantRepository.findById(match.getParticipant2Id()).ifPresent(p2 -> {
                p2.setMatchesPlayed(p2.getMatchesPlayed() + 1);
                p2.setScoreFor(p2.getScoreFor() + (match.getScore2() != null ? match.getScore2() : 0));
                p2.setScoreAgainst(p2.getScoreAgainst() + (match.getScore1() != null ? match.getScore1() : 0));

                if (match.getWinnerId() != null && match.getWinnerId().equals(p2.getId())) {
                    p2.setWins(p2.getWins() + 1);
                    p2.setPoints(p2.getPoints() + 3);
                } else if ("Draw".equals(match.getWinnerName())) {
                    p2.setDraws(p2.getDraws() + 1);
                    p2.setPoints(p2.getPoints() + 1);
                } else {
                    p2.setLosses(p2.getLosses() + 1);
                }
                participantRepository.save(p2);
            });
        }
    }

    private void checkTournamentCompletion(String tournamentId) {
        List<Match> matches = matchRepository.findByTournamentId(tournamentId);
        boolean allCompleted = !matches.isEmpty() && matches.stream()
                .allMatch(m -> m.getStatus() == MatchStatus.COMPLETED);

        if (allCompleted) {
            tournamentRepository.findById(tournamentId).ifPresent(t -> {
                t.setStatus(TournamentStatus.COMPLETED);
                t.setUpdatedAt(LocalDateTime.now());
                tournamentRepository.save(t);
            });
        }
    }
}
