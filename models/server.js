const express = require("express");
const fileUpload = require("express-fileupload")
const cors = require('cors');
const cookieParser = require('cookie-parser');

class Server {
  constructor() {
    this.port = process.env.PORT
    this.app = express();
    this.RoutePath = "/"

    //middlewares
    this.middlewares()

    //rutas app 
    this.routes();

    // middleware cookieParser
    this.app.use(cookieParser());

  }

  middlewares(){
    //Permite la solicitud desde otros dominios
    this.app.use(cors());
    
    // Middleware para parsear datos codificados en URL en el cuerpo de la solicitud
    this.app.use(express.urlencoded({ extended: true }));

    //parceo y lectura de json y text en el body
    this.app.use(express.json()) 
    this.app.use(express.text())


    //Para subir archivos
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/'
    }))

    //plantillas
    this.app.set("view engine", "hbs")

    //directorio publico
    this.app.use(express.static('public'))

    // Middleware para analizar cookies en las solicitudes entrantes
    this.app.use(cookieParser());

  }
  //Definimos las rutas dento de index,routers
  routes() {
    this.app.use(this.RoutePath, require('../routes/index.routes'))
 
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("http://localhost:" + this.port);
    });
  }
}

module.exports = Server
