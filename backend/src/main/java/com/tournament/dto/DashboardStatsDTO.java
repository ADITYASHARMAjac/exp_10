package com.tournament.dto;

public class DashboardStatsDTO {

    private long totalTournaments;
    private long activeTournaments;
    private long upcomingTournaments;
    private long completedTournaments;
    private long totalParticipants;
    private long totalMatches;
    private long completedMatches;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalTournaments, long activeTournaments, long upcomingTournaments,
                             long completedTournaments, long totalParticipants, long totalMatches,
                             long completedMatches) {
        this.totalTournaments = totalTournaments;
        this.activeTournaments = activeTournaments;
        this.upcomingTournaments = upcomingTournaments;
        this.completedTournaments = completedTournaments;
        this.totalParticipants = totalParticipants;
        this.totalMatches = totalMatches;
        this.completedMatches = completedMatches;
    }

    public long getTotalTournaments() {
        return totalTournaments;
    }

    public void setTotalTournaments(long totalTournaments) {
        this.totalTournaments = totalTournaments;
    }

    public long getActiveTournaments() {
        return activeTournaments;
    }

    public void setActiveTournaments(long activeTournaments) {
        this.activeTournaments = activeTournaments;
    }

    public long getUpcomingTournaments() {
        return upcomingTournaments;
    }

    public void setUpcomingTournaments(long upcomingTournaments) {
        this.upcomingTournaments = upcomingTournaments;
    }

    public long getCompletedTournaments() {
        return completedTournaments;
    }

    public void setCompletedTournaments(long completedTournaments) {
        this.completedTournaments = completedTournaments;
    }

    public long getTotalParticipants() {
        return totalParticipants;
    }

    public void setTotalParticipants(long totalParticipants) {
        this.totalParticipants = totalParticipants;
    }

    public long getTotalMatches() {
        return totalMatches;
    }

    public void setTotalMatches(long totalMatches) {
        this.totalMatches = totalMatches;
    }

    public long getCompletedMatches() {
        return completedMatches;
    }

    public void setCompletedMatches(long completedMatches) {
        this.completedMatches = completedMatches;
    }
}
