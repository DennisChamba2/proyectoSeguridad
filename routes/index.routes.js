const { Router } = require("express");
const { general, menu, 
  about, formulario, 
  signup, registroFormulario,
   menuAdmin, borrarMenu,
  mostrarProducto, modificarProducto,
  chat, login, autenticacion,
  registro, registroUsuario} = require("../controllers/index.controllers");

const { requireAuthentication } = require('../middlewares/authMiddleware');
const { deleteCookieOnClose } = require('../middlewares/authMiddleware');

const router = Router()

  router.get("/", general );

  router.get("/menu", menu);

  router.get("/about", about);
  
  router.get("/producto", requireAuthentication, formulario);
  
  router.get("/signup", requireAuthentication, signup);
  
  router.post("/producto", requireAuthentication, registroFormulario);
  
  router.get('/menuA', requireAuthentication, menuAdmin);
  
  router.delete("/producto/:id", requireAuthentication, borrarMenu);

  router.get("/producto/:id", requireAuthentication, mostrarProducto);

  router.put("/producto/:id", requireAuthentication, modificarProducto);

  //chat

  router.get("/chat", chat)

  //login
  router.get("/login", login )
  router.post("/login", autenticacion )

  //registro
  router.get("/registro", registro )
  router.post("/registro", requireAuthentication, registroUsuario )

  //cerrar sesion
  router.get("/cerrar-sesion", deleteCookieOnClose, login)


module.exports = router