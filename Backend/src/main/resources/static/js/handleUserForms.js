import { createBasicWindow, isModalActive } from "/js/ModalWindows/BasicWindow.js";

async function sendForm(e) {
    if (isModalActive()) {
        console.warn("Modal ya activa. No se puede abrir otra.");
        return;
    }

    //console.log("Enviando formulario de inicio de sesión...");
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    /* 
    console.log("Username:", username);
    console.log("Password:", password);
    */

    try {
        const response = await fetch("/user_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": username, "password": password })
        });

        //console.log("Respuesta del servidor:", response);

        if (response.ok) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            const message = await response.text();
            await createBasicWindow("ÉXITO", message); // Usar la función auxiliar
            window.location.href = '/home'; // Redirige a la página de inicio
        } else {
            const errorText = await response.text();
            await createBasicWindow("ERROR", errorText || "Credenciales incorrectas"); // No redirige, así que no se necesita el auxiliar
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
        await createBasicWindow("ERROR", err.message);
    }
}

async function sendFormRegister(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/user_registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (response.ok) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            showInfoAndRedirect("REGISTRO EXITOSO", "¡Usuario registrado con éxito!", '/home'); // Usar la función auxiliar
        } else {
            const errorText = await response.text();
            await createBasicWindow("ERROR", errorText || "Error al registrar el usuario");
        }
    } catch (err) {
        await createBasicWindow("ERROR", err.message);
    }
}

async function checkUsernameAvailability(e) {
    const username = document.getElementById("username").value;
    let event = e;

    try {
        const response = await fetch("/check_username", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": username })
        });
        const text = await response.text();

        if (text.includes("Username disponible")) {
            sendFormRegister(event);
        } else {
            await createBasicWindow("ADVERTENCIA", "❌ Nombre de usuario no disponible");
        }
    } catch (err) {
        await createBasicWindow("ERROR", err.message);
    }
}

async function checkPasswords(e) {
    e.preventDefault();
    let event = e;

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (password !== confirmPassword) {
        await createBasicWindow("ADVERTENCIA", "Las contraseñas no coinciden");
        return false;
    }
    checkUsernameAvailability(event);
}

async function buttonLogin_registerPage() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");


    if (!username || !password) {
        return;
    }

    try {
        const response = await fetch("/user_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (response.status === 200) {
            window.location.href = '/home'; // Redirige directamente, no necesita modal informativa previa
        } else {
            const errorText = await response.text();
            await createBasicWindow("ERROR", errorText || "Credenciales incorrectas");
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        await createBasicWindow("ERROR", error.message);
    }
}

function togglePasswordVisibility(buttonElement) {
    const passwordInput = buttonElement.previousElementSibling;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        buttonElement.textContent = "👀";
    } else {
        passwordInput.type = "password";
        buttonElement.textContent = "🙈";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    buttonLogin_registerPage()

    const loginForm = document.getElementById("login-user-form");
    if (loginForm) {
        loginForm.addEventListener("submit", sendForm); // Correcto
    }

    const registerForm = document.getElementById("register-user-form");
    if (registerForm) {
        registerForm.addEventListener("submit", checkPasswords); // Correcto
    }

    // OTHER BUTTONS    
    const autologinButton = document.getElementById("autoLoginButton");
    if (autologinButton) {
        autologinButton.addEventListener("click", buttonLogin_registerPage);
    }

    const toggleButton = document.getElementsByClassName("toggle-show-password");
    if (toggleButton) {
        for (let i = 0; i < toggleButton.length; i++) {
            toggleButton[i].addEventListener("click", () => togglePasswordVisibility(toggleButton[i]));
        }
    }
});