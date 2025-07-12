import { createBasicWindow, isModalActive } from "/js/ModalWindows/BasicWindow.js";

async function sendFormLogin(e) {
    if (isModalActive()) {
        console.warn("Modal ya activa. No se puede abrir otra.");
        return;
    }

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/user_login_form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "username": username, "password": password })
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Datos de respuesta:", responseData);

            localStorage.setItem("username", responseData.username);
            localStorage.setItem("sessionId", responseData.sessionId);


            console.log("Datos guardados en localStorage:", {
                username: responseData.username,
                sessionId: responseData.sessionId
            });

            await createBasicWindow("ÉXITO", "Sesión iniciada correctamente");
            window.location.href = '/home';
        } else {
            // Este bloque se ejecuta si el estado HTTP NO es 2xx (ej. 400, 401, 500)
            const errorResponseData = await response.json(); // Aún lees el JSON para tenerlo en la consola si lo necesitas
            console.error("❌ Error del servidor:", errorResponseData); // Para depuración en consola

            let errorMessageForUser = "Ocurrió un error al iniciar sesión."; // Mensaje genérico por defecto

            // Puedes personalizar si la respuesta tiene un 'status' específico
            if (response.status === 400 || response.status === 401) {
                errorMessageForUser = "Usuario o contraseña incorrectos.";
            } else if (response.status >= 500) {
                errorMessageForUser = "Hubo un problema con el servidor. Inténtalo de nuevo más tarde.";
            }
            // Puedes añadir más lógica aquí si quieres mensajes para otros códigos de estado específicos

            await createBasicWindow("ERROR", errorMessageForUser);
        }
    } catch (err) {
        // Este catch maneja errores de red, JSON malformado, etc.
        console.error('❌ Error de conexión o parsing:', err.message);
        await createBasicWindow("ERROR", "No se pudo conectar al servidor. Inténtalo de nuevo.");
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

        const responseData = await response.json();
        console.log("Respuesta del servidor:", responseData);

        if (response.ok) {

            /*  
             localStorage.setItem("username", responseData.username);
             localStorage.setItem("sessionId", responseData.sessionId); 
             */

            console.log("Datos guardados en localStorage:", {
                username: responseData.username,
                sessionId: responseData.sessionId
            });

            await createBasicWindow("REGISTRO EXITOSO", "¡Usuario registrado con éxito!"); // Usar la función auxiliar
            window.location.href = '/home'; // Redirige a la página de inicio

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

export async function autoLogin() {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId || sessionId === "null" || sessionId.trim() === "") {
        console.log("No sessionId found in localStorage or it's invalid. Skipping auto-login.");
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch("/user_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "sessionId": sessionId })
        });

        if (response.status === 200) {
            // console.log("Auto-login successful!");
            return; // Auto-login successful, no need to do anything else
        } else {
            // Log the full error response from the server for debugging
            const errorResponse = await response.text();
            console.error("❌ Auto-login failed with status:", response.status, "Response:", errorResponse);

            // Provide a generic message to the user
            await createBasicWindow("ERROR", "La sesión no es válida. Por favor, inicia sesión de nuevo.");
            // Optionally, clear the invalid sessionId from localStorage
            localStorage.removeItem("sessionId");
            window.location.href = '/';
        }
    } catch (error) {
        console.error('❌ Error durante el auto-login (red o parsing):', error.message);
        await createBasicWindow("ERROR", "No se pudo conectar al servidor para auto-login.");
        window.location.href = '/';
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
    const loginForm = document.getElementById("login-user-form");
    if (loginForm) {
        loginForm.addEventListener("submit", sendFormLogin); // Correcto
    }

    const registerForm = document.getElementById("register-user-form");
    if (registerForm) {
        registerForm.addEventListener("submit", checkPasswords); // Correcto
    }

    const toggleButton = document.getElementsByClassName("toggle-show-password");
    if (toggleButton) {
        for (let i = 0; i < toggleButton.length; i++) {
            toggleButton[i].addEventListener("click", () => togglePasswordVisibility(toggleButton[i]));
        }
    }
});