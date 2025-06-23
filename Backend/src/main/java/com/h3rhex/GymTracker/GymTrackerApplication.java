package com.h3rhex.GymTracker;

import com.h3rhex.GymTracker.Config.FileManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GymTrackerApplication {

	public static void main(String[] args) {
		//Iniciar SpringBoot
		SpringApplication.run(GymTrackerApplication.class, args);

		// Crear carpeta de datos y carpeta de User_Routines
		FileManager.DataFolder();
		// Crear user_data.json
		FileManager.UserDataJson();

	}
}
