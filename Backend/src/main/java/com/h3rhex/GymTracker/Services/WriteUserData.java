package com.h3rhex.GymTracker.Services;

import com.h3rhex.GymTracker.Models.User;
import org.json.JSONObject;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Iterator;

public class WriteUserData {
    private static final String FILE_PATH = "data/user_data.json";
    private static  final Path path = Paths.get(FILE_PATH);

    public User createNewUser(String username, String password){
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
            newUser.put("password", password);

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
            return new User(newId, username, password);

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
                    obj.put("password", password);
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
            return true;
        } catch (Exception e){
            System.err.println("Error cambiando la contraseña:" + e.getMessage());
            return false;
        }
    }
}
