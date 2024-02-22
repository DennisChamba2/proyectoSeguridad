const form = document.getElementById("formulario");
const productoId = document.getElementById("platilloId").value;

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    
    fetch(`/producto/${productoId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Evitar que la respuesta se muestre directamente en la página
        event.preventDefault();

        console.log('Respuesta del servidor:', data);

        if (data.success === true) {
            window.alert("Producto modificado exitosamente")
            document.location.href = '/menuA';
        } else {
            window.alert("Fallo al cargar el producto")
        }
    })
    .catch(error => {
        window.alert("Fallo al cargar el producto")
    });
});

function mostrarImagenSeleccionada() {
    const inputFoto = document.getElementById('foto');
    const vistaPrevia = document.getElementById('vistaPrevia');

    if (inputFoto.files && inputFoto.files[0]) {
        const lector = new FileReader();

        lector.onload = function (e) {
            vistaPrevia.innerHTML = '<img src="' + e.target.result + '" alt="Imagen seleccionada" style="max-width: 100%; max-height: 200px;">';
        };

        lector.readAsDataURL(inputFoto.files[0]);
    } else {
        vistaPrevia.innerHTML = '';
    }
}

