package com.tournament.dto;

import jakarta.validation.constraints.NotNull;

public class MatchScoreDTO {

    @NotNull(message = "Score for participant 1 is required")
    private Integer score1;

    @NotNull(message = "Score for participant 2 is required")
    private Integer score2;

    private Boolean isCompleted = true;

    public MatchScoreDTO() {}

    public MatchScoreDTO(Integer score1, Integer score2, Boolean isCompleted) {
        this.score1 = score1;
        this.score2 = score2;
        this.isCompleted = isCompleted;
    }

    public Integer getScore1() {
        return score1;
    }

    public void setScore1(Integer score1) {
        this.score1 = score1;
    }

    public Integer getScore2() {
        return score2;
    }

    public void setScore2(Integer score2) {
        this.score2 = score2;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
}
