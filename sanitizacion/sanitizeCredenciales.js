//sanitizacion para credenciales
const { blacklist } = require('validator');

// Función para sanitizar los datos de entrada
function sanitizeInput(input) {

    // Eliminar caracteres especiales y espacios en blanco
    const sanitizedInput = input.replace(/[^a-zA-Z0-9\s@.]/g, '');

    // Limitar la longitud máxima a 15 caracteres
    const maxLength = 15;
    const truncatedInput = sanitizedInput.slice(0, maxLength);

    return truncatedInput;
}


module.exports = sanitizeInput;