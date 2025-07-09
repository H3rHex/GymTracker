export class ConfirmWindow {
    constructor(title, message, width, height) {
        this.title = title;
        this.message = message;
        this.width = parseInt(width, 10);
        this.height = parseInt(height, 10);

        if (isNaN(this.width)) { this.width = 400; }
        if (isNaN(this.height)) { this.height = 250; }

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
        container.classList.add('modalWindow', 'confirmWindow');
        windowElement.appendChild(container);

        container.style.width = `${this.width}px`;
        container.style.height = `${this.height}px`;
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
                this.resolvePromise(true);
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
                this.resolvePromise(false);
            }
        });
        buttonContainer.appendChild(cancelButton);

        // ACTIVAR MODO MODAL
        this.handleActiveWindowMode();
        document.body.appendChild(windowElement); // Añade la ventana al DOM aquí mismo
    }

    // OBTENER DATOS
    getResponse() {
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

export async function createConfirmWindow(title, message, width, height) {
    const confirmWindow = new ConfirmWindow(title, message, width, height
        
    );
    /* Creamos ventana */
    confirmWindow.windowBuilder();
    // ESPERAMOS A LA PROMESA DE getResponse -> Necesario para un correcto flujo
    const response = await confirmWindow.getResponse();
    return response;
}