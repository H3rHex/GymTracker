package com.h3rhex.GymTracker.Controllers;

import com.h3rhex.GymTracker.DTOs.*;
import com.h3rhex.GymTracker.Services.ReadUserData;
import com.h3rhex.GymTracker.Services.WriteUserData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserLoginController {
    private final ReadUserData readUserData;
    private final WriteUserData writeUserData;

    @Autowired
    public UserLoginController(ReadUserData readUserData, WriteUserData writeUserData) { // ⬅️
        this.readUserData = readUserData;
        this.writeUserData = writeUserData;
    }
    /*
       Captura la petition POST con ENDPOINT (/user_login) este método se encarga de gestionar esta llamada
       comprobar que las credenciales introducidas en el paquete enviado por el formulario son correctas
       y de serlo enviara una respuesta con el código 200, y indicando que es correcto, de lo contrario
       enviara un error
    */
    @PostMapping("/user_login_form")
    public ResponseEntity<UserPublicDTO> loginForm(@RequestBody LoginFormDTO loginFormDTO){
        String username = loginFormDTO.getUsername();
        String password = loginFormDTO.getPassword();

        // COMPROBAR CREDENCIALES
        try{
            boolean isLoginCorrect = readUserData.findUserByCredentials(username, password);
            // Comprobar si es correcto
            if(!isLoginCorrect){
//                System.out.println("Credenciales incorrectas");
                return ResponseEntity.badRequest().body(new UserPublicDTO(
                        username,
                        null,
                        "Credenciales incorrectas para el usuario: " + username
                ));
            }
//            System.out.println("Credenciales correctas");

            // CONTINUAMOS SI LAS CREDENCIALES SON CORRECTAS

            // Declaramos él un UserPublicDto, para preparar el mensaje para el frontend creando la nueva sessionId
            UserPublicDTO userPublicDTO = writeUserData.writeNewSessionId(username);
            if(userPublicDTO != null){
//                System.out.println("Todo correcto");
                return ResponseEntity.ok(new UserPublicDTO(
                        userPublicDTO.getUsername(),
                        userPublicDTO.getSessionId(),
                        userPublicDTO.getMessage()
                ));
            } else {
                return ResponseEntity.internalServerError().body(new UserPublicDTO(
                        null,
                        null,
                        "Error durante la verificación de credenciales"
                ));
            }
        } catch (Exception e) {
            // System.err.println("Error: " + e);
            return ResponseEntity.internalServerError().body(new UserPublicDTO(
                    null,
                    null,
                    "Error durante la verificación de credenciales"
            ));
        }
    }

    @PostMapping("/user_login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        String sessionId = loginDTO.getSessionId();

        // COMPROBAR CREDENCIALES
        try {
            boolean isLoginCorrect = readUserData.findUserBySessionId(sessionId);
            if (!isLoginCorrect) {
                // System.out.println("Credenciales incorrectas");
                return ResponseEntity.badRequest().body("Session ID incorrecto: " + sessionId);
            }
            // System.out.println("Credenciales correctas");

            // CONTINUAMOS SI LAS CREDENCIALES SON CORRECTAS
            return ResponseEntity.ok("Session ID verificado correctamente: " + sessionId);

        } catch (Exception e) {
            // System.err.println("Error: " + e);
            return ResponseEntity.internalServerError().body(
                    "Error durante la verificación de credenciales"
            );
        }
    }

    /*
        Captura la petition POST con ENDPOINTS (/user_registration) este método se encarga
        de gestionar la llamada con los datos previamente validados tanto en el servidor como en
        el formulario respectivamente, y llama al método writeUserData, createNewUser con las credenciales
        para escribir los datos en el json de usuarios
    */

    @PostMapping("/user_registration")
    public ResponseEntity<UserPublicDTO> registUser(@RequestBody RegisterDTO registerDTO){
        String username = registerDTO.getUsername(); // Obtenemos el username del DTO de ENTRADA
        String password = registerDTO.getPassword(); // Obtenemos el password del DTO de ENTRADA

        UserPublicDTO userPublicDTO = writeUserData.createNewUser(username, password);

        if (userPublicDTO != null) {
            //System.out.println("✅ Registro exitoso para el usuario: " + username);
            return ResponseEntity.ok(new UserPublicDTO (
                    userPublicDTO.getUsername(),
                    userPublicDTO.getSessionId(),
                    userPublicDTO.getMessage()
            ));

        } else {
            System.out.println("❌ Error al registrar usuario: " + username);
            return ResponseEntity.badRequest().body(new UserPublicDTO(
                    null,
                    null,
                    "Error creando el usuario"
            ));
        }
    }

    /*
      Captura la petition POST con ENDPOINT (/check_username) este método se encarga de gestionar esta llamada
      comprobar que el username de la petition esta disponible de estarlo enviá un código 200 con un mensaje,
      y de no estarlo con otro (esta parte es probable que haya que rehacerla por seguridad)

      */
    @PostMapping("/check_username")
    public ResponseEntity<?> checkUsername(@RequestBody UsernameDTO usernameDTO) {
        String checkedUsername = usernameDTO.getUsername();

        boolean doesUsernameExist = readUserData.doesUsernameExist(checkedUsername);

        if (!doesUsernameExist) {
           // System.out.println("✅ Nombre de usuario disponible: " + checkedUsername);
            return ResponseEntity.ok("Username disponible");
        } else {
            System.out.println("❌ Nombre de usuario NO disponible: " + checkedUsername);
            return ResponseEntity.ok("Username en uso");
        }

    }
}
