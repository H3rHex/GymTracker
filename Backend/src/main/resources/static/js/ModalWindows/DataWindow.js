export class DataWindow {
    constructor(title, message, dataType) {
        this.title = title;
        this.message = message;

        this.dataType = dataType;
        this.data = null;
        this.resolvePromise = null;
        this.promiseInstance = null;
    }

    windowBuilder() {
        // OVERLAY ELEMENT
        const windowElement = document.createElement('div');
        windowElement.style.width = `${window.innerWidth}px`;
        windowElement.style.height = `${window.innerHeight}px`;
        windowElement.style.zIndex = '999998';
        windowElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        windowElement.style.position = 'fixed';
        windowElement.style.top = '0';
        windowElement.style.left = '0';

        // CONTENEDOR
        const container = document.createElement('div');
        container.classList.add('modalWindow', 'dataWindow');
        windowElement.appendChild(container);

        // Asegúrate de que el modal esté sobre el overlay
        container.style.zIndex = '999999';
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)'; // Centra el modal

        // TITULO
        const title = document.createElement('h3');
        title.textContent = this.title;
        container.appendChild(title);

        const message = document.createElement('p');
        message.textContent = this.message;
        container.appendChild(message);

        // SOLICITAR DATOS
        let dataInput = null; // Declara dataInput aquí para que sea accesible
        if (this.dataType) {
            const dataForm = document.createElement('div');
            dataForm.classList.add('dataFormModalWindow');
            container.appendChild(dataForm);

            dataInput = document.createElement('input'); // Asigna el elemento al dataInput declarado
            dataInput.type = this.dataType.toString();
            // Captura el valor en tiempo real con 'input' o al perder foco con 'change'
            dataInput.addEventListener('input', () => {
                this.data = dataInput.value;
            });
            dataForm.appendChild(dataInput);

            // SHOW PASSWORD
            if (this.dataType.toString() === "password") {
                const showPassword = document.createElement('button');
                showPassword.type = 'button'; // Previene envío de formularios si el modal está en uno
                showPassword.addEventListener('click', () => {
                    if (dataInput.type === "password") {
                        dataInput.type = "text";
                        showPassword.textContent = "🙈";
                    } else {
                        dataInput.type = "password";
                        showPassword.textContent = "👀";
                    }
                });
                showPassword.textContent = "👀";
                dataForm.appendChild(showPassword);
            }
        }

        // --- Botones (Aceptar y Cancelar) ---
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('modal-buttons'); // Para estilizar los botones
        container.appendChild(buttonContainer);

        const acceptButton = document.createElement('button');
        acceptButton.textContent = "Aceptar";
        acceptButton.addEventListener('click', () => {
            this.deleteWindow(windowElement);
            // ASIGNAR A resolvePromise, el valor de data
            if (this.resolvePromise) {
                this.resolvePromise(this.data);
            }
        });
        buttonContainer.appendChild(acceptButton);

        // Añadir botón de Cancelar para reemplazar 'confirm'
        const cancelButton = document.createElement('button');
        cancelButton.textContent = "Cancelar";
        cancelButton.addEventListener('click', () => {
            this.deleteWindow(windowElement);
            // ¡IMPORTANTE! Resuelve la promesa con 'null' cuando se cancela
            if (this.resolvePromise) {
                this.resolvePromise(null);
            }
        });
        buttonContainer.appendChild(cancelButton);

        // ACTIVAR MODO MODAL
        this.handleActiveWindowMode();
        document.body.appendChild(windowElement); // Añade la ventana al DOM aquí mismo
    }

    // OBTENER DATOS
    getData() {
        // Le asignamos el valor de respuesta de esperando al valor de Promise, esta devuele el valor de resolvePromise ( asignado anteriormente )
        this.promiseInstance = new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
        return this.promiseInstance;
    }

    // BORRAR VENTANA
    deleteWindow(windowElement) {
        windowElement.remove();
        this.handleActiveWindowMode();
    }

    // EFECTOS ETC... (MODO MODAL)
    handleActiveWindowMode() {
        const appElement = document.getElementById("app");

        if (!appElement) {
            console.error("Error: Elemento con ID 'app' no encontrado.");
            return;
        }

        try {
            const isModalActive = appElement.dataset.modalactive === "true";
            const newModalState = !isModalActive;
            appElement.dataset.modalactive = newModalState.toString();

            if (newModalState) {
                const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.overflow = 'hidden';
                if (scrollBarWidth > 0) {
                    document.body.style.paddingRight = `${scrollBarWidth}px`;
                }
            } else {
                appElement.addEventListener('transitionend', function handler() {
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    appElement.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        } catch (err) {
            console.error("Error en handleActiveWindowMode:", err);
        }
    }
}

export async function createDataWindow(title, message, width, height, dataType) {
    const dataWindow = new DataWindow(title, message, width, height, dataType);
    /* Creamos ventana */
    dataWindow.windowBuilder();
    // ESPERAMOS A LA PROMESA DE getData -> Necesario para un correcto flujo
    const data = await dataWindow.getData();
    return data;
}