const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Contexto del bot
const context = {
    name: null,
};

// Función para calcular similitud entre palabras (distancia de Levenshtein)
function obtener_similitud(word1, word2) {
    const a1 = word1.length;
    const a2 = word2.length;
    const matrix = Array(a1 + 1)
        .fill(null)
        .map(() => Array(a2 + 1).fill(null));

    for (let i = 0; i <= a1; i++) matrix[i][0] = i;
    for (let j = 0; j <= a2; j++) matrix[0][j] = j;

    for (let i = 1; i <= a1; i++) {
        for (let j = 1; j <= a2; j++) {
            const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return 1 - matrix[a1][a2] / Math.max(a1, a2);
}

// Palabras asociadas y respuestas
const asociacion = {
    hola: ["hoa", "hol", "hello", "hi","Buenas"],
    adiós: ["chau", "bye", "hasta luego"],
    gracias: ["thank you", "gracias", "espectacupar"],
    Bien: ["Bien", "Bien y tu?","Ta bien ", "pues bien"],

};

//buscar una palabra asociada
function Buscar_Palabras_asociadas(input) {
    input = input.toLowerCase();
    const palabras = input.split(/\s+/); // Dividir en palabras
    for (const palabra of palabras) {
        for (const [key, synonyms] of Object.entries(asociacion)) {
            if (key === palabra || synonyms.some((syn) => obtener_similitud(palabra, syn) > 0.7)) {
                return key;
            }
        }
    }
    return null;
}


//respuestas predefinidas
const respuestas = {
    hola: ["¡Hola! ¿Cómo estás?", "¡Hola! Espero que estés teniendo un gran día.", "¡Hey! ¿Qué tal?"],
    Bien: ["¡Me alegra escuchar eso!", "¡Qué bueno que estés bien!", "¡Perfecto!"],
    adiós: ["¡Hasta luego! Que tengas un buen día.", "¡Nos vemos pronto!", "¡Cuídate!"],
    gracias: ["¡De nada! Estoy aquí para lo que necesites.", "¡Con gusto!", "¡Es un placer ayudarte!"],
    default: ["Lo siento, no entendí eso. ¿Puedes intentar decirlo de otra manera?", "Hmm, no estoy seguro de qué quisiste decir.", "¿Podrías explicarlo de otra forma?"],
};


//generar respuesta del bot
function BotRespuesta(userMessage) {
    const regexNombre  = /me llamo ([a-zA-Z]+)/i;
    const match = userMessage.match(regexNombre );
    if (match) {
        context.name = match[1];
        return `¡Encantado de conocerte, ${context.name}! ¿En qué puedo ayudarte?`;
    }

    const palabra_asociada = Buscar_Palabras_asociadas(userMessage);
    if (palabra_asociada && respuestas[palabra_asociada]) {
        const opciones = respuestas[palabra_asociada];
        return opciones[Math.floor(Math.random() * opciones.length)];
    }
    const opcionesDefault = respuestas.default;
    return opcionesDefault[Math.floor(Math.random() * opcionesDefault.length)];
}



// Función para agregar mensajes al chat
function addMensaje(content, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = content;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Manejar envío de mensajes
sendButton.addEventListener("click", () => {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
        addMensaje(userMessage, "user");
        messageInput.value = "";

        setTimeout(() => {
            const botResponse = BotRespuesta(userMessage);
            addMensaje(botResponse, "bot");
        }, 500);
    }
});

// Enviar mensaje con Enter
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendButton.click();
    }
});
