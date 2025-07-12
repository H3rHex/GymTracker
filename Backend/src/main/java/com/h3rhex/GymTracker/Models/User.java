package com.h3rhex.GymTracker.Models;
public class User {
    private int id;
    private String username;
    private String sessionId;

    public User(int id, String username, String sessionId) {
        this.id = id;
        this.username = username;
        this.sessionId = sessionId;
    }

    // Getters y setters
    public int getId() { return id; }
    public String getUsername() { return username; }
    public String getSessionId() { return sessionId; }

    public void setId(int id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId;}
}
