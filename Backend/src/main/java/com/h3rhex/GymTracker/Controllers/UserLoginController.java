package com.h3rhex.GymTracker.Controllers;

import com.h3rhex.GymTracker.DTOs.RegisterDTO;
import com.h3rhex.GymTracker.DTOs.UsernameDTO;
import com.h3rhex.GymTracker.DTOs.LoginDTO;
import com.h3rhex.GymTracker.Models.User;
import com.h3rhex.GymTracker.Services.ReadUserData;
import com.h3rhex.GymTracker.Services.WriteUserData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserLoginController {
    private final ReadUserData readUserData;
    private final WriteUserData writeUserData;

    @Autowired
    public UserLoginController(ReadUserData readUserData, WriteUserData writeUserData) {
        this.readUserData = readUserData;
        this.writeUserData = writeUserData;
    }
    /*
       Captura la petition POST con ENDPOINT (/user_login) este método se encarga de gestionar esta llamada
       comprobar que las credenciales introducidas en el paquete enviado por el formulario son correctas
       y de serlo enviara una respuesta con el código 200, y indicando que es correcto, de lo contrario
       enviara un error
    */
    @PostMapping("/user_login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO){
        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();

        User user = readUserData.findUserByCredentials(username, password);

        if (user != null) {
            //System.out.println("✅ Login exitoso para el usuario: " + user.getUsername());
            return ResponseEntity.ok("Login correcto. Bienvenido " + user.getUsername());
        } else {
            System.out.println("❌ Login fallido. Credenciales inválidas para usuario: " + username);
            // Estaría bien añadir si el usuario existe o no
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    /*
        Captura la petition POST con ENDPOINTS (/user_registration) este método se encarga
        de gestionar la llamada con los datos previamente validados tanto en el servidor como en
        el formulario respectivamente, y llama al método writeUserData, createNewUser con las credenciales
        para escribir los datos en el json de usuarios
    */

    @PostMapping("/user_registration")
    public ResponseEntity<String> registUser(@RequestBody RegisterDTO registerDTO){
        String username = registerDTO.getUsername();
        String password = registerDTO.getPassword();

        User user = writeUserData.createNewUser(username, password);

        if (user != null) {
            System.out.println("✅ Registro exitoso para el usuario: " + username);
            return ResponseEntity.ok("Usuario registrado correctamente");

        } else {
            System.out.println("❌ Error al registrar usuario: " + username);
            return ResponseEntity.badRequest().body("Error creando el usuario");
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
