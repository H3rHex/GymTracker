// IMPORTS
import { autoLogin } from "/js/handleUserForms.js";
import { createBasicWindow } from "/js/ModalWindows/BasicWindow.js";
import { createConfirmWindow } from "/js/ModalWindows/ConfirmWindow.js";
import { createDataWindow } from "/js/ModalWindows/DataWindow.js";

export async function close_Sesion() {
    const response = await createConfirmWindow("Cerrar Sesion", "¿Estás seguro de que quieres cerrar sesión?");
    if (response === true) {
        console.log("Usuario confirmó.");
        localStorage.clear();
        window.location.href = '/';
    } else {
        console.log("Usuario canceló.");
    }
}

async function delete_account() {
    const confirmDelete = await createConfirmWindow("Eliminar Cuenta", "¿Estás seguro de que quieres eliminar tu cuenta y todos tus datos?");
    if (confirmDelete === false) {
        console.log("Usuario canceló.");
        return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
        createBasicWindow("ERROR", "No se encontró un usuario registrado.");
        return;
    }

    let password = null;
    while (!password) {
        password = await createDataWindow("Eliminar Cuenta", "Introduce tu contraseña, por favor;", "password");
        console.log(password);
        if (password === null) {
            createBasicWindow("ERROR", "No se puede continuar sin ingresar la contraseña.");
            return;
        }
        if (password.trim() === "") {
            createBasicWindow("ERROR", "No ingresaste ninguna contraseña.");
            password = null;
        }
    }

    // Verificar credenciales
    try {
        const loginRes = await fetch("/user_login_form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (!loginRes.ok) {
            const errorData = await loginRes.json();
            throw new Error(errorData.message || "Credenciales incorrectas");
        }
    } catch (err) {
        createBasicWindow("ERROR", err.message);
        return;
    }

    // Confirmación final
    const finalConfirm = await createConfirmWindow("Confirmar Eliminación", "Este es el último aviso antes de eliminar tu cuenta. ¿Estás completamente seguro?");
    if (finalConfirm === false) {
        console.log("Usuario canceló en la segunda confirmación.");
        return;
    }

    // Solicitud de eliminación
    try {
        const delRes = await fetch("/delete_account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        if (delRes.ok) {
            createBasicWindow("ÉXITO", "✅ Tu cuenta ha sido eliminada.");
            localStorage.clear();
            window.location.href = '/';
        } else {
            const errorData = await delRes.json();
            throw new Error(errorData.message || "❌ Error al eliminar tu cuenta.");
        }

    } catch (err) {
        createBasicWindow("ERROR", err.message);
    }
}

