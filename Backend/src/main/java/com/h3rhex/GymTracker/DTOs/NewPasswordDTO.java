package com.h3rhex.GymTracker.DTOs;

public class NewPasswordDTO {
    private String newPassword;
    private String username;

    public String getUsername() { return username; }
    public String getNewPassword() { return newPassword; }

    public void SetNewPassword(String newPassword) { this.newPassword = newPassword; }
    public void SetUsername(String username) { this.username = username; }
}
