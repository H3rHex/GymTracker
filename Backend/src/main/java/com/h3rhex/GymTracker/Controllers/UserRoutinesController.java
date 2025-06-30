package com.h3rhex.GymTracker.Controllers;


import com.h3rhex.GymTracker.DTOs.RoutineDTO;
import com.h3rhex.GymTracker.DTOs.UsernameDTO;
import com.h3rhex.GymTracker.Services.ReadRoutinesData;
import com.h3rhex.GymTracker.Services.WriteRoutinesData;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
public class UserRoutinesController {
    private final ReadRoutinesData readRoutinesData = new ReadRoutinesData();
    private final WriteRoutinesData writeRoutinesData = new WriteRoutinesData();

    @PostMapping("/get_userCalendar")
    public ResponseEntity<?> getCalendar(@RequestBody UsernameDTO usernameDTO) {
        String user = usernameDTO.getUsername();

        try {
            String calendar = readRoutinesData.getUserCalendar(user);

            if (!calendar.isBlank()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(calendar);
            } else {
                return ResponseEntity.noContent().build();
            }

        } catch (IllegalAccessException e) {
            System.out.println("Usuario no válido.");
            return ResponseEntity.badRequest().body("Usuario no válido.");
        } catch (IOException e) {
            System.out.println("Error al leer el calendario.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al leer el calendario.");
        }
    }

    @PostMapping("/save_calendar")
    public ResponseEntity<?> saveCalendar(@RequestBody Map<String, String> calendarioActualizado){
        String username = calendarioActualizado.get("username");
        if(username == null || username.isBlank()){
            return ResponseEntity.badRequest().body("❌ Username inválido");
        }

        try {
            writeRoutinesData.saveUserCalendar(username, calendarioActualizado);
            return ResponseEntity.ok("✅ Calendario guardado correctamente");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Error al guardar el calendario");
        }
    }

    @PostMapping("/get_user_routine")
    public ResponseEntity<?> getRoutine(@RequestBody UsernameDTO usernameDTO) {
        String user = usernameDTO.getUsername();

        try {
            String routine = readRoutinesData.getUserRoutine(user);

            if (!routine.isBlank()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(routine);
            } else {
                return ResponseEntity.noContent().build();
            }

        } catch (IllegalAccessException e) {
            System.out.println("Usuario no válido.");
            return ResponseEntity.badRequest().body("Usuario no válido.");
        } catch (IOException e) {
            System.out.println("Error al leer la rutina.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al leer la rutina.");
        }
    }

    @PostMapping("/save_routine")
    public ResponseEntity<?> saveRoutine(@RequestBody RoutineDTO routineDTO){
        String username = routineDTO.getUsername();
        if(username == null || username.isBlank()){
            return ResponseEntity.badRequest().body("❌ Username inválido");
        }

        try {
            writeRoutinesData.saveUserRoutine(username, routineDTO);
            return ResponseEntity.ok("✅ Calendario guardado correctamente");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Error al guardar el calendario");
        }
    }

}
