package com.h3rhex.GymTracker.Controllers;

import com.h3rhex.GymTracker.DTOs.NewPasswordDTO;
import com.h3rhex.GymTracker.DTOs.NewUsernameDTO;
import com.h3rhex.GymTracker.DTOs.UsernameDTO;
import com.h3rhex.GymTracker.Services.WriteUserData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserProfileController {
    private final WriteUserData writeUserData;

    @Autowired
    public UserProfileController(WriteUserData writeUserData){
        this.writeUserData = writeUserData;
    }

    @PostMapping("/change_username")
    public ResponseEntity<?> changeUsername(@RequestBody NewUsernameDTO newUsernameDTO) {
        String oldUsername = newUsernameDTO.getOldUsername();
        String newUsername = newUsernameDTO.getNewUsername();

        boolean isChangeUsername = writeUserData.changeUsername(oldUsername, newUsername);

        if (isChangeUsername) {
            return ResponseEntity.ok("✅ Nombre de usuario cambiado con éxito.");
        } else {
            System.out.println("❌ Error al cambiar el nombre de usuario.");
            return ResponseEntity.badRequest().body("❌ Error al cambiar el nombre de usuario.");
        }
    }

    @PostMapping("/change_password")
    public ResponseEntity<?> changePassword(@RequestBody NewPasswordDTO newPasswordDTO) {
        String newPassword = newPasswordDTO.getNewPassword();
        String username = newPasswordDTO.getUsername();

        boolean isChangePassword = writeUserData.changePassword(username, newPassword);

        if (isChangePassword) {
            return ResponseEntity.ok("Contraseña cambiada con exito");
        } else {
            System.out.println("❌ Error al cambiar la contraseña.");
            return ResponseEntity.badRequest().body("❌ Error al cambiar la contraseña.");
        }
    }

    @PostMapping("/delete_account")
    public ResponseEntity<?> deleteAccount(@RequestBody UsernameDTO usernameDTO){
        String username = usernameDTO.getUsername();

        boolean isAccountDeleted = writeUserData.deleteAccount(username);

        if (isAccountDeleted){
            return ResponseEntity.ok("Cuenta eliminada con exito");
        } else {
            System.out.println("❌ Error al eliminar la cuenta de el usuario: " + username);
            return ResponseEntity.badRequest().body("❌ Error al eliminar la cuenta de el usuario: " + username);
        }
    }
}
