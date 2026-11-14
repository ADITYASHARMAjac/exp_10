package com.tournament.repository;

import com.tournament.model.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends MongoRepository<Participant, String> {

    List<Participant> findByTournamentId(String tournamentId);

    List<Participant> findByTournamentIdOrderBySeedAsc(String tournamentId);

    List<Participant> findByTournamentIdOrderByPointsDescScoreForDesc(String tournamentId);

    long countByTournamentId(String tournamentId);

    void deleteByTournamentId(String tournamentId);
}
