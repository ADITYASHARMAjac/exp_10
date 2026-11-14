package com.tournament.service;

import com.tournament.dto.ParticipantDTO;
import com.tournament.exception.ResourceNotFoundException;
import com.tournament.model.Participant;
import com.tournament.model.Tournament;
import com.tournament.repository.ParticipantRepository;
import com.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final TournamentRepository tournamentRepository;

    public ParticipantService(ParticipantRepository participantRepository,
                              TournamentRepository tournamentRepository) {
        this.participantRepository = participantRepository;
        this.tournamentRepository = tournamentRepository;
    }

    public List<Participant> getParticipants(String tournamentId) {
        return participantRepository.findByTournamentIdOrderBySeedAsc(tournamentId);
    }

    public List<Participant> getStandings(String tournamentId) {
        List<Participant> participants = participantRepository.findByTournamentId(tournamentId);
        // Sort by points desc, then goal difference desc, then scoreFor desc
        participants.sort((a, b) -> {
            if (b.getPoints() != a.getPoints()) {
                return Integer.compare(b.getPoints(), a.getPoints());
            }
            if (b.getGoalDifference() != a.getGoalDifference()) {
                return Integer.compare(b.getGoalDifference(), a.getGoalDifference());
            }
            return Integer.compare(b.getScoreFor(), a.getScoreFor());
        });
        return participants;
    }

    public Participant addParticipant(String tournamentId, ParticipantDTO dto) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + tournamentId));

        long currentCount = participantRepository.countByTournamentId(tournamentId);
        if (tournament.getMaxParticipants() != null && currentCount >= tournament.getMaxParticipants()) {
            throw new IllegalStateException("Tournament has reached maximum capacity of " + tournament.getMaxParticipants() + " participants.");
        }

        Participant participant = new Participant();
        participant.setTournamentId(tournamentId);
        participant.setName(dto.getName());
        participant.setEmail(dto.getEmail());
        participant.setAvatarUrl(dto.getAvatarUrl());
        participant.setContactInfo(dto.getContactInfo());
        participant.setSeed(dto.getSeed() != null ? dto.getSeed() : (int) (currentCount + 1));

        Participant saved = participantRepository.save(participant);

        tournament.setCurrentParticipantsCount((int) (currentCount + 1));
        tournamentRepository.save(tournament);

        return saved;
    }

    public void removeParticipant(String tournamentId, String participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found with id: " + participantId));

        participantRepository.delete(participant);

        tournamentRepository.findById(tournamentId).ifPresent(t -> {
            long remaining = participantRepository.countByTournamentId(tournamentId);
            t.setCurrentParticipantsCount((int) remaining);
            tournamentRepository.save(t);
        });
    }
}
