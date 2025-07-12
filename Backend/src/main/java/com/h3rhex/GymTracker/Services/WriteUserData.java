package com.h3rhex.GymTracker.Services;

import com.h3rhex.GymTracker.Config.FileManager;
import com.h3rhex.GymTracker.DTOs.UserPublicDTO;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.util.Iterator;
import java.util.UUID;

@Component // Indica a Spring que esta clase es un componente y debe ser gestionada.
public class WriteUserData {
    private static final String FILE_PATH = FileManager.UserDataJson();
    private static  final Path path;

    static {
        assert FILE_PATH != null;
        path = Paths.get(FILE_PATH);
    }

    private final BCryptPasswordEncoder passwordEncoder;
    private final ReadUserData readUserData;

    @Autowired
    public WriteUserData(BCryptPasswordEncoder passwordEncoder, ReadUserData readUserData) {
        this.passwordEncoder = passwordEncoder;
        this.readUserData = readUserData;
    }

    public UserPublicDTO createNewUser(String username, String password){
        String hashPassword = passwordEncoder.encode(password); // PASSWORD_PLAIN_TEXT -> HASH + SALT
        // CREAMOS UN SESSION ID NUEVO
        String notHassedSessionId = newSessionId();
        while (readUserData.doesUserSessionIdExist(notHassedSessionId)){
            notHassedSessionId = newSessionId();
        }
        String hassedId = passwordEncoder.encode(notHassedSessionId);

        try {
            // 1 Cargar archivo en memoria y leerlo
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            // ** Como ya hemos validado los datos anteriormente no hace falta hacerlo ahora ** //

            // 2. Encontrar el siguiente id disponible
            Iterator<String> keys; //Declaramos el iterator
            int maxId = 0;
            keys = usersJson.keys();
            while(keys.hasNext()){
                int id = Integer.parseInt(keys.next());
                if (id > maxId) maxId = id;
            }
            int newId = maxId + 1;

            // 3. Crear el nuevo objeto usuario
            JSONObject newUser = new JSONObject();
            newUser.put("id", newId);
            newUser.put("username", username);
            newUser.put("password", hashPassword);
            newUser.put("sessionId", hassedId);

            // 4. Agregar nuevo usuario al objeto Json Principal (userJson)
            usersJson.put(String.valueOf(newId), newUser);
            /*
                "newId":{
                    newUser
                }
            */

            // 5. Guardar cambios
            Files.write(path, usersJson.toString(4).getBytes(), StandardOpenOption.TRUNCATE_EXISTING);

            // 6. Devolver nuevo objeto user con los nuevos datos
            return new UserPublicDTO(username, notHassedSessionId, "Usuario registrado correctamente");

        } catch (Exception e){
            System.err.println("Error creando usuario: " + e.getMessage());
            return null;
        }
    }

    public boolean changeUsername(String oldUsername, String newUsername){
        try {
            // 1 Cargar archivo en memoria y leerlo
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            // 2 Encontrar el User
            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()){
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonUsername = obj.getString("username");
                if (jsonUsername.equals(oldUsername)) {
                   obj.put("username", newUsername);
                    // Cambiar el nombre de la carpeta de rutinas del usuario
                    FileManager.ChangeUserRoutinesPersonalFolderName(oldUsername, newUsername);
                   break;
                }
            }
            Files.write(path, usersJson.toString(4).getBytes(), StandardOpenOption.TRUNCATE_EXISTING);
            return true;
        } catch (Exception e){
            System.err.println("Error cambiando nombre de usuario:" + e.getMessage());
            return false;
        }
    }

    public boolean changePassword(String username, String password){
        String hashPassword = passwordEncoder.encode(password); // PASSWORD_PLAIN_TEXT -> HASH + SALT
        try {
            // 1 Cargar archivo en memoria y leerlo
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            // 2 Encontrar el User
            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()){
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonUsername = obj.getString("username");
                if (jsonUsername.equals(username)) {
                    obj.put("password", hashPassword);
                    break;
                }
            }
            Files.write(path, usersJson.toString(4).getBytes(), StandardOpenOption.TRUNCATE_EXISTING);
            return true;
        } catch (Exception e){
            System.err.println("Error cambiando la contraseña:" + e.getMessage());
            return false;
        }
    }

    public boolean deleteAccount(String username){
        String ROUTINES_PERSONAL_FOLDER = FileManager.UserRoutinesPersonalFolder(username);
        assert ROUTINES_PERSONAL_FOLDER != null;
        Path personalPath = Path.of(ROUTINES_PERSONAL_FOLDER);

        try {
            // 1 Cargar archivo en memoria y leerlo
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            // 2 Encontrar el User
            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()){
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonUsername = obj.getString("username");
                if (jsonUsername.equals(username)) {
                    usersJson.remove(key); // ✅ Correcto
                    break;
                }
            }
            Files.write(path, usersJson.toString(4).getBytes(), StandardOpenOption.TRUNCATE_EXISTING);
            try {
                deleteDirectoryRecursively(personalPath);
            } catch (Exception e){
                System.err.println("Error eliminando la cuenta:" + e.getMessage());
                return false;
            }
            return true;
        } catch (Exception e){
            System.err.println("Error eliminando la cuenta:" + e.getMessage());
            return false;
        }
    }

    private void deleteDirectoryRecursively(Path path) throws IOException {
        if (Files.notExists(path)) return;

        if (Files.isDirectory(path)) {
            try (DirectoryStream<Path> entries = Files.newDirectoryStream(path)) {
                for (Path entry : entries) {
                    deleteDirectoryRecursively(entry);
                }
            }
        }
        Files.delete(path);
    }

    private static String newSessionId(){
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    public UserPublicDTO writeNewSessionId(String username){
        String sessionId = newSessionId();
        String hassedSessionId = passwordEncoder.encode(sessionId);

        try {
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            // Encontrar el User
            boolean userFound = false; // Flag para saber si se encontró al usuario
            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()){
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                // Asegúrate de que el campo 'username' exista antes de intentar leerlo
                if (obj.has("username") && obj.getString("username").equals(username)) {
                    obj.put("sessionId", hassedSessionId);
                    userFound = true;
                    break;
                }
            }
            if (!userFound) {
                System.err.println("❌ Error: Usuario '" + username + "' no encontrado para asignar nueva sessionId.");
                return null; // Si el usuario no se encontró, no podemos asignar sessionId
            }

            Files.write(path, usersJson.toString(4).getBytes(), StandardOpenOption.TRUNCATE_EXISTING);

            // ESCRIBIR CAMBIOS
            return new UserPublicDTO(
                    username,
                    sessionId,
                    "Sesion iniciada correctamente"
            );

        } catch (Exception e){
            System.err.println("Error asignando la nueva sessionId: " + e.getMessage());
            return null;
        }
    }
}
