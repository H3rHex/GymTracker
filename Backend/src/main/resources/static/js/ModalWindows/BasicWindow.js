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

        /* 
        console.log(this.positionX);
        console.log(this.positionY);
        */

        this.windowOverley = null;

    }

    windowBuilder() {
        // OVERLAY ELEMENT
        const windowElement = document.createElement('div');
        windowElement.style.width = `${window.innerWidth}px`
        windowElement.style.height = `${window.innerHeight}px`;
        windowElement.style.zIndex = '999998';
        // --- AQUÍ ESTÁ LA CLAVE ---
        windowElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Fondo semitransparente oscuro
        windowElement.style.position = 'fixed'; // Para asegurar que cubre toda la ventana
        windowElement.style.top = '0';
        windowElement.style.left = '0';
        // --- FIN DE LA CLAVE ---

        // CONTENEDOR
        const container = document.createElement('div');
        container.classList.add('modalWindow');
        windowElement.appendChild(container);

        container.style.width = `${this.width}px`;
        container.style.height = `${this.height}px`;
        container.style.zIndex = '99999';

        // TITULO
        const title = document.createElement('h3');
        title.textContent = this.title
        container.appendChild(title);

        const message = document.createElement('p');
        message.textContent = this.message;
        container.appendChild(message);

        const acceptButton = document.createElement('button');
        acceptButton.textContent = "Aceptar";
        acceptButton.addEventListener('click', () => {
            this.deleteWindow(windowElement);
        });
        container.appendChild(acceptButton);

        //ACTIVAR MODO MODAL
        this.handleActiveWindowMode();

        document.body.appendChild(windowElement);
        //console.log(container);
        return windowElement;
    }

    deleteWindow(window) {
        window.remove();
        this.handleActiveWindowMode();
    }

    handleActiveWindowMode() {
        const appElement = document.getElementById("app");

        if (!appElement) {
            console.error("Error: Elemento con ID 'app' no encontrado.");
            return;
        }

        try {
            // ACTIVAR/DESACTIVAR BLUR
            const isModalActive = appElement.dataset.modalactive === "true"; // Esto lee bien la cadena
            const newModalState = !isModalActive; // newModalState ahora es un booleano (true o false)

            appElement.dataset.modalactive = newModalState.toString();

            // 2. Bloquear/Desbloquear SCROLL y mostrar/ocultar Overlay
            if (newModalState) {
                // BLOQUEAR DOM y SCROLL
                const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.body.style.overflow = 'hidden';
                if (scrollBarWidth > 0) {
                    document.body.style.paddingRight = `${scrollBarWidth}px`;
                }
                //console.log("Modal activado: Scroll bloqueado y Blur aplicado.");

            } else {
                // DESBLOQUEAR DOM y SCROLL (después de la transición del blur)
                appElement.addEventListener('transitionend', function handler() {
                    document.body.style.overflow = ''; // Resetea a valor por defecto
                    document.body.style.paddingRight = ''; // Quita el padding
                    // console.log("Modal desactivado: Scroll desbloqueado y Blur quitado.");
                    appElement.removeEventListener('transitionend', handler); // Limpiar el listener
                }, { once: true });
            }

        } catch (err) {
            console.error("Error en handleActiveWindowMode:", err);
            // throw new Error(err); // Considera si realmente quieres detener el script aquí
        }
    }
}

export async function createBasicWindow(title, message, width, height) {
    const basicWindow = new BasicWindow(title, message, width, height);
    /* Creamos ventana */
    basicWindow.windowBuilder();
}