
document.addEventListener("DOMContentLoaded", () => {
    const selectFont = document.getElementById('selectFont');
    const fileContent = document.getElementById('fileContent');

    if (selectFont && fileContent) {
        
        // Escuchar el cambio de selección
        selectFont.addEventListener('change', () => {
            const fuenteSeleccionada = selectFont.value;

            // 1. Aplicar la fuente al editor
            fileContent.style.fontFamily = fuenteSeleccionada;

            // 2. Aplicar la fuente al propio selector para que se vea la vista previa
            selectFont.style.fontFamily = fuenteSeleccionada;

            // 3. Notificar al sistema de guardado que hay un cambio visual
            // (Opcional: puedes llamar a actualizarIconoGuardar() si es global)
            if (typeof actualizarIconoGuardar === "function") {
                actualizarIconoGuardar();
            }

            console.log("Tipografía cambiada a: " + fuenteSeleccionada);
        });

        // Inicializar el estilo del selector al cargar
        selectFont.style.fontFamily = selectFont.value;
    } else {
        console.error("No se encontró el selector de fuentes o el área de contenido.");
    }
});