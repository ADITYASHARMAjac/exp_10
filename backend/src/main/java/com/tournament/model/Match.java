package com.tournament.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "matches")
public class Match {

    @Id
    private String id;

    @Indexed
    private String tournamentId;

    private Integer round;
    private Integer matchNumber;
    private String roundName; // e.g. "Quarter-Finals", "Semi-Finals", "Finals", "Round 1"

    private String participant1Id;
    private String participant1Name;
    private Integer score1;

    private String participant2Id;
    private String participant2Name;
    private Integer score2;

    private String winnerId;
    private String winnerName;

    private MatchStatus status;
    private String scheduledTime;

    // For single elimination bracket traversal
    private String nextMatchId;
    private Integer nextMatchSlot; // 1 or 2 (whether winner becomes participant 1 or 2 of next match)

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Match() {
        this.status = MatchStatus.SCHEDULED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Match(String id, String tournamentId, Integer round, Integer matchNumber, String roundName,
                 String participant1Id, String participant1Name, String participant2Id, String participant2Name,
                 String nextMatchId, Integer nextMatchSlot) {
        this.id = id;
        this.tournamentId = tournamentId;
        this.round = round;
        this.matchNumber = matchNumber;
        this.roundName = roundName;
        this.participant1Id = participant1Id;
        this.participant1Name = participant1Name;
        this.participant2Id = participant2Id;
        this.participant2Name = participant2Name;
        this.nextMatchId = nextMatchId;
        this.nextMatchSlot = nextMatchSlot;
        this.status = MatchStatus.SCHEDULED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(String tournamentId) {
        this.tournamentId = tournamentId;
    }

    public Integer getRound() {
        return round;
    }

    public void setRound(Integer round) {
        this.round = round;
    }

    public Integer getMatchNumber() {
        return matchNumber;
    }

    public void setMatchNumber(Integer matchNumber) {
        this.matchNumber = matchNumber;
    }

    public String getRoundName() {
        return roundName;
    }

    public void setRoundName(String roundName) {
        this.roundName = roundName;
    }

    public String getParticipant1Id() {
        return participant1Id;
    }

    public void setParticipant1Id(String participant1Id) {
        this.participant1Id = participant1Id;
    }

    public String getParticipant1Name() {
        return participant1Name;
    }

    public void setParticipant1Name(String participant1Name) {
        this.participant1Name = participant1Name;
    }

    public Integer getScore1() {
        return score1;
    }

    public void setScore1(Integer score1) {
        this.score1 = score1;
    }

    public String getParticipant2Id() {
        return participant2Id;
    }

    public void setParticipant2Id(String participant2Id) {
        this.participant2Id = participant2Id;
    }

    public String getParticipant2Name() {
        return participant2Name;
    }

    public void setParticipant2Name(String participant2Name) {
        this.participant2Name = participant2Name;
    }

    public Integer getScore2() {
        return score2;
    }

    public void setScore2(Integer score2) {
        this.score2 = score2;
    }

    public String getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(String winnerId) {
        this.winnerId = winnerId;
    }

    public String getWinnerName() {
        return winnerName;
    }

    public void setWinnerName(String winnerName) {
        this.winnerName = winnerName;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getNextMatchId() {
        return nextMatchId;
    }

    public void setNextMatchId(String nextMatchId) {
        this.nextMatchId = nextMatchId;
    }

    public Integer getNextMatchSlot() {
        return nextMatchSlot;
    }

    public void setNextMatchSlot(Integer nextMatchSlot) {
        this.nextMatchSlot = nextMatchSlot;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
