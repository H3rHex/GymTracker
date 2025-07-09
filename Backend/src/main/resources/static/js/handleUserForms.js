import { createBasicWindow } from "/js/ModalWindows/BasicWindow.js";

async function sendForm(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/user_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (response.ok) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            const message = await response.text();
            showInfoAndRedirect("ÉXITO", message, '/home'); // Usar la función auxiliar
        } else {
            const errorText = await response.text();
            createBasicWindow("ERROR", errorText || "Credenciales incorrectas"); // No redirige, así que no se necesita el auxiliar
        }
    } catch (err) {
        createBasicWindow("ERROR", err.message);
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
            createBasicWindow("ERROR", errorText || "Error al registrar el usuario");
        }
    } catch (err) {
        createBasicWindow("ERROR", err.message);
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
            createBasicWindow("ADVERTENCIA", "❌ Nombre de usuario no disponible");
        }
    } catch (err) {
        createBasicWindow("ERROR", err.message);
    }
}

async function checkPasswords(e) {
    e.preventDefault();
    let event = e;

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (password !== confirmPassword) {
        createBasicWindow("ADVERTENCIA", "Las contraseñas no coinciden");
        return false;
    }
    checkUsernameAvailability(event);
}

async function buttonLogin_registerPage() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

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
            createBasicWindow("ERROR", errorText || "Credenciales incorrectas");
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        createBasicWindow("ERROR", error.message);
    }
}

function togglePasswordVisibility(buttonElement) {
    const passwordInput = buttonElement.previousElementSibling;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        buttonElement.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        buttonElement.textContent = "👀";
    }
}