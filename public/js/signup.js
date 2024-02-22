const form = document.getElementById("formulario");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    
    fetch('/registro', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                if (response.status === 401) {
                  window.alert(data.error);
                }
            }
            )
        }
        // Si la respuesta es exitosa, extraer el token del cuerpo de la respuesta
        return response.text();
    })
    .then(data => {
        // Evitar que la respuesta se muestre directamente en la página
        event.preventDefault();
        if (data === "2") {
            window.alert("Las contraseñas no coinciden")
        }
        if (data === "1") {
            window.alert("Usuario Creado")
            document.location.href = '/login';
        }
        else {
            window.alert("creaccion fallida")
        }
        
    })
    .catch(error => {
        window.alert("creacion fallida")
    });
});
