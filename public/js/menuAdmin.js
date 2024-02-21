// Función para modificar un platillo
function modificarPlatillo(platilloId) {
  window.location.href = `/producto/${platilloId}`
}

// Función para eliminar un platillo
function eliminarPlatillo(platilloId) {
  // Pregunta al usuario si está seguro de eliminar
  const confirmacion = confirm("¿Estás seguro de que quieres eliminar este producto?");
  
  // Si el usuario confirma
  if (confirmacion) {
    fetch(`/producto/${platilloId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al borrar el platillo: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // Muestra el mensaje de éxito
          alert("Producto eliminado exitosamente");
          
          // Recarga la página
          location.reload();
        } else {
          console.log("Error al borrar el platillo:", data);
        }
      })
      .catch((error) => {
        console.error("Error al borrar el platillo:", error);
      });
  }
  // Si el usuario no confirma, no se hace nada
}