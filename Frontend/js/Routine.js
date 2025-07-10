// IMPORTS
import { createBasicWindow } from "/js/ModalWindows/BasicWindow.js";
import { createDataWindow } from "/js/ModalWindows/DataWindow.js";

document.addEventListener("DOMContentLoaded", () => {
    loadCalendarData();
    loadRoutineData();
    highLigthDay();
    updateCarouselDisplay();


    if (!localStorage.getItem("routineEditingMode")) {
        localStorage.setItem("routineEditingMode", false);
        localStorage.setItem("routineIsPublic", false);
    } else {
        localStorage.setItem("routineEditingMode", false);
    }

    if (!localStorage.getItem("carruselIndex")) {
        localStorage.setItem("carruselIndex", 0);
    }

    const editCalendarBtn = document.getElementById("editModeCalendarBtn");
    if (editCalendarBtn) {
        editCalendarBtn.addEventListener("click", handleEditModeCalendar);
    }
    const editRoutineBtn = document.getElementById("editModeRoutineBtn");
    // Verificamos que los botones existan antes de añadir los listeners
    if (editRoutineBtn) {
        editRoutineBtn.addEventListener("click", handleEditModeRoutine);
    }

    const addEjerciciosBtn = document.getElementById("addEjerciosBTN");

    if (addEjerciciosBtn) {
        addEjerciciosBtn.addEventListener("click", addEjToCelda);
    }

    /* CARRUSEL DIRECTION BUTTONS */
    const previousDayBtn = document.getElementById("previousDayBtn");
    if (previousDayBtn) {
        previousDayBtn.addEventListener("click", moveLeft);
    }
    const nextDayBtn = document.getElementById("nextDayBtn");
    if (nextDayBtn) {
        nextDayBtn.addEventListener("click", moveRight);
    }
});

// RESUMEN GENERAL //
const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];


function highLigthDay() {
    const opciones = { weekday: 'long' };
    const date = new Date();

    const nombreDiaConTilde = date.toLocaleDateString('es-ES', opciones);

    const nombreDiaSinTilde = removeAccents(nombreDiaConTilde);

    const nombreDiaParaId = nombreDiaSinTilde.toLowerCase();

    const idElementoDia = "fila-dia-" + nombreDiaParaId;

    const elementDay = document.getElementById(idElementoDia);

    if (elementDay) {
        elementDay.classList.add("highlited");
    } else {
        console.warn(`No se encontró el elemento con ID '${idElementoDia}'. Asegúrate de que el HTML coincida.`);
    }
}

function removeAccents(str) {
    // Normaliza la cadena para separar las letras de los acentos
    // y luego reemplaza todos los caracteres de acento (rango Unicode) con una cadena vacía.
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function loadCalendarData() {
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
        // createBasicWindow("ERROR", "Error al cargar los datos del calendario: " + error.message);
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
        createBasicWindow("ERROR", "No se pudo obtener el usuario. Asegúrate de haber iniciado sesión.");
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
            createBasicWindow("ÉXITO", "✅ Calendario guardado con éxito.");
        } else {
            createBasicWindow("ADVERTENCIA", "⚠️ Ha habido un problema guardando los cambios.");
        }
    } catch (error) {
        console.error("❌ Error en la petición:", error);
        createBasicWindow("ERROR", "❌ Error de conexión al guardar el calendario.");
    }
}


function generarCalendarioDesdeInputs() {
    const calendarioActualizado = { username: localStorage.getItem("username") };

    // const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]; Constante global definida al inicio del archivo

    dias.forEach(dia => {
        const input = document.getElementById(dia);
        if (input) {
            calendarioActualizado[dia] = input.value.trim();
        }
    });

    return calendarioActualizado;
}

//EDIT MODE

let isEditing = false; // This variable seems unused, localStorage is used instead

function handleEditModeCalendar(event) {
    const button = event.target;

    const isEditing = button.dataset.editing === "true";
    const nuevoEstado = isEditing ? false : true;
    button.dataset.editing = nuevoEstado.toString();


    if (nuevoEstado) {
        button.textContent = 'Guardar cambios';
        //console.log('Modo edición activado');
        editCalendar();
    } else {
        saveCalendar();
        button.textContent = 'Editar Calendario';
        //console.log('Cambios guardados, modo edición desactivado');
    }
}

