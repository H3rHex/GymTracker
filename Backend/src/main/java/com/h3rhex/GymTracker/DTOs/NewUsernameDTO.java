package com.h3rhex.GymTracker.DTOs;

public class NewUsernameDTO {
    private String oldUsername;
    private String newUsername;

    public String getOldUsername() { return oldUsername; }
    public String getNewUsername() { return newUsername; }

    public void setOldUsername(String oldUsername) { this.oldUsername = oldUsername; }
    public void setNewUsername(String newUsername) { this.newUsername = newUsername; }
}
