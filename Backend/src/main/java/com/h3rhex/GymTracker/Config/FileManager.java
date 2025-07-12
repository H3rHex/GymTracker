package com.h3rhex.GymTracker.Config;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class FileManager {
    public static String UsersRoutinesFolder = (DataFolder() + "/" + "User_Routines");
    public static String DataFolder(){
        String folderNameData = "GymTracker_Data";
        File folderData = new File(folderNameData);
        File userRoutines = new File((folderData.getAbsolutePath()), "User_Routines");

        if(!folderData.exists() && !userRoutines.exists()){
            boolean created = folderData.mkdirs();
            boolean createdRoutinesFolder = userRoutines.mkdirs();
            if(!created && createdRoutinesFolder) {
                System.err.println("❌ No se pudo crear la carpeta: " + folderNameData);
                return null;
            } else {
                System.out.println("✅ Carpeta creada: " + folderData.getAbsolutePath());
            }
        } else if (!userRoutines.exists()) {
            boolean createdRoutinesFolder = userRoutines.mkdirs();

            if(!createdRoutinesFolder){
                System.err.println("❌ No se pudo crear la carpeta de rutinas");
                return null;
            } else {
                System.out.println("✅ Carpeta creada");

            }
        }
        return folderData.getAbsolutePath();
    }

    public static String UserDataJson(){
        String fileName = "user_data.json";
        String content = "{}";

        String dataFolderPath = DataFolder();
        if (dataFolderPath == null) {
            System.err.println("❌ No se encontró data folder");
            return null;
        }

        File file = new File(dataFolderPath, fileName);

        if(file.exists()){
            //System.out.println("📄 El archivo ya existe: " + file.getAbsolutePath());
            return file.getAbsolutePath();
        }

        try (FileWriter writer = new FileWriter(file)) {
            writer.write(content);
            //System.out.println("✅ Archivo creado: " + file.getAbsolutePath());
            return file.getAbsolutePath();  // ✅ Devuelve solo si todo salió bien
        } catch (IOException e) {
            System.err.println("❌ Error creando archivo: " + e.getMessage());
            return null;  // ❌ Devuelve null si hubo error
        }
    }

    public static String UserRoutinesPersonalFolder(String username){
        String folderParentPath = (UsersRoutinesFolder);

        if(folderParentPath == null){
            System.err.println("❌ No se encontró data folder");
            return null;
        }

        File userRoutinesFolder = new File(folderParentPath, username);
        if(!userRoutinesFolder.exists()){
            boolean created = userRoutinesFolder.mkdirs();
            if(!created){
                System.err.println("❌ No se pudo crear la carpeta: " + username);
                return null;
            } else {
                System.out.println("✅ Carpeta creada: " + userRoutinesFolder.getAbsolutePath());
            }
        }

        return userRoutinesFolder.getAbsolutePath();
    }

    public static String ChangeUserRoutinesPersonalFolderName(String oldUsername, String newUsername) {
        String oldFolderPath = UserRoutinesPersonalFolder(oldUsername);
        if (oldFolderPath == null) {
            System.err.println("❌ No se encontró la carpeta de rutinas del usuario: " + oldUsername);
            return null;
        }

        File oldFolder = new File(oldFolderPath);
        File newFolder = new File(oldFolder.getParent(), newUsername);

        if (oldFolder.renameTo(newFolder)) {
            System.out.println("✅ Carpeta renombrada de " + oldUsername + " a " + newUsername);
            return newFolder.getAbsolutePath();
        } else {
            System.err.println("❌ Error al renombrar la carpeta de rutinas del usuario: " + oldUsername);
            return null;
        }
    }
}
