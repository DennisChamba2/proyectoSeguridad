const db = require("./firebase");

const bcrypt = require('bcryptjs');

async function encryptPassword(password) {
    // Genera un salt aleatorio con 10 rondas de hashing
    const salt = await bcrypt.genSalt(10);
  
    // Encripta la contraseña con el salt
    const hashedPassword = await bcrypt.hash(password, salt);
  
    return hashedPassword;
  }
  
async function obtenerPlatillos() {
    try {
        // Obtener una referencia a la colección "platillos"
        // const platillosSnapshot = (await db.collection("platillos").get());
        
        const platilloNuevo = {
            nombre: "Nombre del Platillo",
            descripcion: "Descripción del Platillo",
            precio: 10.99,
            foto:"dasdad"
        };
        
        const encryptedPassword = await encryptPassword("123456");

        const usuario={
            usuario:"dennis",
            password:encryptedPassword
        }
        await db.collection("usuariosAdmin").add(usuario)


        //agregar un platillo
        // await db.collection("platillos").add(platilloNuevo)
        
        //eliminar platillos
        // await db.collection("platillos").doc("XJZd31uMilzSMWdQdkgK").delete()
        
        // const platillosSnapshot = (await db.collection("platillos").get());;

        //const credenciales = await (db.collection("usuariosAdmin").get())
        //console.log(credenciales.docs[0].data());
        // platillosSnapshot.docs.forEach((x)=>{
        //     console.log(x.data());
        //     console.log(x.id);
        // })

        // Hacer algo con la referencia a la colección (por ejemplo, loggearla)
        //console.log(platillosSnapshot.docs[0].data()); // Accede a los documentos de la colección
        //console.log(platillosSnapshot.docs[0].id); // id del archivo




    } catch (error) {
        console.error("Error al obtener platillos:", error);
    }
}

// Llama a la función asincrónica
obtenerPlatillos();