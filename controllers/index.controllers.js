const db = require("../models/firebase");
const { response, request } = require("express");
const path = require("path");
const bcrypt = require('bcryptjs');
const {sanitizeUser}= require('../sanitizacion/sanitizeInputs');
const {sanitizePassword} = require('../sanitizacion/sanitizeInputs');
const {sanitizeInput} = require('../sanitizacion/sanitizeInputs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

//Funcion para encriptar la contrasena
async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Función para verificar si una contraseña coincide
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

// Redireccion por defecto
const general = (req = request, res = response) => {
  res.render("../public/views/index.hbs");
};

//Mostrar en menu a los usuarios 
const menu = async(req = request, res = response) => {
  const platillosSnapshot = await db.collection("platillos").get()
  const platillos = []


  platillosSnapshot.forEach((doc) => {
    platillos.push(doc.data());
  });

  // Agrupar los platillos en grupos de tres
  const platillosGrupos = [];
  for (let i = 0; i < platillos.length; i += 3) {
    platillosGrupos.push(platillos.slice(i, i + 3));
  }
  //Renderizacion a menu
  res.render("../public/views/menu.hbs", {platillosGrupos});
};

//Menu que un administrador puede gestionar
const menuAdmin = async (req, res) => {

  try {
    const platillosSnapshot = await db.collection("platillos").get();
    const platillos = [];

    platillosSnapshot.forEach((doc) => {
      platillos.push({ id: doc.id, ...doc.data() });
    });

    // Agrupar los platillos en grupos de tres
    const platillosGrupos = [];
    for (let i = 0; i < platillos.length; i += 3) {
      platillosGrupos.push(platillos.slice(i, i + 3));
    }
    //Renderizacion a menu para administradores
    res.render("../public/views/menuAdmin.hbs", { platillosGrupos });
  } catch (error) {
    console.error(error);
    res.status(401).send('Token inválido');
  }
};

//Renderiza la pagina about
const about = (req = request, res = response) => {
  res.render("../public/views/about.hbs");
};
//Renderiza la pagina para agregar un nuevo producto
const formulario = (req = request, res = response) => {
  res.render("../public/views/nuevoProducto.hbs");
};
//Renderiza la pagian de registro de administradores
const signup = (req = request, res = response) => {
  res.render("../public/views/signup.hbs");
};
//Renderiza la pagina de chat
const chat = (req = request, res = response) => {
  res.render("../public/views/chat.hbs");
};

//Funcion para agregar un nuevo producto al menu
const registroFormulario = async (req = request, res = response) => {
  const { nombre, precio, descripcion } = req.body;
  const { foto } = req.files;
  const extension = path.extname(foto.name);
  //Extenciones permitidas a subir
  const extensionesPermitidas = ['.jpg', '.jpeg', '.png'];

  // Sanitizar los datos del formulario
  const sanitizedNombre = sanitizeInput(nombre);
  const sanitizedPrecio = sanitizeInput(precio);
  const sanitizedDescripcion = sanitizeInput(descripcion);

  //Verificamos la extencion del archivo que se sube
  if (!extensionesPermitidas.includes(extension)) {
      return res.status(500).json({ err: 'error' });
  }else{
    const uploadPath = path.join(__dirname, "../public/updates", foto.name);
    
    foto.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ err });
      }
    });
  } 
  //Definimos el path de donde se guardara en la base
  const uploadPathFire = path.join("../updates", foto.name);

  //Funcion para subir el nuevo producto
  const carga = async (nombre, precio, img, descripcion) => {
    const platilloNuevo = {
      nombre: sanitizedNombre,
      precio: Number(sanitizedPrecio),
      descripcion: sanitizedDescripcion,
      foto: img.replace(/\\/g, "/"),
    };
    
    await db.collection("platillos").add(platilloNuevo);
  };
  //Invocamos a la funcion carga con los parametros adecuados
  try {
    await carga(sanitizedNombre, sanitizedPrecio, uploadPathFire, sanitizedDescripcion);
    res.header('Content-Type', 'application/json').send({ success: true });

  } catch (error) {
    console.error("Error al cargar el platillo:", error);
    res.header('Content-Type', 'application/json').send({ success: false });
  }

};

//Borrar un producto del menu
const borrarMenu = async(req=request, res=response)=>{
  const {id} = req.params
  try {
    await db.collection("platillos").doc(id).delete()
    res.header('Content-Type', 'application/json').send({ success: true });
  } catch (error) {
    console.error("Error al cargar el platillo:", error);
    res.header('Content-Type', 'application/json').send({ success: false });
  }
};

//Mostrar los datos del producto seleccionado para modificar
const mostrarProducto = async(req=request, res=response)=>{
  const {id} = req.params   
  try {
    const platilloDoc = await db.collection("platillos").doc(id).get();
    const producto = platilloDoc.data()

    producto.ide = id;
    
    res.render("../public/views/modificarProducto.hbs", {producto});
  } catch (error) {
    console.error("Error al cargar el platillo:", error);
    res.header('Content-Type', 'application/json').send({ success: false });
  }

};

