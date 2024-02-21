//sanitizacion otros campos
const { blacklist } = require('validator');

// Función para sanitizar los datos de entrada
function sanitizeInput(input) {

    // Eliminar caracteres especiales y espacios en blanco
    const sanitizedInput = input.replace(/[^a-zA-Z0-9\s]/g, '');


    return sanitizedInput;
}


module.exports = sanitizeInput;