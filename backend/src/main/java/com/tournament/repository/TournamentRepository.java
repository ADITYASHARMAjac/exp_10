package com.tournament.repository;

import com.tournament.model.Tournament;
import com.tournament.model.TournamentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends MongoRepository<Tournament, String> {

    List<Tournament> findByStatus(TournamentStatus status);

    List<Tournament> findByTitleContainingIgnoreCase(String title);

    List<Tournament> findByGameContainingIgnoreCase(String game);

    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'game': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }")
    List<Tournament> searchByKeyword(String keyword);

    long countByStatus(TournamentStatus status);
}
