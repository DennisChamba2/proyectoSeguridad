const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;


const requireAuthentication = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const csrfToken = req.cookies.csrfToken;
  if (!csrfToken) {
    return res.redirect('/login');
  }

  try {
    // Verificar la validez del token CSRF
    jwt.verify(csrfToken, SECRET_KEY);
    next();
  } catch (error) {
    //En caso de no ser valido, redirige al login
    return res.redirect('/login');
  }
};

// Middleware para eliminar la cookie al cerrar la página
const deleteCookieOnClose = (req, res, next) => {
  
  const expiryDate = new Date(0);
  res.cookie('csrfToken', '', {
    expires: expiryDate,
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  return res.redirect('/login');
};

module.exports = { requireAuthentication, deleteCookieOnClose };
