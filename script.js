import { obtenerJson } from "https://desarrollo-aplicaciones.vercel.app/2024/code/obtener-json.js";
import { validarSecreto } from "https://desarrollo-aplicaciones.vercel.app/2024/code/validar-secreto.js";

let cotizacionInterval; 

async function inicio() {
    const secreto = document.getElementById("secreto").value;
    const dni = "43680714"; 
    const resultDiv = document.getElementById("result");
    const cotizacionDiv = document.getElementById("cotizacion");
    const loadingDiv = document.getElementById("loading"); 
    resultDiv.innerHTML = ""; 
    cotizacionDiv.style.display = "none"; // Ocultar la caja de cotización al inicio
    loadingDiv.style.display = "block"; // Mostrar el efecto de carga

    if (await validarSecreto(dni, secreto)) {
        await mostrarCotizacion(cotizacionDiv);
    } else {
        resultDiv.innerHTML = "Palabra secreta inválida"; // Mostrar mensaje de error
    }

    loadingDiv.style.display = "none"; // Ocultar el efecto de carga al final
}

// botón
document.getElementById("submit").addEventListener("click", () => {
    inicio();
});

// cotización del dólar en la caja
async function mostrarCotizacion(cotizacionDiv) {
    try {
        const dolarBlue = await obtenerJson('https://dolarapi.com/v1/dolares/blue');

        // Verifica los datos
        if (!dolarBlue) {
            throw new Error("Respuesta vacía de la API");
        }

        // Mostrar la cotización en la caja
        cotizacionDiv.innerHTML = `
            <p><strong>Dólar Blue:</strong></p>
            <p><strong>Compra:</strong> ${dolarBlue.compra}</p>
            <p><strong>Venta:</strong> ${dolarBlue.venta}</p>
            <p><strong>Fecha:</strong> ${new Date(dolarBlue.fechaActualizacion).toLocaleString()}</p>
        `;
        cotizacionDiv.style.display = "block"; // Mostrar la caja de cotización
    } catch (error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "Error al obtener la cotización del dólar."; // Mostrar mensaje de error
        console.error("Error detallado:", error); // Log más detallado
    }
}

// Función para limpiar el intervalo al cerrar o cambiar de página
function limpiarIntervalo() {
    if (cotizacionInterval) {
        clearInterval(cotizacionInterval);
    }
}

// Limpiar el intervalo cuando la página se cierre o cambie
window.addEventListener("beforeunload", limpiarIntervalo);
