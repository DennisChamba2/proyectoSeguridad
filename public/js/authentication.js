
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const sanitizeInput = require('../public/js/sanitize');
const sanitizePassword = require('../public/js/sanitize');


const firebaseConfig = {
    apiKey: "AIzaSyB44yt5ueiw6Paq-hZpM0xKPrU2VBu2zBg",
    authDomain: "prj-webav1b.firebaseapp.com",
    projectId: "prj-webav1b",
    storageBucket: "prj-webav1b.appspot.com",
    messagingSenderId: "152348322004",
    appId: "1:152348322004:web:5efa7e3e654763663c3341"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Obtén una instancia de Firestore
const db = getFirestore(app);

// Función para registrar un nuevo usuario en Firestore
async function registrarUsuario(username, password) {
    try {
        // Agrega un documento a la colección 'usuarios'
        console.log("entre en registrarUsuario")
        const docRef = await addDoc(collection(db, "usuarios"), {
            username: username,
            password: password,
            
        });
        console.log("Usuario registrado con ID:", docRef.id);
        // Aquí podrías redirigir a otra página o realizar alguna acción después de registrar al usuario
    } catch (error) {
        console.error("Error al registrar usuario:", error);
    }
}

// Evento para el envío del formulario de registro
document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe por defecto

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const sanitizedUser = sanitizeInput(username);
    const sanitizedPass = sanitizePassword(password);

    registrarUsuario(sanitizedUser, sanitizedPass);
});
