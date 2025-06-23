document.addEventListener("DOMContentLoaded", () => {
    setExercicePerDay();
    highLigthDay();
});


function highLigthDay() {
    const opciones = { weekday: 'long' };
    const date = new Date();
    const nombreDia = "fila-dia-" + date.toLocaleDateString('es-ES', opciones);

    const elementDay = document.getElementById(nombreDia);
    elementDay.classList.add("highlited")
}

async function setExercicePerDay() {
    const user = localStorage.getItem("username");
    try {
        const response = await fetch('/get_userCalendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta: ' + response.status);
        }

        const rutina = await response.json();

        for (const dia in rutina) {
            const inputEjercicio = document.getElementById(dia);  // id del input es igual al nombre del día
            if (inputEjercicio) {
                inputEjercicio.value = rutina[dia];
            } else {
                console.warn(`No existe input con id '${dia}' en el DOM.`);
            }
        }

    } catch (error) {
        console.error("Error al establecer los ejercicios:", error);
    }
}

async function saveCalendar() {
    // Desactivar inputs y remover modo edición
    const exercicesElements = document.getElementsByClassName("ejercicio");
    for (const element of exercicesElements) {
        element.disabled = true;
        element.classList.remove('editing');
    }

    // Generar el calendario desde los inputs
    const calendario = generarCalendarioDesdeInputs();

    // Validación por si no se obtiene el username
    if (!calendario || !calendario.username) {
        alert("❌ No se pudo obtener el usuario. Asegúrate de haber iniciado sesión.");
        return;
    }

    // Enviar al backend
    try {
        const resSaveFetch = await fetch("/save_calendar", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(calendario)
        });

        if (resSaveFetch.ok) {
            alert("✅ Calendario guardado con éxito");
        } else {
            alert("⚠️ Ha habido un problema guardando los cambios");
        }
    } catch (error) {
        console.error("❌ Error en la petición:", error);
        alert("❌ Error de conexión al guardar el calendario.");
    }
}


function generarCalendarioDesdeInputs() {
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const calendarioActualizado = { username: localStorage.getItem("username") };

    dias.forEach(dia => {
        const input = document.getElementById(dia);
        if (input) {
            calendarioActualizado[dia] = input.value.trim();
        }
    });

    return calendarioActualizado;
}

//EDIT MODE

let isEditing = false;

function setEditMode(event) {
    const button = event.target;
    const isEditing = button.dataset.editing === "true";
    const nuevoEstado = isEditing ? false : true;
    button.dataset.editing = nuevoEstado.toString();

    if (nuevoEstado) {
        button.textContent = 'Guardar cambios';
        console.log('Modo edición activado');
        editCalendar();
    } else {
        saveCalendar();
        button.textContent = 'Editar Calendario';
        console.log('Cambios guardados, modo edición desactivado');
    }
}

function editCalendar() {
    const exercicesElements = document.getElementsByClassName("ejercicio");
    for (const element of exercicesElements) {
        element.disabled = false;
        element.classList.add('editing');
    }
}
