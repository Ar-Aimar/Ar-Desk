//Te escuche una vez que se podia hacer esto y queria probar
let body = document.querySelector("body");
body.innerHTML =
    '<main>' + 
        '<input id="buscar" type="text" placeholder="Traducir...">' + 
        '<button id="btn_pulsa">Buscar</button>' + 
        '<section>' + 
            '<p id="ingles">' + 

            '</p>' + 

            '<ol id="lista">' + 

            '</ol>' + 
        '</section>' + 
    '</main>';


let datos = ["queso", "mapa", "encrucijada", "racimo", "herboristería", "embuste", "reliquia", "aldeano", "esmeralda", "tipografía"];
let traduction = ["Cheese", "Map", "Crossroads", "Bunch", "Herbalist", "Lie", "Relic", "Villager", "Emerald", "Typography"];
let definiciones = [
    [
        "Producto obtenido por maduración de la cuajada de la leche con características propias para cada uno de los tipos según su origen o método de fabricación.",
        "(extremidad inferior del cuerpo humano).",
        "Persona que se halla en medio de un grupo y estorba la comunicación."
    ],
    [
        "Representación geográfica de la Tierra o parte de ella en una superficie plana.",
        "Representación geográfica de una parte de la superficie terrestre, en la que se da información relativa a una ciencia determinada.",
        "Lo que sobresale en un género, habilidad o producción."
    ],
    [
        "Lugar en donde se cruzan dos o más calles o caminos.",
        "Ocasión que se aprovecha para hacer daño a alguien, emboscada, asechanza.",
        "Situación difícil en que no se sabe qué conducta seguir."
    ],
    [
        "Conjunto de uvas sostenidas en un mismo tallo que pende del sarmiento.",
        "Conjunto de frutas sostenidas por un eje común.",
        "Conjunto de cosas menudas dispuestas con alguna semejanza de racimo.",
        "Conjunto de flores o frutos sostenidos por un eje común, y con pecíolos casi iguales, más largos que las mismas flores; p. ej., en la vid."
    ],
    [
        "Tienda en que se venden hierbas y plantas medicinales.",
    ],
    [
        "Mentira disfrazada con artificio.",
        "Baratijas, dijes y otras alhajas curiosas, pero de poco valor."
    ],
    [
        "Residuo que queda de un todo.",
        "Parte del cuerpo de un santo.",
        "Aquello que, por haber tocado el cuerpo de un santo, es digno de veneración.",
        "Vestigio de cosas pasadas."
    ],
    [
        "Natural o habitante de una aldea.",
        "Perteneciente o relativo a una aldea",
        "Propio o característico de la persona aldeana"
    ],
    [
        "Gema transparente muy apreciada, variedad del berilo, teñida de verde por el óxido de cromo.",
        "Dicho de un color: Semejante al de la esmeralda",
        "De color esmeralda."
    ],
    [
        "arte de imprimir",
        "taller donde se imprime",
        "Modo o estilo en que está impreso un texto.",
        "Clase de tipos de imprenta"
    ]
];



function detectarBuscar() {

//añadir variable de lo que buscasa
let buscar = document.querySelector("#buscar");

console.log("buscar = " + buscar);

//convertir todas las letras a minusculas
let buscarValue = buscar.value;
console.log("buscarValue = " + buscarValue);
let buscarLetters = buscarValue.toLowerCase();
console.log("buscarLetters = " + buscarLetters);


let ingles = document.querySelector("#ingles");


//cosas
for (let i=0; i < datos.length; i++) {
    //si alguno delos datos identificado con el numero es igual a el texto en input
  if(datos[i] == buscarLetters) {
    //al tener el i aplicarlo para que busque y añada la palabra traducida
    ingles.innerHTML = traduction[i];
    //decirle donde se endcuentra el <ol>
    let lista = document.querySelector("#lista");
    console.log(definiciones[i].length);
    //variable externa para agrupar 
        let definicionAditivo = [];
        //que añada a la variable el código correspondiente todas las veces que sean necesarias
    for (let e=0; e < definiciones[i].length; e++){
        definicionAditivo.push("<li>" + definiciones[i][e] + "</li>");
    };
    //mostrar las listas que se an reunido anteriormente
    lista.innerHTML = definicionAditivo;


  } else {
    //error

    ingles.innerHTML = "<p> Palabra " + buscarLetters + " no encontrada </p>";

  }
};


}



//Llama al boton de HTML
let btn_pulsa = document.querySelector("#btn_pulsa");
let btn_section = document.querySelector("#btn_section");

//Al pulsar el boton activa el detectar el nivel de acceso
btn_pulsa.addEventListener("click", detectarBuscar);  



function generarCuadrados() {
    const cantidad = document.getElementById("cantidadCuadrados").value;
    const main = document.querySelector("main");
    main.innerHTML = "";
    for (let i = 0; i < cantidad; i++) {
        let cuadrado = document.createElement("div");
        cuadrado.className = "cuadrado";
        main.appendChild(cuadrado);
    }
}
document.getElementById("btnGenerarCuadrados").addEventListener("click", generarCuadrados);