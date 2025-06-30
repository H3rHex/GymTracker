package com.h3rhex.GymTracker.Models;

import java.util.List;

public class DiaRutina {
    // Esta propiedad debe coincidir con la clave "ejercicios" en tu JSON
    private List<Ejercicio> ejercicios;

    // --- Constructor vacío ---
    public DiaRutina() {
    }

    // --- Getter y Setter ---
    public List<Ejercicio> getEjercicios() {
        return ejercicios;
    }

    public void setEjercicios(List<Ejercicio> ejercicios) {
        this.ejercicios = ejercicios;
    }
}
