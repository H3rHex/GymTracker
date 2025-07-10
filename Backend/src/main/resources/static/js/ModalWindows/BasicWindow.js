export class BasicWindow {
    constructor(title, message, width, height) {
        this.title = title;
        this.message = message;

        this.width = parseInt(width, 10);
        this.height = parseInt(height, 10);

        if (isNaN(this.width)) {
            this.width = 400; // Valor por defecto si no es un número válido
        }
        if (isNaN(this.height)) {
            this.height = 250; // Valor por defecto si no es un número válido
        }

        this.windowOverlay = null;
        this._resolvePromise = null; // Propiedad privada para almacenar la función resolve de la Promise

        this.isModalActive = false; // Estado del modo modal
    }

    windowBuilder() {
        return new Promise((resolve) => { // La clave: windowBuilder ahora devuelve una Promise
            this._resolvePromise = resolve; // Almacenamos la función resolve aquí

            // OVERLAY ELEMENT
            const windowElement = document.createElement('div');
            windowElement.style.width = `${window.innerWidth} px`;
            windowElement.style.height = `${window.innerHeight} px`;
            windowElement.style.zIndex = '999998';
            windowElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            windowElement.style.position = 'fixed'; // Para asegurar que cubre toda la ventana
            windowElement.style.top = '0';
            windowElement.style.left = '0';
            this.windowOverlay = windowElement; // Guardar referencia al overlay

            // CONTENEDOR
            const container = document.createElement('div');
            container.classList.add('modalWindow');
            windowElement.appendChild(container);

            container.style.width = `${this.width} px`;
            container.style.height = `${this.height} px`;
            container.style.zIndex = '99999';

            // TITULO
            const titleElement = document.createElement('h3');
            titleElement.textContent = this.title;
            container.appendChild(titleElement);

            const messageElement = document.createElement('p');
            messageElement.textContent = this.message;
            container.appendChild(messageElement);

            const acceptButton = document.createElement('button');
            acceptButton.textContent = "Aceptar";
            // Llama a deleteWindow Y luego resuelve la Promise
            acceptButton.addEventListener('click', () => {
                this.deleteWindow();
                if (this._resolvePromise) {
                    this._resolvePromise(true);
                }
            });

            container.appendChild(acceptButton);

            //ACTIVAR MODO MODAL (se llama antes de añadir al body)
            this.handleActiveWindowMode();

            document.body.appendChild(windowElement);
        });
    }

    deleteWindow() {
        if (this.windowOverlay && document.body.contains(this.windowOverlay)) {
            document.body.removeChild(this.windowOverlay);
        }
        this.handleActiveWindowMode(); // Desactiva el modo modal
    }

    handleActiveWindowMode() {
        const appElement = document.getElementById("app");

        if (!appElement) {
            console.error("Error: Elemento con ID 'app' no encontrado.");
            return;
        }

        try {
            const isModalActive = appElement.dataset.modalactive === "true";
            const newModalState = !isModalActive;
            this.isModalActive = newModalState;

            appElement.dataset.modalactive = newModalState.toString();

            if (newModalState) {
                const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.overflow = 'hidden';
                if (scrollBarWidth > 0) {
                    document.body.style.paddingRight = `${scrollBarWidth} px`;
                }
            } else {
                // Cuando se desactiva, espera la transición para resetear estilos
                appElement.addEventListener('transitionend', function handler() {
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    appElement.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        } catch (err) {
            console.error("Error en handleActiveWindowMode:", err);
        }

        return this.isModalActive; // Retorna el estado actual del modo modal
    }
}

// Función auxiliar exportada para crear y mostrar la ventana modal, esperando su cierre
export async function createBasicWindow(title, message, width, height) {
    const basicWindow = new BasicWindow(title, message, width, height);
    await basicWindow.windowBuilder();
    // Espera a que el usuario cierre la ventana
    return true;
}

export function isModalActive() {
    const appElement = document.getElementById("app");
    if (!appElement) {
        console.error("Error: Elemento con ID 'app' no encontrado para verificar el estado de la modal.");
        return false; // Si no se encuentra el elemento, asumimos que no hay modal activa.
    }
    // Solo lee el valor, no lo modifica
    return appElement.dataset.modalactive === "true";
}