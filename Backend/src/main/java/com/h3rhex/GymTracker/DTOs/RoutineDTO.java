package com.h3rhex.GymTracker.DTOs;// src/main/java/com/tu/paquete/dto/RoutineDTO.java

// No necesitas importar Map aquí a menos que tu JSON sea diferente
// y vayas a capturar los días en un Map genérico en vez de campos específicos.

import com.h3rhex.GymTracker.Models.DiaRutina;

public class RoutineDTO {
    // Esta propiedad mapea a la clave "username" de tu JSON
    private String username;

    // Estas propiedades deben mapear a las claves de los días de tu JSON ("lunes", "martes", etc.)
    private DiaRutina lunes;
    private DiaRutina martes;
    private DiaRutina miercoles;
    private DiaRutina jueves;
    private DiaRutina viernes;
    private DiaRutina sabado;
    private DiaRutina domingo;

    // --- Constructor vacío ---
    public RoutineDTO() {
    }

    // --- Getters y Setters ---
    // Son esenciales para que Jackson pueda construir el objeto.

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public DiaRutina getLunes() {
        return lunes;
    }

    public void setLunes(DiaRutina lunes) {
        this.lunes = lunes;
    }

    public DiaRutina getMartes() {
        return martes;
    }

    public void setMartes(DiaRutina martes) {
        this.martes = martes;
    }

    public DiaRutina getMiercoles() {
        return miercoles;
    }

    public void setMiercoles(DiaRutina miercoles) {
        this.miercoles = miercoles;
    }

    public DiaRutina getJueves() {
        return jueves;
    }

    public void setJueves(DiaRutina jueves) {
        this.jueves = jueves;
    }

    public DiaRutina getViernes() {
        return viernes;
    }

    public void setViernes(DiaRutina viernes) {
        this.viernes = viernes;
    }

    public DiaRutina getSabado() {
        return sabado;
    }

    public void setSabado(DiaRutina sabado) {
        this.sabado = sabado;
    }

    public DiaRutina getDomingo() {
        return domingo;
    }

    public void setDomingo(DiaRutina domingo) {
        this.domingo = domingo;
    }
}