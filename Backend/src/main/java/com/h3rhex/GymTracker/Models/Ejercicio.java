package com.h3rhex.GymTracker.Models;

public class Ejercicio  {
    // Estas propiedades deben coincidir con las claves del JSON para un ejercicio
    private String nombre;
    private int series;
    private int repeticiones;

    public Ejercicio(){
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getSeries() {
        return series;
    }

    public void setSeries(int series) {
        this.series = series;
    }

    public int getRepeticiones() {
        return repeticiones;
    }

    public void setRepeticiones(int repeticiones) {
        this.repeticiones = repeticiones;
    }
}

