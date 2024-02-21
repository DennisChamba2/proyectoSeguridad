const form = document.getElementById("formulario");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    
    fetch('/registro', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // Evitar que la respuesta se muestre directamente en la página
        event.preventDefault();
        if (data === "2") {
            window.alert("Las contraseñas no coinciden")
        }
        if (data === "1") {
            document.location.href = '/login';
        } else {
            window.alert("creaccion fallida")
        }
    })
    .catch(error => {
        window.alert("creacion fallida")
    });
});
