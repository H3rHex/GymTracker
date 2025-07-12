
//Variables globales
var username = localStorage.getItem("username");
var dayMessageElement = document.getElementById("dayMessage");
var userNameSpan = document.getElementById("usernameSpan");

// IMPORTS NECESARIOS
import { autoLogin } from "/js/handleUserForms.js";
import { close_Sesion } from "/js/profileSettings.js";


// Lista de mensaje motivacionales
const motivational_message_list = [
    "El dolor es temporal, el orgullo es para siempre.",
    "Cada día es una nueva oportunidad para ser mejor.",
    "El éxito no se mide en kilos, sino en constancia.",
    "Levántate, entrena, repite.",
    "No busques excusas, busca resultados.",
    "Los campeones siguen entrenando cuando nadie los ve.",
    "El sudor de hoy es la victoria de mañana.",
    "Transforma tu cuerpo, transforma tu mente.",
    "El gimnasio no es un lugar, es un estilo de vida.",
    "Haz que cada repetición cuente.",
    "Más fuerte, más rápido, más duro.",
    "No hay atajos para un cuerpo fuerte.",
    "Esfuerzo constante, resultados impresionantes.",
    "Desafía tus límites, no tus excusas.",
    "Entrena como si tu vida dependiera de ello.",
    "El éxito es la suma de pequeños esfuerzos diarios.",
    "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    "Cambia tu cuerpo, cambia tu mente, cambia tu vida.",
    "Si quieres resultados diferentes, haz algo diferente.",
    "No es magia, es trabajo duro.",
    "No eres débil, solo no has intentado suficiente.",
    "No importa qué tan lento vayas, sigues siendo más rápido que quien no se mueve.",
    "Cada repetición te acerca a tu meta.",
    "Cree en ti mismo y todo será posible.",
    "El sacrificio de hoy es el éxito de mañana.",
    "Lo único imposible es lo que no intentas.",
    "No esperes por la motivación, crea el hábito.",
    "El gimnasio no solo cambia tu cuerpo, cambia tu mente.",
    "Haz que el dolor valga la pena.",
    "No busques excusas, busca resultados.",
    "Tu esfuerzo es tu mejor inversión.",
    "La fuerza no viene de ganar, viene de luchar.",
    "Si no desafías tus límites, nunca los superarás.",
    "Entrena duro, mantente fuerte, nunca te rindas.",
    "Hoy es un buen día para ser mejor que ayer.",
    "El progreso es progreso, no importa lo pequeño que sea.",
    "Tu cuerpo puede soportar casi todo, es tu mente la que necesitas convencer.",
    "Hazlo con pasión o no lo hagas.",
    "Transforma el ‘no puedo’ en ‘lo hice’.",
    "El éxito se construye un entrenamiento a la vez.",
    "No hay gloria sin sacrificio.",
    "Lo que haces hoy determina tu mañana.",
    "Fuerza, dedicación y disciplina: la fórmula del éxito.",
    "No se trata de ser el mejor, sino de ser mejor que ayer.",
    "Tu cuerpo escucha todo lo que tu mente dice.",
    "El dolor es la señal de que estás creciendo.",
    "Corre el riesgo o pierde la oportunidad.",
    "No pares hasta que estés orgulloso de ti mismo.",
    "Para ganar, primero tienes que quererlo.",
    "El verdadero competidor eres tú mismo."
];

document.addEventListener("DOMContentLoaded", () => {
    autoLogin();
    wellcome();

    const closeSessionButton = document.getElementById("closeSesion");
    if (closeSessionButton) {
        closeSessionButton.addEventListener("click", () => {
            close_Sesion();
        });
    }

});

function wellcome() {
    username = localStorage.getItem("username");

    if (!username || username === "null" || username.trim() === "") {
        console.warn("No hay usuario logueado. No se puede mostrar el mensaje de bienvenida.");
        return;
    }

    if (userNameSpan) {
        userNameSpan.innerHTML = username; // Asigna el valor de username al contenido HTML
    }
    // NOTA: window.location es un objeto, no una cadena. Para comparar la ruta, usa window.location.pathname
    if (window.location.pathname === "/home") {
        showMessageWithTypingEffect();
    }
}

function typeWriter(text, i = 0, callback) {
    if (dayMessageElement && i < text.length) { // Añadida comprobación de dayMessageElement
        dayMessageElement.innerHTML = text.substring(0, i + 1);
        setTimeout(() => typeWriter(text, i + 1, callback), 50); // velocidad de escritura (50 ms)
    } else if (callback) {
        callback();
    }
}

function showMessageWithTypingEffect() {
    const randomIndex = Math.floor(Math.random() * motivational_message_list.length);
    const message = motivational_message_list[randomIndex];

    typeWriter(message, 0, () => {
        setTimeout(() => {
            if (dayMessageElement) { // Añadida comprobación de dayMessageElement
                dayMessageElement.innerHTML = "";  // limpia antes de la siguiente
            }
            showMessageWithTypingEffect();
        }, 5000); // espera 5 segundos antes de mostrar el próximo mensaje
    });
}