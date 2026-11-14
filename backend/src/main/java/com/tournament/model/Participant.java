package com.tournament.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "participants")
public class Participant {

    @Id
    private String id;

    @Indexed
    private String tournamentId;

    private String name;
    private String email;
    private Integer seed;
    private String avatarUrl;
    private String contactInfo;

    // Stats for leaderboard / standings
    private int matchesPlayed = 0;
    private int wins = 0;
    private int losses = 0;
    private int draws = 0;
    private int points = 0;
    private int scoreFor = 0;
    private int scoreAgainst = 0;

    @CreatedDate
    private LocalDateTime registeredAt;

    public Participant() {
        this.registeredAt = LocalDateTime.now();
    }

    public Participant(String id, String tournamentId, String name, String email, Integer seed,
                       String avatarUrl, String contactInfo) {
        this.id = id;
        this.tournamentId = tournamentId;
        this.name = name;
        this.email = email;
        this.seed = seed;
        this.avatarUrl = avatarUrl;
        this.contactInfo = contactInfo;
        this.registeredAt = LocalDateTime.now();
    }

    public int getGoalDifference() {
        return scoreFor - scoreAgainst;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getSeed() {
        return seed;
    }

    public void setSeed(Integer seed) {
        this.seed = seed;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public int getMatchesPlayed() {
        return matchesPlayed;
    }

    public void setMatchesPlayed(int matchesPlayed) {
        this.matchesPlayed = matchesPlayed;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public int getDraws() {
        return draws;
    }

    public void setDraws(int draws) {
        this.draws = draws;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public int getScoreFor() {
        return scoreFor;
    }

    public void setScoreFor(int scoreFor) {
        this.scoreFor = scoreFor;
    }

    public int getScoreAgainst() {
        return scoreAgainst;
    }

    public void setScoreAgainst(int scoreAgainst) {
        this.scoreAgainst = scoreAgainst;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}
