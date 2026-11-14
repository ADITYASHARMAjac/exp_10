package com.tournament.controller;

import com.tournament.dto.DashboardStatsDTO;
import com.tournament.service.TournamentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
@Tag(name = "Dashboard", description = "System-wide tournament and participation metrics")
public class DashboardController {

    private final TournamentService tournamentService;

    public DashboardController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get high-level dashboard metrics")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(tournamentService.getDashboardStats());
    }
}