function editCalendar() {
    const exercicesElements = document.getElementsByClassName("ejercicio");
    for (const element of exercicesElements) {
        element.disabled = false;
        element.classList.add('editing');
    }
}

//ROUTINE

class Ejercicio {
    constructor(nombreEjercicio, seriesEjercicio, repsEjercicio) {
        this.nombre = nombreEjercicio;
        this.series = seriesEjercicio;
        this.reps = repsEjercicio;


        // DEBUG: Muestra los valores que recibe el constructor
        // console.log("DEBUG: Ejercicio constructor - nombre:", this.nombre, "series:", this.series, "reps:", this.reps);
    }

    crearElemento() {
        // DEBUG: Confirmar si el método se está llamando
        //console.log("DEBUG: crearElemento() llamado para:", this.nombre);

        const container = document.createElement('div');

        // DEBUG: Inspeccionar el contenedor recién creado
        //console.log("DEBUG: container (después de crear):", container);

        container.classList.add(
            'container-ejercicio',
            `container-${this.nombre.replace(/\s+/g, '-').toLowerCase()}`
        );
        // DEBUG: Inspeccionar el contenedor después de añadir clases
        //console.log("DEBUG: container (después de añadir clases):", container.outerHTML); // Muestra el HTML completo

        const nameEj = document.createElement('textarea');
        nameEj.classList.add('ejercicio-nombre', 'routine-textarea');
        nameEj.value = this.nombre;
        nameEj.style.fontWeight = "bold";
        nameEj.setAttribute("disabled", "true");

        container.appendChild(nameEj);
        // DEBUG: Inspeccionar el contenedor después de añadir el nombre
        //console.log("DEBUG: container (después de añadir nombre):", container.outerHTML);

        const seriesEj = document.createElement('textarea');
        seriesEj.classList.add('ejercicio-series', 'routine-textarea');
        seriesEj.value = `Series: ${this.series}`;
        seriesEj.setAttribute("disabled", "true");

        container.appendChild(seriesEj);
        // DEBUG: Inspeccionar el contenedor después de añadir series
        //console.log("DEBUG: container (después de añadir series):", container.outerHTML);


        const repesEj = document.createElement('textarea');
        repesEj.classList.add('ejercicio-repeticiones', 'routine-textarea');
        repesEj.value = `Reps: ${this.reps}`;
        repesEj.setAttribute("disabled", "true");
        container.appendChild(repesEj);

        const pesoEj = document.createElement('textarea');
        pesoEj.classList.add('ejercicio-pesoEj', 'routine-textarea');
        pesoEj.value = `Peso: 0 KG`; // Note: Using reps for weight here, usually a separate input
        pesoEj.setAttribute("disabled", "true");
        container.appendChild(pesoEj);

        const delButton = document.createElement("button");
        delButton.textContent = "❌";
        delButton.classList.add("delEjButton");
        delButton.dataset.editing = "false"; // Initial state
        delButton.addEventListener('click', (event) => {
            delEj(event);
        });
        container.appendChild(delButton);

        // DEBUG: Inspeccionar el contenedor justo antes de devolverlo
        //console.log("DEBUG: container (FINAL, antes de return):", container.outerHTML);

        return container; // Esta es la línea crucial
    }
}


async function loadRoutineData() {
    const user = localStorage.getItem("username")
    try {
        const response = await fetch("/get_user_routine", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user })
        });


        if (!response.ok) {
            throw new Error('Error al cargar rutina');
        }

        const routine = await response.json();
        //console.log(routine);

        for (const dia in routine) {
            const celda = document.getElementById(`dia-${dia}`);

            if (!celda) continue;

            //console.log(dia);

            const ejercicios = routine[dia].ejercicios;
            if (!ejercicios || Object.keys(ejercicios).length === 0) {
                continue;
            }
            //console.log(ejercicios);

            for (const ejercicio of ejercicios) {
                const ejercicioObj = new Ejercicio(
                    ejercicio.nombre,
                    ejercicio.series,
                    ejercicio.repeticiones
                );

                const elementEj = ejercicioObj.crearElemento();

                //console.log(elementEj);
                celda.appendChild(elementEj);
            }
        }

    } catch (error) {
        console.error('Error al procesar rutina:', error);
        // createBasicWindow("ERROR", "Error al cargar los datos de la rutina: " + error.message);
    }
}

