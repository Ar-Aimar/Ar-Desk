window.addEventListener("load", (event) => {  
    console.log("Página cargada");

    //detectar boton
    let btnGenerarCuadrados = document.querySelector("#btnGenerarCuadrados");
    console.log("Botón cargado: " + btnGenerarCuadrados);
    
    
    btnGenerarCuadrados.addEventListener("click", crear);
});

function crear() {
    let cantidad = document.getElementById("cantidadCuadrados").value;

    if (cantidad >= 0 && cantidad <= 100) {
    console.log("crear");

    
    let section = document.getElementById("container");

    //limpiar el area
    section.innerHTML = "";
    for (let i = 0; i < cantidad; i++) {
        setTimeout(() => crearCuadrado(section), 100 * i);
        }
    }else {
        //muestra una alerta de error
        console.log("Error cantidad");
        alert("La cantidad debe ser entre 0 y 100");
    }
}

function crearCuadrado(section) {
        //crear cuadrado
        let cuadrado = document.createElement("div");
        

        editar(cuadrado);

        section.appendChild(cuadrado);
}

function cambiarColor() {
    //aleatorizamos las variables con un numero máximo de 255
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);

    return "rgb(" + red + ", " + green + ", " + blue + ")";


}

function cambiarGrosor() {
    //numero aleatorio entre 1 y 20
    let grosor = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    grosor = grosor + "px";
    return grosor;
}

function cambarEstilo() {
    //creamos los posibles estilos
    let estilos = ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"];
    //creamos una variable que coja un array de la anterior varialbe, el array que cojerá sera un numero aleatorio  con máximo
    //el número estilos, y gracias al floor se redondea
    let estilo = estilos[Math.floor(Math.random() * estilos.length)];
    return estilo;
}

function cambiarWidth(left) {
    let sectionWidth = document.getElementById("container").offsetWidth;
    console.log("sectionWidth: " + sectionWidth);
    console.log("left: " + left);
    //quitar el "px" del left
    left = parseInt(left);
    //numero aleatorio entre 10 y el espacio disponible (ancho de la ventana - posición)
    let max = (sectionWidth - left - 20);
    console.log("max: " + max);
    let width = Math.floor(Math.random() * (max - 10 + 1)) + 10;
    console.log("width: " + width);
    width = width + "px";
    return width;
}

function cambiarHeight(top) {
    let sectionHeight = document.getElementById("container").offsetHeight;
    console.log("sectionHeight: " + sectionHeight);
    console.log("top: " + top);
    //quitar el "px" del top
    top = parseInt(top);
    //numero aleatorio entre 10 y el espacio disponible (alto de la ventana - posición)
    let max = (sectionHeight - top - 20);
    console.log("max: " + max);
    let height = Math.floor(Math.random() * (max - 10 + 1)) + 10;
    height = height + "px";
    return height;
}

function cambiarTop() {
    let sectionHeight = document.getElementById("container").offsetHeight;
    sectionHeight = parseInt(sectionHeight);
    //numero aleatorio entre 0 y el alto de la ventana - 20
    let top = Math.floor(Math.random() * (sectionHeight - 20));
    top = top + "px";
    return top;
}

function cambiarLeft() {
    let sectionWidth = document.getElementById("container").offsetWidth;
    sectionWidth = parseInt(sectionWidth);
    //numero aleatorio entre 0 y el ancho de la ventana - 20
    let left = Math.floor(Math.random() * (sectionWidth - 20));
    left = left + "px";
    return left;
}
function cuadradoEstilos(cuadrado) {
    let left = cambiarLeft();
    let top = cambiarTop();
    console.log("left: " + left);
    console.log("top: " + top);
    cuadrado.style.borderColor = cambiarColor();
    cuadrado.style.borderWidth = cambiarGrosor();
    cuadrado.style.borderStyle = cambarEstilo();
    cuadrado.style.top = top;
    cuadrado.style.left = left;
    console.log("left: " + left);
    cuadrado.style.width = cambiarWidth(left);
    cuadrado.style.height = cambiarHeight(top);
    cuadrado.style.position = "absolute";
}

function editar(cuadrado) {
    console.log("editar");
    
    cuadradoEstilos(cuadrado);
}