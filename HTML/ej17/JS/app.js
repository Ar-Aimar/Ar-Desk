window.addEventListener("load", (event) => {  
    console.log("Página cargada");

    let fileInput = document.getElementById('fileInput');
    console.log( "Variable crear fileInput" );
    let fileContent = document.getElementById('fileContent');
    console.log( "Variable crear fileContent" );
    let btnOpen = document.getElementById('importarTextoPlano');
    console.log( "Variable crear btnOpen" );
    let btnSave = document.getElementById('descargarTextoPlano');
    console.log( "Variable crear btnSave" );

    let btnUndo = document.getElementById('deshacerTexto');
    let btnRedo = document.getElementById('rehacerTexto');
    console.log( "Variable crear btnUndo" );
    console.log( "Variable crear btnRedo" );
    
    

    //ejecuta el input pulsando un botón
    btnOpen.addEventListener('click', () => {
        fileInput.click();
    });

    //ejecuta la función guardarArchivo pulsando un botón
    btnSave.addEventListener('click', async () => {
        await guardarArchivo(fileContent.innerText);
    });

    // Función Deshacer
    btnUndo.addEventListener('click', () => {
        document.execCommand('undo', false, null);
    });

    // Función Rehacer
    btnRedo.addEventListener('click', () => {
        document.execCommand('redo', false, null);
    });

    //ejecuta el input pulsando Control + I
    window.addEventListener('keydown', (tecla) => {
        // e.ctrlKey detecta Control, e.metaKey detecta Command (Mac)
        if ((tecla.ctrlKey || tecla.metaKey) && tecla.key.toLowerCase() === 'i') {
            
            // Evitamos que el navegador abra herramientas de inspección o ponga cursiva
            tecla.preventDefault(); 
            
            console.log("Atajo detectado: Abriendo selector de archivos...");
            fileInput.click();
        }
        //ejecuta la función guardarArchivo pulsando Control + S
        if ((tecla.ctrlKey || tecla.metaKey) && tecla.key.toLowerCase() === 's') {
            // Evitamos que el navegador intente guardar la página
            tecla.preventDefault();
            console.log("Atajo detectado: Guardando archivo...");
            guardarArchivo(fileContent.innerText);
        }
    });

    //importar archivo
    importarArchivo(fileInput, fileContent);


    //actualizar el estado de los botones de deshacer y rehacer cada vez que el contenido cambie o se haga clic en el área de texto
    fileContent.addEventListener('input', actualizarEstadoUndoRedo);
    fileContent.addEventListener('click', actualizarEstadoUndoRedo);
    window.addEventListener('keyup', actualizarEstadoUndoRedo);

    btnUndo.addEventListener('click', () => {
        document.execCommand('undo', false, null);
        actualizarEstadoUndoRedo(); // <--- Llamamos aquí también
    });
    btnRedo.addEventListener('click', () => {
        document.execCommand('redo', false, null);
        actualizarEstadoUndoRedo(); // <--- Llamamos aquí también
    });


    //inportar archivos arrastrando y soltando
    let dropZone = document.getElementById('backgroundEditor');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
    });

    dropZone.addEventListener('dragover', () => {
    // Aplicamos un filtro de brillo bajo o un fondo negro semitransparente
        dropZone.style.backgroundColor = "rgba(0, 0, 0, 0.4)"; 
        dropZone.style.transition = "background-color 0.2s ease";
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = ""; // Elimina el estilo inline y vuelve al CSS
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = "transparent";
        dropZone.style.transition = "background-color 0.2s ease";
    });
    
    // Al soltar el archivo
    dropZone.addEventListener('drop', (e) => {
    dropZone.style.backgroundColor = ""; // Volver al fondo del CSS inmediatamente
    
    let file = e.dataTransfer.files[0];
    if (file) {
        // Reutilizamos tu lógica de lectura
        let reader = new FileReader();
        nombreArchivoActual = file.name;

        reader.onload = (event) => {
            let fileContent = document.getElementById('fileContent');
            let hojaBlanca = document.getElementById('backgroundFile');
            
            fileContent.textContent = event.target.result;
            hojaBlanca.style.display = 'block';
            
            // Forzar actualización de iconos deshacer/rehacer
            if (typeof actualizarEstadoUndoRedo === "function") {
                actualizarEstadoUndoRedo();
            }
        };
        reader.readAsText(file);
    }

});