function handleEditModeRoutine(event) {
    const button = event.target;
    const addEjButton = document.getElementById("addEjerciosBTN");
    const isPublicButton = document.getElementById("handleVisibilityBtn");

    const delButtons = document.getElementsByClassName("delEjButton");

    const isEditingCurrentStateBooleana = localStorage.getItem("routineEditingMode") === "true";
    const nuevoEstado = !isEditingCurrentStateBooleana;
    localStorage.setItem("routineEditingMode", nuevoEstado.toString());
    console.log(localStorage.getItem("routineEditingMode"));

    button.dataset.editing = nuevoEstado;

    if (addEjButton) {
        addEjButton.dataset.editing = nuevoEstado.toString();
    } else {
        console.warn("Elemento con ID 'addEjerciosBTN' no encontrado.");
    }

    if (isPublicButton) {
        isPublicButton.dataset.editing = nuevoEstado.toString();
    } else {
        console.warn("Elemento con ID 'handleVisibilityBtn' no encontrado."); // Corrected ID in warning
    }

    for (let delBtn of delButtons) {
        if (delBtn) {
            delBtn.dataset.editing = nuevoEstado.toString();
        }
    }

    const routineTextAreas = document.getElementsByClassName('routine-textarea');

    if (nuevoEstado) { // Si el nuevo estado es true (activando edición)
        button.textContent = 'Guardar Cambios';

        for (let textArea of routineTextAreas) {
            textArea.removeAttribute("disabled");
        }
    } else { // Si el nuevo estado es false (desactivando edición)
        button.textContent = 'Editar rutina';

        for (let textArea of routineTextAreas) {
            textArea.setAttribute("disabled", "");
        }

        saveNewRoutine();
    }
}

async function addEjToCelda() { // Changed to async because createBasicWindow is async
    const isEditingMode = localStorage.getItem("routineEditingMode") === "true";
    if (!isEditingMode) {
        createBasicWindow("INFO", "Debes estar en modo edición para añadir ejercicios.");
        return null;
    }

    const dia = await createDataWindow("Añadir nuevo ejercicio", "Introduce el día al que quieres agregar el ejercicio", "text");
    if (dia === null) { // User clicked cancel on prompt
        console.log("Usuario canceló la introducción del día.");
        return null;
    }
    const diaSinAcentos = removeAccents(dia);

    const diasValidos = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    if (!diasValidos.includes(diaSinAcentos.toLowerCase())) {
        createBasicWindow("ADVERTENCIA", "Introduce un día válido (Lunes, Martes, etc.).");
        return null;
    }

    const celda = document.getElementById(`dia-${diaSinAcentos.toLowerCase()}`);

    if (!celda) {
        console.error(`Error: No se encontró la celda con ID 'dia-${diaSinAcentos.toLowerCase()}'.`);
        createBasicWindow("ERROR", `No se encontró la celda para el día '${diaSinAcentos}'.`);
        return;
    }

    const nameEj = await createDataWindow("Añadir nuevo ejercicio", "Introduce el nombre del ejercicio", "text");
    if (nameEj === null || nameEj.trim() === "") {
        createBasicWindow("ADVERTENCIA", "El nombre del ejercicio no puede estar vacío.");
        return null;
    }

    const seriesEj = await createDataWindow("Añadir nuevo ejercicio", "Introduce las series del ejercicio", "number");
    if (isNaN(seriesEj) || seriesEj <= 0) {
        createBasicWindow("ADVERTENCIA", "Las series deben ser un número válido y positivo.");
        return null;
    }

    const repsEj = await createDataWindow("Añadir nuevo ejercicio", "Introduce las repeticiones del ejercicio", "number");
    if (isNaN(repsEj) || repsEj <= 0) {
        createBasicWindow("ADVERTENCIA", "Las repeticiones deben ser un número válido y positivo.");
        return null;
    }

    const ejercicioData = new Ejercicio(nameEj, seriesEj, repsEj);
    const nuevoEjercicioElementoDOM = ejercicioData.crearElemento();

    celda.appendChild(nuevoEjercicioElementoDOM);
}


