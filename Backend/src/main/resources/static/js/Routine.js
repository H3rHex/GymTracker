document.addEventListener("DOMContentLoaded", () => {
    loadCalendarData();
    loadRoutineData();
    highLigthDay();
});

// RESUMEN GENERAL //

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
        pesoEj.value = `Peso: ${this.reps} KG`;
        pesoEj.setAttribute("disabled", "true");
        container.appendChild(pesoEj);

        const delButton = document.createElement("button");
        delButton.textContent = "❌";
        delButton.classList.add("delEjButton");
        delButton.dataset.editing = "false";
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
    }
}

function handleEditModeRoutine(event) {
    const button = event.target;
    const addEjButton = document.getElementById("addEjerciosBTN");

    // Convertir la HTMLCollection de delButtons a un Array para garantizar consistencia
    const delButtons = document.getElementsByClassName("delEjButton");

    // Leer el estado actual directamente del dataset del botón que fue clickado
    const isEditingCurrentState = button.dataset.editing === "true";
    const nuevoEstado = !isEditingCurrentState;

    // Actualizar el dataset del botón que activó el evento
    button.dataset.editing = nuevoEstado.toString();

    // Asegurarse de que addEjButton existe antes de intentar acceder a su dataset
    if (addEjButton) {
        addEjButton.dataset.editing = nuevoEstado.toString();
    } else {
        console.warn("Elemento con ID 'addEjerciosBTN' no encontrado.");
    }

    // Recorrer y actualizar los botones de eliminar (ahora desde un Array)
    for (let delBtn of delButtons) {
        // Asegúrate de que el botón realmente existe en el DOM en ese momento,
        // aunque Array.from ya ayuda a tomar una instantánea.
        if (delBtn) {
            delBtn.dataset.editing = nuevoEstado.toString();
        }
    }

    const routineTextAreas = document.getElementsByClassName('routine-textarea');
    // No necesitamos if (!routineTextAreas) return null; aquí, ya que getElementsByClassName
    // siempre devuelve una colección, aunque esté vacía.

    if (nuevoEstado) { // Si el nuevo estado es true (activando edición)
        // CAMBIAR BOTON
        button.textContent = 'Guardar Cambios';

        // ACTIVAR EDICION DE TEXTO
        for (let textArea of routineTextAreas) {
            textArea.removeAttribute("disabled");
        }
    } else { // Si el nuevo estado es false (desactivando edición)
        // CAMBIAR BOTON (fuera del bucle)
        button.textContent = 'Editar rutina';

        // DESACTIVAR EDICION DE TEXTO
        for (let textArea of routineTextAreas) {
            textArea.setAttribute("disabled", "");
        }

        // GUARDAR CAMBIOS (después de deshabilitar todos los textareas)
        saveNewRoutine();
    }
}

function addEjToCelda() {
    const dia = (prompt("Introduce el dia al que quieres agregar el ejercicio"));
    const diaSinAcentos = removeAccents(dia);

    const diasValidos = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    if (!diasValidos.includes(diaSinAcentos.toLowerCase())) {
        alert("Introduce un dia valido");
        return null;
    }

    const celda = document.getElementById(`dia-${diaSinAcentos.toLowerCase()}`);

    if (!celda) {
        console.error(`Error: No se encontró la celda con ID 'dia-${diaSinAcentos.toLowerCase()}'.`);
        return; // Salir si la celda no existe
    }

    const nameEj = prompt("Introduce el nombre del ejercicio");
    const seriesEj = parseInt(prompt("Introduce las series del ejercicio"), 10);
    const repsEj = parseInt(prompt("Introduce las repeticiones del ejercicio"), 10);

    // PASO 1: Crea la instancia de tu objeto JavaScript Ejercicio con los datos
    const ejercicioData = new Ejercicio(nameEj, seriesEj, repsEj);

    // PASO 2: CONVIERTE esa instancia de objeto JavaScript en un ELEMENTO DOM.
    // Esto es lo que falta en tu código. Necesitas una función o método que haga esto.
    const nuevoEjercicioElementoDOM = ejercicioData.crearElemento();

    celda.appendChild(nuevoEjercicioElementoDOM);
}

