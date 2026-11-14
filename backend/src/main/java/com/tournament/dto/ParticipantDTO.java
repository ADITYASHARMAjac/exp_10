package com.tournament.dto;

import jakarta.validation.constraints.NotBlank;

public class ParticipantDTO {

    @NotBlank(message = "Participant/Team name is required")
    private String name;

    private String email;
    private Integer seed;
    private String avatarUrl;
    private String contactInfo;

    public ParticipantDTO() {}

    public ParticipantDTO(String name, String email, Integer seed, String avatarUrl, String contactInfo) {
        this.name = name;
        this.email = email;
        this.seed = seed;
        this.avatarUrl = avatarUrl;
        this.contactInfo = contactInfo;
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
}
