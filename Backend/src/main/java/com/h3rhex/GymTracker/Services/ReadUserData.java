package com.h3rhex.GymTracker.Services;

import com.h3rhex.GymTracker.Models.User;
import com.h3rhex.GymTracker.Models.Username;
import org.json.JSONObject;

import javax.swing.plaf.PanelUI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;

public class ReadUserData {
    private static final String FILE_PATH = "data/user_data.json";

    // Buscar usuario y compararlo
    public User findUserByCredentials(String username, String password) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(FILE_PATH)));
            JSONObject usersJson = new JSONObject(content);

            Iterator<String> keys = usersJson.keys();
            while (keys.hasNext()){
                String key = keys.next();
                JSONObject obj = usersJson.getJSONObject(key);

                String jsonUsername = obj.getString("username");
                String jsonPassword = obj.getString("password");

                if (jsonUsername.equals(username) && jsonPassword.equals(password)) {
                    int id = obj.getInt("id");
                    return new User(id ,jsonUsername, jsonPassword);
                }
            }

        } catch (Exception e){
            System.err.println("❌ Error leyendo el archivo: " + e.getMessage());
        }
        return null; // Para cerrar el archivo
    }

    public boolean doesUsernameExist(String username) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(FILE_PATH)));
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

}