//Gestionar los cambios de los datos de un producto
const modificarProducto = async(req=request, res=response)=>{
  const {id} = req.params
  const { nombre, precio, descripcion} = req.body;
  
  const { foto } = req.files;

  // Sanitizar los datos del formulario
  const sanitizedNombre = sanitizeInput(nombre);
  const sanitizedPrecio = sanitizeInput(precio);
  const sanitizedDescripcion = sanitizeInput(descripcion);

  //Verificamos la extencion del archivo que se sube
  if (!extensionesPermitidas.includes(extension)) {
    return res.status(500).json({ err: 'error' });
  }else{
    const uploadPath = path.join(__dirname, "../public/updates", foto.name);
    
    foto.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ err });
      }
    });
  } 

  //Definimos el path de donde se guardara en la base
  const uploadPathFire = path.join("../updates", foto.name);

  const carga = async (nombre, precio, img, descripcion) => {
    const platilloNuevo = {
      nombre: sanitizedNombre,
      precio: Number(sanitizedPrecio),
      descripcion: sanitizedDescripcion,
      foto: img.replace(/\\/g, "/"),
    };
    await db.collection("platillos").doc(id).update(platilloNuevo);
  };
  //LLamado a la funcion carga con los parametros correctos
  try {
    await carga(sanitizedNombre, sanitizedPrecio, uploadPathFire, sanitizedDescripcion);
    res.header('Content-Type', 'application/json').send({ success: true });

  } catch (error) {
    console.error("Error al cargar el platillo:", error);
    res.header('Content-Type', 'application/json').send({ success: false });
  }

};
//Renderizamos la pantalla de login
const login = (req = request, res = response)=>{
  res.render("../public/views/login.hbs")
}

const autenticacion = async(req = request, res = response)=>{
  const { username, password } = req.body;

  try {
    //verificamos la longitud de los caracteres del usuario y contrasena
    if(username.length > 15 ){
      return res.status(401).json({ error: "Caracteres fuera del rango" });
    }
    if(password.length < 6 ){
      return res.status(401).json({ error: "Caracteres fuera del rango" });
    }
    // Sanitizar los datos de entrada
    const sanitizedUsername = sanitizeUser(username);
    const sanitizedPassword = sanitizePassword(password);
    // Buscar credenciales basadas en el nombre de usuario
    const consulta = await db.collection("usuariosAdmin").where("usuario", "==", sanitizedUsername).get();

    if (consulta.empty) {  
        return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Obtener las credenciales del primer documento coincidente
    const credenciales = consulta.docs[0].data();
    
    // Verificar si la contraseña proporcionada coincide con la contraseña almacenada
    const isPasswordValid = await bcrypt.compare(sanitizedPassword, credenciales.password);

    //Verificamos que el nombre de usuario y la contrasena coincidan
    if (sanitizedUsername === credenciales.usuario && isPasswordValid ){
      // Generar un token CSRF único y aleatorio
      const csrfToken = Math.random().toString(36).substring(7);
      // Generar el token de autenticación
      const token = jwt.sign({ username: sanitizedUsername, csrfToken }, SECRET_KEY, { expiresIn: '5m' });

      // Configurar la cookie para almacenar el token CSRF
      res.cookie('csrfToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });

      // Enviar una respuesta exitosa con el token
      return res.status(200).json({ token });
    }else{
      //Error
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

//Renderizar a la pagina de regsitro de administradores
const registro = (req = request, res = response) => {
  res.render("../public/views/signup.hbs")
};
//Gestionamos el resgistro de un nuevo adminsitrador
const registroUsuario = async(req = request, res = response)=>{
  const { username, password, confirm_password } = req.body;
  try {
    //Verificamos la longitud de los caracteres del usuario y contrasena
    if(username.length > 15 ){
      return res.status(401).json({ error: "El usuario no debe ser mayor a 15 caracteres" });
    }
    if(password.length < 6 ){
      return res.status(401).json({ error: "La contrasena debe ser entre 6 y 15 caracteres" });
    }
    //Sanitizacion de los datos de entrada
    const sanitizedUser = sanitizeUser(username);
    const sanitizedPass = sanitizePassword(password);
    const sanitizedPassConf = sanitizePassword(confirm_password);

    //verificamos si coincide las conrasenas
    if(sanitizedPass != sanitizedPassConf){
      res.send("2")
    }
    
    //Funcion para agregar un nuevo usuario
    const carga = async (sanitizedUser, sanitizedPass) => {

      const encryptedPassword = await encryptPassword(sanitizedPass);
      //cracion de un usuario con sus parametros
      const usuarioNuevo = {
        usuario: sanitizedUser,
        password: encryptedPassword
      };
      //agregamos el usuario a la base de datos
      await db.collection("usuariosAdmin").add(usuarioNuevo);
    };

    try {
      //llamado a la funcion que agregara el usuario a  la base de datos
      await carga(sanitizedUser, sanitizedPass);
      res.send("1")
  
    } catch (error) {
      res.send("0")
    }

  } catch (error) {
    res.send("0")
  }
};

//Exportacion de las funciones
module.exports = {
  general,
  menu,
  about,
  formulario,
  signup,
  registroFormulario,
  menuAdmin,
  borrarMenu,
  mostrarProducto, 
  modificarProducto,
  chat, 
  login,
  autenticacion,
  registro,
  registroUsuario
};
