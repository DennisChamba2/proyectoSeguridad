
const form = document.getElementById("formulario");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    
    fetch('/login', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            window.alert("Datos fuera del Rango")
        }
        // Si la respuesta es exitosa, extraer el token del cuerpo de la respuesta
        return response.json();
    })
    .then(data => {
        
        if (data.token) {
            // Si se recibe un token, redirigir al usuario a la página de menú administrativo
            window.location.href = '/menuA';
        } else {
            // Si no se recibe un token, mostrar un mensaje de error
            window.alert("Usuario y/o contraseña incorrecto");
        }
    })
    .catch(error => {
        console.error("Error al procesar la solicitud:", error);
        window.alert("Usuario y/o contraseña incorrectos")
    });
});
