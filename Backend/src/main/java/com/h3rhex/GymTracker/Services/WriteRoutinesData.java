package com.h3rhex.GymTracker.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.h3rhex.GymTracker.Config.FileManager;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Map;

public class WriteRoutinesData {
    public void saveUserCalendar(String username, Map<String, String> calendario) throws IOException {
        String folderPath = FileManager.UserRoutinesPersonalFolder(username);

        if (folderPath == null) {
            throw new IOException("No se pudo obtener la carpeta del usuario");
        }

        // Eliminar el campo "username" antes de guardar
        calendario.remove("username");

        Path calendarFile = Paths.get(folderPath, "calendario.json");

        // Convertir el mapa a JSON
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(calendario);

        Files.writeString(calendarFile, json, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }
}