//cortar, copiar y pegar texto plano
let btnCut = document.getElementById('cortarTextoPlano');
let btnCopy = document.getElementById('copiarTextoPlano');
let btnPaste = document.getElementById('pegarTextoPlano');

// Función Cortar
btnCut.addEventListener('click', () => {
    fileContent.focus(); // Aseguramos que el foco esté en el editor
    document.execCommand('cut');
    actualizarEstadoUndoRedo(); // Actualizamos los iconos de undo/redo
});

// Función Copiar
btnCopy.addEventListener('click', () => {
    fileContent.focus();
    document.execCommand('copy');
});

// Función Pegar
btnPaste.addEventListener('click', async () => {
    fileContent.focus();
    try {
        // Intentamos usar la API moderna primero (necesita permiso del usuario)
        const texto = await navigator.clipboard.readText();
        document.execCommand('insertText', false, texto);
    } catch (err) {
        // Si falla la API moderna, intentamos el método tradicional
        document.execCommand('paste');
    }
    actualizarEstadoUndoRedo();
});

// Advertencia de cambios sin guardar al cerrar o recargar la página
window.addEventListener('beforeunload', (e) => {
    if (hayCambiosSinGuardar) {
        // La mayoría de navegadores modernos muestran su propio mensaje estándar
        // por razones de seguridad, pero necesitan que preventDefault() y returnValue existan.
        e.preventDefault();
        e.returnValue = ''; 
    }
});


});

let nombreArchivoActual = "nuevo_documento.txt";
console.log( "Variable crear nombreArchivoActual: " + nombreArchivoActual );

let contenidoOriginal = ""; // Guardará el texto tal cual se abrió o guardó
let hayCambiosSinGuardar = false;


function importarArchivo(fileInput, fileContent) {
    fileInput.addEventListener('change', function(event) {
        //obtener el archivo del input
        let file = event.target.files[0];
        console.log("Archivo seleccionado: " + file.name);
        
        nombreArchivoActual = file.name;
        console.log("Nombre del archivo actual: " + nombreArchivoActual);
        // leer el contenido del archivo
        let reader = new FileReader();
        //FileReader es para pedir permiso al navegador para leer archivos locales.
        reader.onload = function(e) {
            let textoLimpio = e.target.result;
            fileContent.textContent = e.target.result;

            contenidoOriginal = textoLimpio; 
            hayCambiosSinGuardar = false;
            actualizarIconoGuardar();

            let hojaBlanca = document.getElementById('backgroundFile');
            hojaBlanca.style.display = 'block';
            console.log("Archivo contenido mostrado");
            //e.target.result: Es el contenido real del archivo que el lector encontró.
            //fileContent.textContent: Es el lugar donde quieres mostrar ese contenido (por ejemplo, una caja de texto en tu página web).
        };
        reader.readAsText(file);
        
    });

    // Cada vez que el usuario escriba algo en el área de texto, actualizamos el estado del icono de guardar
    fileContent.addEventListener('input', () => {
        actualizarIconoGuardar();
        actualizarEstadoUndoRedo(); // Aprovechamos para actualizar los otros iconos
    });
}

