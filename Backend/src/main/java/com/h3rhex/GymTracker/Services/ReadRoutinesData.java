package com.h3rhex.GymTracker.Services;

import com.h3rhex.GymTracker.Config.FileManager;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ReadRoutinesData {
        public String getUserCalendar(String username) throws IllegalAccessException, IOException {
            if (username == null || username.isBlank()) {
                throw new IllegalAccessException("Username no puede estar vacío");
            }

            String personalFolder = FileManager.UserRoutinesPersonalFolder(username);

            if (personalFolder == null) {
                throw new IOException("No se pudo obtener la carpeta personal del usuario.");
            }

            Path calendarPath = Paths.get(personalFolder, "calendario.json");

            return Files.readString(calendarPath);
        }

        public String getUserRoutine(String username) throws IllegalAccessException, IOException {
            if (username == null || username.isBlank()) {
                throw new IllegalAccessException("Username no puede estar vacío");
            }

            String personalFolder = FileManager.UserRoutinesPersonalFolder(username);

            if (personalFolder == null) {
                throw new IOException("No se pudo obtener la carpeta personal del usuario.");
            }

            Path calendarPath = Paths.get(personalFolder, "routine.json");

            return Files.readString(calendarPath);
        }

}
