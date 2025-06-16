function sendForm(e) {
    e.preventDefault(); // Evita recargar la página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/user_login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then((response) => {
            if (response.ok) {
                localStorage.setItem("username", username);
                return response.text();
            } else {
                throw new Error("Credenciales incorrectas");
            }
        })
        .then((message) => {
            alert(message); // o puedes usar SweetAlert o Toastify
        })
        .catch((err) => {
            alert(err.message);
        });
}

function sendFormRegister(e) {
    e.preventDefault(); // Evita recargar la página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/user_registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Error al registrar el usuario");
            }
        })
        .then((message) => {
            alert(message); // o puedes usar SweetAlert o Toastify
        })
        .catch((err) => {
            alert(err.message);
        });
}

function checkUsernameAvailability(e) {
    const username = document.getElementById("username").value;
    let event = e;

    fetch("/check_username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username })
    })
        .then(response => response.text())
        .then(text => {
            if (text.includes("Username disponible")) {
                sendFormRegister(event);
            } else {
                alert("❌ Nombre de usuario no disponible");
            }
        })
        .catch((err) => {
            alert(err.message);
        });
}

function checkPasswords(e) {
    e.preventDefault();
    let event = e;

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return false;
    }
    checkUsernameAvailability(event)
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