async function changeUsername() {
    const confirmChange = await createConfirmWindow("Cambiar Nombre de Usuario", "¿Estás seguro de que quieres cambiar el nombre de usuario de tu cuenta?");
    if (confirmChange === false) {
        console.log("Usuario canceló.");
        return;
    }

    let oldUsername = localStorage.getItem("username");
    if (!oldUsername) {
        createBasicWindow("ERROR", "No se encontró un usuario registrado.");
        return;
    }

    // Solicitar contraseña
    let password = null;
    while (!password) {
        password = await createDataWindow("Cambiar nombre de usuario", "Introduce tu contraseña, por favor;", "password");
        if (password === null) {
            createBasicWindow("ERROR", "No se puede continuar sin ingresar la contraseña.");
            return;
        }
        if (password.trim() === "") {
            createBasicWindow("ERROR", "No ingresaste ninguna contraseña.");
            password = null;
        }
    }

    // Verificar credenciales
    try {
        const loginRes = await fetch("/user_login_form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": oldUsername, "password": password })
        })

        if (!loginRes.ok) {
            const errorData = await loginRes.json();
            createBasicWindow("ERROR", errorData.message || "❌ Credenciales incorrectas.");
            return;
        }

    } catch (err) {
        createBasicWindow("ERROR", err.message);
        return;
    }

    // Solicitar nuevo nombre de usuario
    let newUsername = null;
    while (!newUsername) {
        newUsername = await createDataWindow("Cambiar nombre de usuario", "Introduce tu nuevo nombre de usuario, por favor;", "text");
        if (newUsername === null) {
            createBasicWindow("ERROR", "Es necesario introducir un nuevo nombre de usuario para continuar.");
            return;
        }
        if (newUsername.trim() === "") {
            createBasicWindow("ERROR", "No ingresaste ningún nombre de usuario.");
            newUsername = null;
        }
    }

    // Verifica disponibilidad
    try {
        const abilityRes = await fetch("/check_username", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": newUsername })
        })

        const checkText = await abilityRes.text();
        if (!abilityRes.ok || !checkText.includes("Username disponible")) {
            const errorData = abilityRes.ok ? { message: checkText } : await abilityRes.json();
            createBasicWindow("ERROR", errorData.message || "❌ El nombre de usuario no está disponible.");
            return;
        }

    } catch (err) {
        createBasicWindow("ERROR", err.message);
        return;
    }

    // Cambiar nombre de usuario
    try {
        const changeRes = await fetch("/change_username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "oldUsername": oldUsername, "newUsername": newUsername })
        });

        if (changeRes.ok) {
            createBasicWindow("ÉXITO", "✅ Nombre de usuario cambiado correctamente.");
            localStorage.setItem("username", newUsername);
        } else {
            const errorData = await changeRes.json();
            throw new Error(errorData.message || "❌ Error al cambiar el nombre de usuario.");
        }

    } catch (err) {
        createBasicWindow("ERROR", err.message);
    }
}

async function changePassword() {
    const confirmChange = await createConfirmWindow("Cambiar Contraseña", "¿Estás seguro de que quieres cambiar la contraseña de tu cuenta?"); // Changed prompt for changing password
    if (confirmChange === false) {
        console.log("Usuario canceló.");
        return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
        createBasicWindow("ERROR", "No se encontró un usuario registrado.");
        return;
    }

    let password = null;
    while (!password) {
        password = await createDataWindow("Cambiar contraseña", "Introduce tu contraseña, por favor;", "password");
        if (password === null) {
            createBasicWindow("ERROR", "No se puede continuar sin ingresar la contraseña.");
            return;
        }
        if (password.trim() === "") {
            createBasicWindow("ERROR", "No ingresaste ninguna contraseña.");
            password = null;
        }
    }

    // Verificar credenciales
    try {
        const loginRes = await fetch("/user_login_form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (!loginRes.ok) {
            const errorData = await loginRes.json();
            throw new Error(errorData.message || "Credenciales incorrectas");
        }
    } catch (err) {
        createBasicWindow("ERROR", err.message);
        return;
    }

    // Solicitar nueva contraseña
    let newPassword = null;
    while (!newPassword) {
        newPassword = await createDataWindow("Cambiar contraseña", "Por favor, introduce tu nueva contraseña:", "password");
        if (newPassword === null) {
            createBasicWindow("ERROR", "Es necesario introducir una nueva contraseña para continuar.");
            return;
        }
        if (newPassword.trim() === "") {
            createBasicWindow("ERROR", "No ingresaste ninguna contraseña.");
            newPassword = null;
        }
    }

    // Cambiar contraseña
    try {
        const changeRes = await fetch("/change_password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "newPassword": newPassword })
        });

    } catch (err) {
        createBasicWindow("ERROR", err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    autoLogin();

    const deleteAccountBtn = document.getElementById('deleteAccount');
    const changePasswordBtn = document.getElementById('changePassword');
    const changeUsernameBtn = document.getElementById('changeUsername');
    const closeSesionBtn = document.getElementById('closeSesion');

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => { delete_account() });
    }

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => { changePassword() });
    }

    if (changeUsernameBtn) {
        changeUsernameBtn.addEventListener('click', () => { changeUsername() });
    }

    if (closeSesionBtn) {
        closeSesionBtn.addEventListener('click', () => { close_Sesion() });
    }
});