package com.tournament.controller;

import com.tournament.dto.ParticipantDTO;
import com.tournament.model.Participant;
import com.tournament.service.ParticipantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}")
@CrossOrigin(origins = "*")
@Tag(name = "Participants", description = "Participant roster and standings management")
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping("/participants")
    @Operation(summary = "Get list of registered participants/teams")
    public ResponseEntity<List<Participant>> getParticipants(@PathVariable String tournamentId) {
        return ResponseEntity.ok(participantService.getParticipants(tournamentId));
    }

    @PostMapping("/participants")
    @Operation(summary = "Register / add a new participant/team to the tournament")
    public ResponseEntity<Participant> addParticipant(
            @PathVariable String tournamentId,
            @Valid @RequestBody ParticipantDTO dto) {
        Participant created = participantService.addParticipant(tournamentId, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/participants/{participantId}")
    @Operation(summary = "Remove a participant from the tournament")
    public ResponseEntity<Map<String, String>> removeParticipant(
            @PathVariable String tournamentId,
            @PathVariable String participantId) {
        participantService.removeParticipant(tournamentId, participantId);
        return ResponseEntity.ok(Map.of("message", "Participant successfully removed."));
    }

    @GetMapping("/standings")
    @Operation(summary = "Get current tournament standings and leaderboard")
    public ResponseEntity<List<Participant>> getStandings(@PathVariable String tournamentId) {
        return ResponseEntity.ok(participantService.getStandings(tournamentId));
    }
}
