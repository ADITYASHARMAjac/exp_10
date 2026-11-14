package com.tournament.controller;

import com.tournament.dto.TournamentRequestDTO;
import com.tournament.model.Match;
import com.tournament.model.Tournament;
import com.tournament.model.TournamentStatus;
import com.tournament.service.BracketGeneratorService;
import com.tournament.service.TournamentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournaments")
@CrossOrigin(origins = "*")
@Tag(name = "Tournaments", description = "CRUD operations and bracket generation for tournaments")
public class TournamentController {

    private final TournamentService tournamentService;
    private final BracketGeneratorService bracketGeneratorService;

    public TournamentController(TournamentService tournamentService,
                                BracketGeneratorService bracketGeneratorService) {
        this.tournamentService = tournamentService;
        this.bracketGeneratorService = bracketGeneratorService;
    }

    @PostMapping
    @Operation(summary = "Create a new tournament")
    public ResponseEntity<Tournament> createTournament(@Valid @RequestBody TournamentRequestDTO requestDTO) {
        Tournament created = tournamentService.createTournament(requestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List all tournaments with optional search and status filtering")
    public ResponseEntity<List<Tournament>> getAllTournaments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TournamentStatus status) {
        List<Tournament> tournaments = tournamentService.getAllTournaments(search, status);
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tournament details by ID")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable String id) {
        Tournament tournament = tournamentService.getTournamentById(id);
        return ResponseEntity.ok(tournament);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edit/Update tournament details")
    public ResponseEntity<Tournament> updateTournament(
            @PathVariable String id,
            @Valid @RequestBody TournamentRequestDTO requestDTO) {
        Tournament updated = tournamentService.updateTournament(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tournament and its associated participants and matches")
    public ResponseEntity<Map<String, String>> deleteTournament(@PathVariable String id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.ok(Map.of("message", "Tournament " + id + " and related records successfully deleted."));
    }

    @PostMapping("/{id}/generate-brackets")
    @Operation(summary = "Generate match fixtures or bracket tree for this tournament")
    public ResponseEntity<List<Match>> generateBrackets(@PathVariable String id) {
        List<Match> matches = bracketGeneratorService.generateFixtures(id);
        return ResponseEntity.ok(matches);
    }

    @PostMapping("/seed-demo")
    @Operation(summary = "Seed demo sample tournaments and matches for initial testing")
    public ResponseEntity<Map<String, String>> seedDemo() {
        tournamentService.seedDemoData();
        return ResponseEntity.ok(Map.of("message", "Sample tournaments successfully seeded!"));
    }
}
