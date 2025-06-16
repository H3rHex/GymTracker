package com.h3rhex.GymTracker.Models;

public class Username {
    private String username;
    private boolean doesUsernameExist;

    // Constructor completo
    public Username(String username, boolean doesUsernameExist) {
        this.username = username;
        this.doesUsernameExist = doesUsernameExist;
    }

    // Getters y setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean getDoesUsernameExist() {
        return doesUsernameExist;
    }

    public void setDoesUsernameExist(boolean doesUsernameExist) {
        this.doesUsernameExist = doesUsernameExist;
    }
}
