package com.tournament.repository;

import com.tournament.model.Match;
import com.tournament.model.MatchStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {

    List<Match> findByTournamentId(String tournamentId);

    List<Match> findByTournamentIdOrderByRoundAscMatchNumberAsc(String tournamentId);

    List<Match> findByTournamentIdAndRound(String tournamentId, Integer round);

    long countByTournamentId(String tournamentId);

    long countByStatus(MatchStatus status);

    void deleteByTournamentId(String tournamentId);
}