async function guardarArchivo(contenido) {
    // El API de File System Access es una forma moderna y eficiente de guardar archivos directamente desde el navegador
    // pero no todos los navegadores lo soportan. Por eso, el código incluye una verificación para usarlo si está disponible
    // y si no, recurre a un método más tradicional usando blobs y enlaces de descarga.
    if ('showSaveFilePicker' in window) {

        // Si el navegador soporta el API de File System Access, lo usamos para guardar el archivo
        try {
            // showSaveFilePicker abre un diálogo para que el usuario elija dónde guardar el archivo y con qué nombre
            let handle = await window.showSaveFilePicker({
                // Nombre sugerido para el archivo = el nombre del archivo que se ha abierto
                // o "nuevo_documento.txt" si no se ha abierto ninguno
                suggestedName: nombreArchivoActual,

                types: [{
                    description: 'Archivo de Texto',
                    accept: {'text/plain': ['.txt', '.html', '.js', '.css']},
                }],
            });

            // Si el usuario selecciona un lugar para guardar el archivo, se crea un objeto WritableStream para escribir el contenido en el archivo
            let writable = await handle.createWritable();
            await writable.write(contenido);
            await writable.close();

            contenidoOriginal = contenido;
            hayCambiosSinGuardar = false;
            actualizarIconoGuardar()
            
            console.log("Archivo guardado con éxito");

        } catch (error) {
            console.log("El usuario a cancelado el guardado o a habido un error.");
        }
    } else {
        // Si el navegador no soporta el API de File System Access, usamos otro método para descargar el archivo
        let blob = new Blob([contenido], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivoActual;
        a.click();
        URL.revokeObjectURL(url);

        contenidoOriginal = contenido;
        hayCambiosSinGuardar = false;
        actualizarIconoGuardar();
    }
}

function actualizarEstadoUndoRedo() {
    // Comprobamos si el navegador permite deshacer o rehacer en este momento
    let puedeDeshacer = document.queryCommandEnabled('undo');
    let puedeRehacer = document.queryCommandEnabled('redo');

    // Buscamos las imágenes dentro de los botones
    let imgUndo = document.querySelector('#deshacerTexto img');
    let imgRedo = document.querySelector('#rehacerTexto img');

    if (imgUndo) {
        imgUndo.src = puedeDeshacer 
            ? "IMG/undo_100dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.png"  // Negro
            : "IMG/undo_100dp_999999_FILL0_wght400_GRAD0_opsz48.png"; // Gris
    }

    if (imgRedo) {
        imgRedo.src = puedeRehacer 
            ? "IMG/redo_100dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.png"  // Negro
            : "IMG/redo_100dp_999999_FILL0_wght400_GRAD0_opsz48.png"; // Gris
    }
}

function procesarArchivoArrastrado(file) {
    nombreArchivoActual = file.name; // Actualizamos el nombre global
    console.log("Archivo arrastrado: " + nombreArchivoActual);

    let reader = new FileReader();
    reader.onload = (e) => {
        let fileContent = document.getElementById('fileContent');
        let hojaBlanca = document.getElementById('backgroundFile');
        
        fileContent.textContent = e.target.result;
        hojaBlanca.style.display = 'block';
        
        // Actualizamos los botones de deshacer/rehacer porque el contenido cambió
        if (typeof actualizarEstadoUndoRedo === "function") {
            actualizarEstadoUndoRedo();
        }
    };
    reader.readAsText(file);
}

function actualizarIconoGuardar() {
    let btnSave = document.getElementById('descargarTextoPlano');
    let imgSave = btnSave.querySelector('img');
    
    // Usamos innerText para obtener el texto plano del editor
    let contenidoActual = document.getElementById('fileContent').innerText;

    // Comparamos
    hayCambiosSinGuardar = (contenidoActual !== contenidoOriginal);

    if (imgSave) {
        imgSave.src = hayCambiosSinGuardar 
            ? "IMG/download_100dp_1F1F1F_FILL0_wght400_GRAD0_opsz48.png"  // Negro
            : "IMG/download_100dp_999999_FILL0_wght400_GRAD0_opsz48.png"; // Gris
    }
}

