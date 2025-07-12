package com.h3rhex.GymTracker.Services;

import com.h3rhex.GymTracker.Config.FileManager;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired; // Necesario para la inyección
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Necesario para el encoder
import org.springframework.stereotype.Component; // O @Service, para que Spring lo gestione


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;

@Component // Indica a Spring que esta clase es un componente y debe ser gestionada.
public class ReadUserData {
    private static final String FILE_PATH = FileManager.UserDataJson();
    private static  final Path path;

    static {
        assert FILE_PATH != null;
        path = Paths.get(FILE_PATH);
    }

    //INYECTAR passwordEncoder
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public ReadUserData(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    // Buscar usuario y compararlo
    public boolean findUserByCredentials(String username, String password) {
        try {
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()){
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonUsername = obj.getString("username");
                String jsonPassword = obj.getString("password"); // LA CONTRASEÑA ESTA ALMACENADA COMO UN HASH

                if (jsonUsername.equals(username) && passwordEncoder.matches(password, jsonPassword)) {

                    int id = obj.getInt("id");
                    return true;
                }
            }

        } catch (Exception e){
            System.err.println("❌ Error leyendo el archivo: " + e.getMessage());
            return  false;
        }
        return false;
    }

    public boolean findUserBySessionId(String sessionId) {
        try {
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonSessionId = obj.getString("sessionId");

                if (passwordEncoder.matches(sessionId, jsonSessionId)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            System.err.println("❌ Error leyendo el archivo: " + e.getMessage());
            return false;
        }
    }

    public boolean doesUsernameExist(String username) {
        try {
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonUsername = obj.getString("username");

                if (jsonUsername.equals(username)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            System.err.println("❌ Error leyendo el archivo: " + e.getMessage());
            return false;
        }
    }

    public boolean doesUserSessionIdExist(String sessionId){
        try {
            String content = new String(Files.readAllBytes(path));
            JSONObject usersJson = new JSONObject(content);

            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()){
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonSessionId = obj.getString("sessionId");
                if(passwordEncoder.matches(sessionId, jsonSessionId)){
                    return true;
                }
            }

            return false;
        } catch (Exception e){
            System.err.println("❌ Error leyendo el archivo: " + e.getMessage());
            return false;
        }
    }

}
