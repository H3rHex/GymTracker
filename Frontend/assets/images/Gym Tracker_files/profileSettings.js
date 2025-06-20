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

function delete_account() {
    if (confirm("Vas a eliminar tu cuenta ¿Estás seguro?")) {
        let password = null;
        while (!password) {
            password = prompt("Por favor, ingresa tu contraseña:");
            if (password === null) {
                alert("No se puede eliminar la cuenta sin ingresar la contraseña.");
                return; // Sale si el usuario cancela el prompt
            }
            if (password.trim() === "") {
                alert("No ingresaste ninguna contraseña.");
                password = null; // fuerza a que vuelva a pedirla
            }
        }

        let username = localStorage.getItem("username");

        fetch("/del_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        })
            .then((response) => {
                if (response.ok) {
                    alert("Usuario borrado con éxito");
                } else {
                    throw new Error("Credenciales incorrectas");
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    } else {
        // El usuario hizo clic en "Cancelar"
        console.log("Usuario canceló.");
    }
}

async function changeUsername() {
    if (!confirm("Vas a cambiar el nombre de usuario de tu cuenta. ¿Estás seguro?")) {
        console.log("Usuario canceló.");
        return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!loginRes.ok) {
            throw new Error("Credenciales incorrectas");
        }
    } catch (err) {
        alert(err.message);
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
            body: JSON.stringify({ username: username })
        })
            .then(response => response.text())
            .then(text => {
                if (text.includes("Username disponible")) {

                } else {
                    alert("❌ Nombre de usuario no disponible");
                    changeUsername();
                }
            })
            .catch((err) => {
                alert(err.message);
            });

    } catch (err) {
        alert(err.message);
        return;
    }

    // Cambiar nombre usuario
    try {
        const changeRes = await fetch("/change_username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password, newUsername: newUsername })
        });

        if (changeRes.ok) {
            alert("✅ El nombre de usuario se actualizó correctamente.");
        } else {
            throw new Error("Hubo un error al cambiar el nombre de usuario.");
        }
    } catch (err) {
        alert(err.message);
    }
}

async function changePass() {
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
            body: JSON.stringify({ username, password })
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
            body: JSON.stringify({ username: username, password: password, newPassword: newPassword })
        });

        if (changeRes.ok) {
            alert("Contraseña actualizada correctamente.");
        } else {
            throw new Error("Hubo un error al cambiar la contraseña.");
        }
    } catch (err) {
        alert(err.message);
    }
}
