//sanitizacion para credenciales
const { blacklist } = require('validator');

// Función para sanitizar los datos de entrada del username
function sanitizeUser(input) {

    // Eliminamos los caracteres que no hemos definido
    const sanitizedInput = input.replace(/[^a-zA-Z0-9\s@.]/g, '');

    // Limitar la longitud máxima a 15 caracteres
    const maxLength = 15;
    const truncatedInput = sanitizedInput.slice(0, maxLength);

    return truncatedInput;
}
// Sanitizar datos de la contrasena
function sanitizePassword(input) {

    // Eliminamos los caracteres que no hemos definido
    const sanitizedInput = input.replace(/[^a-zA-Z0-9\s@.]/g, '');

    // Limitar la longitud maxima
    const maxLength = 15;
    const truncatedInput = sanitizedInput.slice(0, maxLength);

    return truncatedInput;
}

// Función para sanitizar los datos de entrada
function sanitizeInput(input) {

    // Eliminamos los caracteres que no hemos definido
    const sanitizedInput = input.replace(/[^a-zA-Z0-9\s]/g, '');

    return sanitizedInput;
}
module.exports = { sanitizeUser, sanitizePassword, sanitizeInput };
