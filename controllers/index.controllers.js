const db = require("../models/firebase");
const { response, request } = require("express");
const path = require("path");
const bcrypt = require('bcryptjs');
const sanitizeCreden= require('../sanitizacion/sanitizeCredenciales');
const sanitizeInputs = require('../sanitizacion/sanitizeInputs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Función para verificar si una contraseña coincide
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}


const general = (req = request, res = response) => {
  res.render("../public/views/index.hbs");
};

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

  res.render("../public/views/menu.hbs", {platillosGrupos});
};

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

    res.render("../public/views/menuAdmin.hbs", { platillosGrupos });
  } catch (error) {
    console.error(error);
    res.status(401).send('Token inválido');
  }
};

const about = (req = request, res = response) => {
  res.render("../public/views/about.hbs");
};

const formulario = (req = request, res = response) => {
  res.render("../public/views/nuevoProducto.hbs");
};

const signup = (req = request, res = response) => {
  res.render("../public/views/signup.hbs");
};

const chat = (req = request, res = response) => {
  res.render("../public/views/chat.hbs");
};

const registroFormulario = async (req = request, res = response) => {
  const { nombre, precio, descripcion } = req.body;
  const { foto } = req.files;

  // Sanitizar los datos del formulario
  const sanitizedNombre = sanitizeInputs(nombre);
  const sanitizedPrecio = sanitizeInputs(precio);
  const sanitizedDescripcion = sanitizeInputs(descripcion);

  //mover archivos cargados a carpeta updates
  const uploadPath = path.join(__dirname, "../public/updates", foto.name);
  const uploadPathFire = path.join("../updates", foto.name);

  foto.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({ err });
    }
  });

  const carga = async (nombre, precio, img, descripcion) => {
    const platilloNuevo = {
      nombre: sanitizedNombre,
      precio: Number(sanitizedPrecio),
      descripcion: sanitizedDescripcion,
      foto: img.replace(/\\/g, "/"),
    };
    await db.collection("platillos").add(platilloNuevo);
  };

  try {
    await carga(sanitizedNombre, sanitizedPrecio, uploadPathFire, sanitizedDescripcion);
    res.header('Content-Type', 'application/json').send({ success: true });

  } catch (error) {
    console.error("Error al cargar el platillo:", error);
    res.header('Content-Type', 'application/json').send({ success: false });
  }

};

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

const modificarProducto = async(req=request, res=response)=>{
  const {id} = req.params
  const { nombre, precio, descripcion} = req.body;
  
  const { foto } = req.files;

  // Sanitizar los datos del formulario
  const sanitizedNombre = sanitizeInputs(nombre);
  const sanitizedPrecio = sanitizeInputs(precio);
  const sanitizedDescripcion = sanitizeInputs(descripcion);

  //mover archivos cargados a carpeta updates
  const uploadPath = path.join(__dirname, "../public/updates", foto.name);
  const uploadPathFire = path.join("../updates", foto.name);

  foto.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({ err });
    }
  });

  const carga = async (nombre, precio, img, descripcion) => {
    const platilloNuevo = {
      nombre: sanitizedNombre,
      precio: Number(sanitizedPrecio),
      descripcion: sanitizedDescripcion,
      foto: img.replace(/\\/g, "/"),
    };
    await db.collection("platillos").doc(id).update(platilloNuevo);
  };

  try {
    await carga(sanitizedNombre, sanitizedPrecio, uploadPathFire, sanitizedDescripcion);
    res.header('Content-Type', 'application/json').send({ success: true });

  } catch (error) {
    console.error("Error al cargar el platillo:", error);
    res.header('Content-Type', 'application/json').send({ success: false });
  }

};

const login = (req = request, res = response)=>{
  res.render("../public/views/login.hbs")
}

const autenticacion = async(req = request, res = response)=>{
  const { username, password } = req.body;
  try {

    // Sanitizar los datos de entrada
    const sanitizedUsername = sanitizeCreden(username);
    const sanitizedPassword = sanitizeCreden(password);

    // Buscar credenciales basadas en el nombre de usuario
    const consulta = await db.collection("usuariosAdmin").where("usuario", "==", sanitizedUsername).get();

    if (consulta.empty) {
        console.log("No se encontraron credenciales para el usuario:", sanitizedUsername);
        //res.send("0");
        //return;
        return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Obtener las credenciales del primer documento coincidente
    const credenciales = consulta.docs[0].data();
    
    // Verificar si la contraseña proporcionada coincide con la contraseña almacenada
    const isPasswordValid = await bcrypt.compare(sanitizedPassword, credenciales.password);

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

      // Enviar una respuesta 
      return res.status(200).json({ token });
    }else{
      //res.send("0")
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

  } catch (error) {
    //res.send("0")
    //console.log(error);
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

const registro = (req = request, res = response) => {
  res.render("../public/views/signup.hbs")
};

const registroUsuario = async(req = request, res = response)=>{
  const { username, password, confirm_password } = req.body;
  try {

    const sanitizedUser = sanitizeCreden(username);
    const sanitizedPass = sanitizeCreden(password);
    const sanitizedPassConf = sanitizeCreden(confirm_password);

    if(sanitizedPass != sanitizedPassConf){
      res.send("2")
    }
    
    const carga = async (sanitizedUser, sanitizedPass) => {

      const encryptedPassword = await encryptPassword(sanitizedPass);

      const usuarioNuevo = {
        usuario: sanitizedUser,
        password: encryptedPassword
      };

      await db.collection("usuariosAdmin").add(usuarioNuevo);
    };

    try {
      await carga(sanitizedUser, sanitizedPass);
      res.send("1")
  
    } catch (error) {
      res.send("0")
    }
  

  } catch (error) {
    res.send("0")
  }
};


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
