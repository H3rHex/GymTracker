function close_Sesion() {
    if (confirm("Vas a cerrar sesion ¿Estás seguro?")) {
        // El usuario hizo clic en "Aceptar"
        console.log("Usuario confirmó.");
        localStorage.clear();
    } else {
        // El usuario hizo clic en "Cancelar"
        console.log("Usuario canceló.");
    }
}

async function delete_account() {
    if (!confirm("Vas a eliminar tu cuenta y todos tus datos. ¿Estás seguro?")) {
        console.log("Usuario canceló.");
        return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
        alert("No se encontró un usuario registrado.");
        return;
    }

    let password = null;
    while (!password) {
        password = prompt("Por favor, ingresa tu contraseña:");
        if (password === null) {
            alert("No se puede continuar sin ingresar la contraseña.");
            return;
        }
        if (password.trim() === "") {
            alert("No ingresaste ninguna contraseña.");
            password = null;
        }
    }

    // Verificar credenciales
    try {
        const loginRes = await fetch("/user_login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (!loginRes.ok) {
            throw new Error("Credenciales incorrectas");
        }
    } catch (err) {
        alert(err.message);
        return;
    }


    // Confirmación final
    if (!confirm("Este es el último aviso antes de eliminar tu cuenta. ¿Estás completamente seguro?")) {
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
            alert("✅ Tu cuenta ha sido eliminada.");
            localStorage.clear();
            window.location.href = '/';
        } else {
            throw new Error("❌ Error al eliminar tu cuenta.");
        }

    } catch (err) {
        alert("❌ Ocurrió un error al eliminar tu cuenta: " + err.message);
    }
}

async function changeUsername() {
    if (!confirm("Vas a cambiar el nombre de usuario de tu cuenta. ¿Estás seguro?")) {
        console.log("Usuario canceló.");
        return;
    }

    let oldUsername = localStorage.getItem("username");
    if (!oldUsername) {
        alert("No se encontró un usuario en registrado.");
        return;
    }

    // Solicitar contraseña
    let password = null;
    while (!password) {
        password = prompt("Por favor, ingresa tu contraseña:");
        if (password === null) {
            alert("No se puede continuar sin ingresar la contraseña.");
            return;
        }
        if (password.trim() === "") {
            alert("No ingresaste ninguna contraseña.");
            password = null;
        }
    }

    // Verificar credenciales
    try {
        const loginRes = await fetch("/user_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": oldUsername, "password": password })
        })

        if (!loginRes.ok) {
            alert("❌ Credenciales incorrectas.");
            return;
        }

    } catch (err) {
        alert("❌ Error en la verificación: " + err.message);
        return;
    }

    // Solicitar nuevo nombre de usuario
    let newUsername = null;
    while (!newUsername) {
        newUsername = prompt("Por favor, introduce tu nuevo nombre de usuario:");
        if (newUsername === null) {
            alert("Es necesario introducir un nuevo nombre de usuario para continuar.");
            return;
        }
        if (newUsername.trim() === "") {
            alert("No ingresaste ningun nombre de usuario.");
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
        if (!checkText.includes("Username disponible")) {
            alert("❌ El nombre de usuario no está disponible.");
            return;
        }

    } catch (err) {
        alert("❌ Error al verificar disponibilidad: " + err.message);
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
            alert("✅ Nombre de usuario cambiado correctamente.");
            localStorage.setItem("username", newUsername);
        } else {
            throw new Error("❌ Error al cambiar el nombre de usuario.");
        }

    } catch (err) {
        alert(err.message);
    }
}

async function changePassword() {
    if (!confirm("Vas a cambiar el nombre de usuario de tu cuenta. ¿Estás seguro?")) {
        console.log("Usuario canceló.");
        return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
        alert("No se encontró un usuario en registrado.");
        return;
    }

    let password = null;
    while (!password) {
        password = prompt("Por favor, ingresa tu contraseña:");
        if (password === null) {
            alert("No se puede continuar sin ingresar la contraseña.");
            return;
        }
        if (password.trim() === "") {
            alert("No ingresaste ninguna contraseña.");
            password = null;
        }
    }

    // Verificar credenciales
    try {
        const loginRes = await fetch("/user_login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (!loginRes.ok) {
            throw new Error("Credenciales incorrectas");
        }
    } catch (err) {
        alert(err.message);
        return;
    }

    // Solicitar nueva contraseña
    let newPassword = null;
    while (!newPassword) {
        newPassword = prompt("Por favor introduce tu nueva contraseña:");
        if (newPassword === null) {
            alert("Es necesario introducir una nueva contraseña para continuar.");
            return;
        }
        if (newPassword.trim() === "") {
            alert("No ingresaste ninguna contraseña.");
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

        if (changeRes.ok) {
            alert("Contraseña actualizada correctamente.");
            localStorage.setItem("password", newPassword);
        } else {
            throw new Error("Hubo un error al cambiar la contraseña.");
        }
    } catch (err) {
        alert(err.message);
    }
}
