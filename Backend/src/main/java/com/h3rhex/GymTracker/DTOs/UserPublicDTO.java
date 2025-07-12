package com.h3rhex.GymTracker.DTOs;

public class UserPublicDTO {
    private String username;
    private String sessionId; // El sessionId que el frontend debe almacenar
    private String message;   // Mensaje de confirmación

    // Constructor
    public UserPublicDTO(String username, String sessionId, String message) {
        this.username = username;
        this.sessionId = sessionId;
        this.message = message;
    }

    // Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