function delEj(e) {
    const targetParent = e.target.parentElement;
    console.log("Elemento padre del botón clickado:", targetParent);

    const editModeButton = document.getElementById("editModeRoutineBtn"); // Assuming this is the correct ID for the edit button

    let isEditing = editModeButton ? editModeButton.dataset.editing === "true" : false; // Check if button exists
    console.log("¿Está en modo edición?", isEditing);

    try {
        if (isEditing) {
            if (targetParent) {
                targetParent.remove();
            } else {
                console.warn("No se pudo encontrar el elemento padre para eliminar.");
            }
        } else {
            createBasicWindow("INFO", "Debes estar en modo edición para eliminar ejercicios.");
            console.log("Eliminación no permitida: no está en modo edición.");
            return;
        }
    } catch (err) {
        console.error("Error al intentar eliminar el elemento:", err);
        createBasicWindow("ERROR", "Error al intentar eliminar el ejercicio: " + err.message);
    }
}

async function visibilityMode() { // Changed to async because createBasicWindow is async
    const btn = document.getElementById("handleVisibilityBtn");
    const isPublic = localStorage.getItem("routineIsPublic");
    let currentIsPublic;

    const isEditingMode = localStorage.getItem("routineEditingMode") === "true";
    if (!isEditingMode) {
        createBasicWindow("INFO", "Debes estar en modo edición para cambiar la visibilidad de la rutina.");
        return null;
    }

    if (isPublic === "true") {
        currentIsPublic = false;
        localStorage.setItem("routineIsPublic", false);
        createBasicWindow("INFO", "Rutina establecida como: Privada.");
    } else {
        currentIsPublic = true;
        localStorage.setItem("routineIsPublic", true);
        createBasicWindow("INFO", "Rutina establecida como: Pública.");
    }

    try {
        if (btn) { // Ensure button exists before changing textContent
            if (currentIsPublic === true) {
                btn.textContent = "Publica";
            } else {
                btn.textContent = "Privada";
            }
        }
    } catch (err) {
        console.error("Error al actualizar el botón de visibilidad:", err);
        createBasicWindow("ERROR", "Error al cambiar el estado del botón de visibilidad: " + err.message);
    }
}

// CREAR LISTA BAKEND

function getDayRoutine(day) {
    const diaLunesElemento = document.getElementById(`dia-${day}`);

    if (!diaLunesElemento) {
        console.error(`No se encontró el elemento con ID 'dia-${day}'.`);
        return null;
    }

    const contenedoresEjercicios = diaLunesElemento.querySelectorAll('.container-ejercicio');

    const ejerciciosArray = [];

    contenedoresEjercicios.forEach(contenedor => {
        const nombreElemento = contenedor.querySelector('.ejercicio-nombre');
        const seriesElemento = contenedor.querySelector('.ejercicio-series');
        const repeticionesElemento = contenedor.querySelector('.ejercicio-repeticiones');

        const nombre = nombreElemento ? nombreElemento.value : 'Desconocido';
        const seriesTexto = seriesElemento ? seriesElemento.value.split(': ')[1] : '0';
        const series = parseInt(seriesTexto, 10);

        const repeticionesTexto = repeticionesElemento ? repeticionesElemento.value.split(': ')[1] : '0';
        const repeticiones = parseInt(repeticionesTexto, 10);

        const ejercicio = {
            nombre: nombre,
            series: series,
            repeticiones: repeticiones
        };

        ejerciciosArray.push(ejercicio);
    });

    const datosEntrenamiento = {
        [day]: {
            "ejercicios": ejerciciosArray
        }
    };

    return datosEntrenamiento;
}

function createRoutineJson() {
    const username = localStorage.getItem("username");
    const is_public = localStorage.getItem("routineIsPublic");
    let routine = { "username": username, "isPublic": is_public };

    // const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]; Constante global definida al inicio del archivo
    dias.forEach(day => {
        const dayData = getDayRoutine(day);

        if (dayData && dayData[day]) {
            routine[day] = dayData[day];
        } else {
            routine[day] = { "ejercicios": [] };
        }
    });
    return routine;
}

