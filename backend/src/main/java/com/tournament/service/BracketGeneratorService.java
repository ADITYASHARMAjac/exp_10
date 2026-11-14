package com.tournament.service;

import com.tournament.model.*;
import com.tournament.repository.MatchRepository;
import com.tournament.repository.ParticipantRepository;
import com.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BracketGeneratorService {

    private final MatchRepository matchRepository;
    private final ParticipantRepository participantRepository;
    private final TournamentRepository tournamentRepository;

    public BracketGeneratorService(MatchRepository matchRepository,
                                   ParticipantRepository participantRepository,
                                   TournamentRepository tournamentRepository) {
        this.matchRepository = matchRepository;
        this.participantRepository = participantRepository;
        this.tournamentRepository = tournamentRepository;
    }

    /**
     * Generates fixtures based on tournament format.
     */
    public List<Match> generateFixtures(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found with id: " + tournamentId));

        List<Participant> participants = participantRepository.findByTournamentIdOrderBySeedAsc(tournamentId);
        if (participants.size() < 2) {
            throw new IllegalStateException("At least 2 participants are required to generate tournament matches.");
        }

        // Delete existing matches for this tournament
        matchRepository.deleteByTournamentId(tournamentId);

        List<Match> generatedMatches;
        if (tournament.getFormat() == TournamentFormat.ROUND_ROBIN) {
            generatedMatches = generateRoundRobin(tournament, participants);
        } else {
            // Default to single elimination
            generatedMatches = generateSingleElimination(tournament, participants);
        }

        tournament.setStatus(TournamentStatus.ONGOING);
        tournamentRepository.save(tournament);

        return generatedMatches;
    }

    /**
     * Single Elimination Bracket generation with automatic match chaining.
     */
    private List<Match> generateSingleElimination(Tournament tournament, List<Participant> participants) {
        int participantCount = participants.size();

        // Calculate bracket size to nearest power of 2
        int bracketSize = 2;
        int totalRounds = 1;
        while (bracketSize < participantCount) {
            bracketSize *= 2;
            totalRounds++;
        }

        List<Match> allMatches = new ArrayList<>();
        Map<String, Match> matchMap = new HashMap<>();

        // Generate matches starting from Finals (round = totalRounds) down to Round 1
        // This allows backward linking (parent points to child/next match)
        for (int r = totalRounds; r >= 1; r--) {
            int matchesInRound = (int) Math.pow(2, totalRounds - r);
            String roundName = getRoundLabel(r, totalRounds);

            for (int m = 1; m <= matchesInRound; m++) {
                String matchKey = r + "_" + m;
                Match match = new Match();
                match.setId(UUID.randomUUID().toString());
                match.setTournamentId(tournament.getId());
                match.setRound(r);
                match.setMatchNumber(m);
                match.setRoundName(roundName);
                match.setStatus(MatchStatus.SCHEDULED);
                match.setCreatedAt(LocalDateTime.now());
                match.setUpdatedAt(LocalDateTime.now());

                // Link to parent (next round)
                if (r < totalRounds) {
                    int nextMatchNum = (m + 1) / 2;
                    int nextSlot = (m % 2 == 1) ? 1 : 2;
                    String parentKey = (r + 1) + "_" + nextMatchNum;
                    Match parentMatch = matchMap.get(parentKey);
                    if (parentMatch != null) {
                        match.setNextMatchId(parentMatch.getId());
                        match.setNextMatchSlot(nextSlot);
                    }
                }

                matchMap.put(matchKey, match);
            }
        }

        // Now populate Round 1 participants based on seeding
        int matchesInRound1 = bracketSize / 2;
        List<Participant> paddedParticipants = new ArrayList<>(participants);
        while (paddedParticipants.size() < bracketSize) {
            paddedParticipants.add(null); // Bye
        }

        for (int m = 1; m <= matchesInRound1; m++) {
            Match match = matchMap.get("1_" + m);
            if (match == null) continue;

            Participant p1 = (m - 1 < paddedParticipants.size()) ? paddedParticipants.get(m - 1) : null;
            Participant p2 = (bracketSize - m < paddedParticipants.size()) ? paddedParticipants.get(bracketSize - m) : null;

            if (p1 != null) {
                match.setParticipant1Id(p1.getId());
                match.setParticipant1Name(p1.getName());
            }
            if (p2 != null) {
                match.setParticipant2Id(p2.getId());
                match.setParticipant2Name(p2.getName());
            }

            // Auto-advance if one is a Bye
            if (p1 != null && p2 == null) {
                match.setScore1(1);
                match.setScore2(0);
                match.setWinnerId(p1.getId());
                match.setWinnerName(p1.getName());
                match.setStatus(MatchStatus.COMPLETED);
                propagateWinner(match, matchMap);
            } else if (p1 == null && p2 != null) {
                match.setScore1(0);
                match.setScore2(1);
                match.setWinnerId(p2.getId());
                match.setWinnerName(p2.getName());
                match.setStatus(MatchStatus.COMPLETED);
                propagateWinner(match, matchMap);
            }
        }

        allMatches.addAll(matchMap.values());
        return matchRepository.saveAll(allMatches);
    }

    private void propagateWinner(Match match, Map<String, Match> matchMap) {
        if (match.getNextMatchId() == null || match.getWinnerId() == null) return;
        for (Match candidate : matchMap.values()) {
            if (candidate.getId().equals(match.getNextMatchId())) {
                if (match.getNextMatchSlot() != null && match.getNextMatchSlot() == 1) {
                    candidate.setParticipant1Id(match.getWinnerId());
                    candidate.setParticipant1Name(match.getWinnerName());
                } else {
                    candidate.setParticipant2Id(match.getWinnerId());
                    candidate.setParticipant2Name(match.getWinnerName());
                }
                break;
            }
        }
    }

    /**
     * Round Robin schedule generator using standard cyclic pairing.
     */
    private List<Match> generateRoundRobin(Tournament tournament, List<Participant> participants) {
        List<Participant> teams = new ArrayList<>(participants);
        if (teams.size() % 2 != 0) {
            teams.add(null); // Dummy team for bye
        }

        int numTeams = teams.size();
        int numRounds = numTeams - 1;
        int matchesPerRound = numTeams / 2;

        List<Match> matches = new ArrayList<>();
        int globalMatchNum = 1;

        for (int round = 1; round <= numRounds; round++) {
            for (int i = 0; i < matchesPerRound; i++) {
                int team1Index = (round + i) % (numTeams - 1);
                int team2Index = (round + numTeams - 1 - i) % (numTeams - 1);

                if (i == 0) {
                    team2Index = numTeams - 1;
                }

                Participant p1 = teams.get(team1Index);
                Participant p2 = teams.get(team2Index);

                // If either is null, it's a bye - skip match
                if (p1 == null || p2 == null) continue;

                Match match = new Match();
                match.setId(UUID.randomUUID().toString());
                match.setTournamentId(tournament.getId());
                match.setRound(round);
                match.setMatchNumber(globalMatchNum++);
                match.setRoundName("Round " + round);
                match.setParticipant1Id(p1.getId());
                match.setParticipant1Name(p1.getName());
                match.setParticipant2Id(p2.getId());
                match.setParticipant2Name(p2.getName());
                match.setStatus(MatchStatus.SCHEDULED);
                match.setCreatedAt(LocalDateTime.now());
                match.setUpdatedAt(LocalDateTime.now());

                matches.add(match);
            }
        }

        return matchRepository.saveAll(matches);
    }

    private String getRoundLabel(int currentRound, int totalRounds) {
        int diff = totalRounds - currentRound;
        return switch (diff) {
            case 0 -> "Final";
            case 1 -> "Semi-Finals";
            case 2 -> "Quarter-Finals";
            case 3 -> "Round of 16";
            default -> "Round " + currentRound;
        };
    }
}