function delEj(e) {
    const targetParent = e.target.parentElement;
    console.log("Elemento padre del botón clickado:", targetParent);

    const editModeButton = document.getElementById("editModeRoutineBtn");

    let isEditing = editModeButton.dataset.editing === "true";
    console.log("¿Está en modo edición?", isEditing); // Ahora esto imprimirá true o false booleano

    try {
        if (isEditing) {
            if (targetParent) {
                targetParent.remove();
                console.log("Elemento eliminado con éxito.");
            } else {
                console.warn("No se pudo encontrar el elemento padre para eliminar.");
            }
        } else {
            console.log("Eliminación no permitida: no está en modo edición.");
            return;
        }
    } catch (err) {
        console.error("Error al intentar eliminar el elemento:", err);
    }
}
// CREAR LISTA BAKEND

function getDayRoutine(day) {
    // 1. Obtener el elemento padre
    const diaLunesElemento = document.getElementById(`dia-${day}`);

    // Verificar si el elemento existe
    if (!diaLunesElemento) {
        console.error(`No se encontró el elemento con ID 'dia-${day}'.`);
        return null; // O un objeto vacío, según lo que prefieras en caso de error
    }

    // 2. Obtener los elementos hijos (los contenedores de cada ejercicio)
    const contenedoresEjercicios = diaLunesElemento.querySelectorAll('.container-ejercicio');

    const ejerciciosArray = [];

    // 3. Iterar sobre cada hijo (ejercicio)
    contenedoresEjercicios.forEach(contenedor => {
        // 4. Obtener los valores de cada ejercicio
        const nombreElemento = contenedor.querySelector('.ejercicio-nombre');
        const seriesElemento = contenedor.querySelector('.ejercicio-series');
        const repeticionesElemento = contenedor.querySelector('.ejercicio-repeticiones');

        // Extraer el texto y limpiar/convertir
        const nombre = nombreElemento ? nombreElemento.value : 'Desconocido';
        // Usamos .split(': ')[1] para obtener solo el número después de "Series:"
        const seriesTexto = seriesElemento ? seriesElemento.value.split(': ')[1] : '0';
        // Usamos parseInt para convertir el texto de las series a un número entero
        const series = parseInt(seriesTexto, 10);

        const repeticionesTexto = repeticionesElemento ? repeticionesElemento.value.split(': ')[1] : '0';
        const repeticiones = parseInt(repeticionesTexto, 10);

        // 5. Construir el objeto de ejercicio
        const ejercicio = {
            nombre: nombre,
            series: series,
            repeticiones: repeticiones
        };

        // 6. Guardar todos los ejercicios en el array
        ejerciciosArray.push(ejercicio);
    });

    // 7. Estructurar el objeto final
    const datosEntrenamiento = {
        [day]: {
            "ejercicios": ejerciciosArray
        }
    };

    return datosEntrenamiento;
}

function createRoutineJson() {
    const username = localStorage.getItem("username");
    let routine = { "username": username }; // Objeto inicial con username

    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    dias.forEach(day => {
        const dayData = getDayRoutine(day); // Esto devuelve { "dia": { "ejercicios": [...] } }

        if (dayData && dayData[day]) {
            routine[day] = dayData[day]; // ¡Asignamos el OBJETO anidado directamente!
        } else {
            routine[day] = { "ejercicios": [] }; // Días sin ejercicios se envían como objeto vacío
        }
    });
    return routine; // Devolvemos el objeto anidado
}

async function saveNewRoutine() {
    // Generar el nuevo objeto de lista
    const routine = createRoutineJson();
    //console.log(routine);

    // Validación por si no se obtiene el username
    if (!routine || !routine.username) {
        alert("❌ No se pudo obtener la rutina");
        return;
    }

    // Enviar al backend
    try {
        const resSaveFetch = await fetch("/save_routine", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routine)
        });

        if (resSaveFetch.ok) {
            //alert("✅ Calendario guardado con éxito");
        } else {
            alert("⚠️ Ha habido un problema guardando los cambios");
        }
    } catch (error) {
        console.error("❌ Error en la petición:", error);
        alert("❌ Error de conexión al guardar el calendario.");
    }
}