async function saveNewRoutine() {
    const routine = createRoutineJson();
    console.log(routine);

    if (!routine || !routine.username) {
        createBasicWindow("ERROR", "No se pudo obtener la rutina para guardar.");
        return;
    }

    try {
        const resSaveFetch = await fetch("/save_routine", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routine)
        });

        if (resSaveFetch.ok) {
            createBasicWindow("ÉXITO", "✅ Rutina guardada con éxito.");
        } else {
            createBasicWindow("ADVERTENCIA", "⚠️ Ha habido un problema guardando los cambios de la rutina.");
        }
    } catch (error) {
        console.error("❌ Error en la petición:", error);
        createBasicWindow("ERROR", "❌ Error de conexión al guardar la rutina.");
    }
}

/* LITLE SCREENS CARRUSEL */
function isMobileView() {
    return window.matchMedia("(max-width: 769px)").matches;
}

function updateCarouselDisplay(direction = 0) {
    // Referencia a los elementos de navegación móvil
    const currentDayDisplayElement = document.getElementById('currentDayDisplay'); // Para actualizar el texto del día

    // Lógica para cuando NO estamos en vista móvil
    if (!isMobileView()) {
        console.log("No estás en una pantalla pequeña. Restableciendo vista de escritorio.");

        // Quitar las clases 'visible' y 'no-visible' de TODOS los th y td
        // Esto permite que el CSS de escritorio los muestre todos
        dias.forEach(day => {
            const thElement = document.getElementById(`th-${day}`);
            const tdElement = document.getElementById(`dia-${day}`);
            if (thElement) thElement.classList.remove("visible", "no-visible");
            if (tdElement) tdElement.classList.remove("visible", "no-visible");
        });
        return; // Salir de la función si no es vista móvil
    }

    // --- Lógica para VISTA MÓVIL (si se llega a este punto) ---

    // Obtener el índice actual desde localStorage. Si no existe, inicializar a 0.
    let currentDayIndex = parseInt(localStorage.getItem("carruselIndex")) || 0;
    console.log("Días de la semana:", dias); // Usar dias aquí
    console.log("Índice del día actual (leído de localStorage):", currentDayIndex);

    // Calcular el nuevo índice basado en la dirección (solo si se ha pasado una dirección)
    if (direction !== 0) {
        currentDayIndex = (currentDayIndex + direction + dias.length) % dias.length;
    }

    // *** Guardar el nuevo índice en localStorage ***
    localStorage.setItem("carruselIndex", currentDayIndex.toString());
    console.log("Nuevo Índice del día guardado en localStorage:", currentDayIndex);


    // Ocultar todos los th y td aplicando la clase "no-visible"
    dias.forEach(day => {
        const thElement = document.getElementById(`th-${day}`);
        const tdElement = document.getElementById(`dia-${day}`);
        if (thElement) {
            thElement.classList.remove("visible"); // Asegurarse de que no tenga visible
            thElement.classList.add("no-visible");
        }
        if (tdElement) {
            tdElement.classList.remove("visible"); // Asegurarse de que no tenga visible
            tdElement.classList.add("no-visible");
        }
    });

    // Mostrar solo el th y td del día actual aplicando la clase "visible"
    const thElementToShow = document.getElementById(`th-${dias[currentDayIndex]}`);
    if (thElementToShow) {
        console.log("Elemento TH a mostrar:", thElementToShow);
        thElementToShow.classList.remove("no-visible"); // Quitar no-visible
        thElementToShow.classList.add("visible");
    }
    const tdElementToShow = document.getElementById(`dia-${dias[currentDayIndex]}`);
    if (tdElementToShow) {
        console.log("Elemento TD a mostrar:", tdElementToShow);
        tdElementToShow.classList.remove("no-visible"); // Quitar no-visible
        tdElementToShow.classList.add("visible");
    }

    // Actualizar el texto del día actual en la UI
    if (currentDayDisplayElement) {
        currentDayDisplayElement.textContent = dias[currentDayIndex].charAt(0).toUpperCase() + dias[currentDayIndex].slice(1);
    }
}

function moveLeft() {
    updateCarouselDisplay(-1); // Llama a la función principal con dirección -1
}

function moveRight() {
    updateCarouselDisplay(1); // Llama a la función principal con dirección 1
}
