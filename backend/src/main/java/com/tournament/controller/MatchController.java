package com.tournament.controller;

import com.tournament.dto.MatchScoreDTO;
import com.tournament.model.Match;
import com.tournament.service.MatchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@Tag(name = "Matches", description = "Match fixture and score tracking")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/api/tournaments/{tournamentId}/matches")
    @Operation(summary = "Get all matches for a tournament")
    public ResponseEntity<List<Match>> getMatches(@PathVariable String tournamentId) {
        return ResponseEntity.ok(matchService.getMatchesByTournament(tournamentId));
    }

    @GetMapping("/api/matches/{matchId}")
    @Operation(summary = "Get single match details by ID")
    public ResponseEntity<Match> getMatchById(@PathVariable String matchId) {
        return ResponseEntity.ok(matchService.getMatchById(matchId));
    }

    @PutMapping("/api/matches/{matchId}/score")
    @Operation(summary = "Update match score and advance winner to subsequent round")
    public ResponseEntity<Match> updateScore(
            @PathVariable String matchId,
            @Valid @RequestBody MatchScoreDTO scoreDTO) {
        Match updated = matchService.updateMatchScore(matchId, scoreDTO);
        return ResponseEntity.ok(updated);
    }
}
