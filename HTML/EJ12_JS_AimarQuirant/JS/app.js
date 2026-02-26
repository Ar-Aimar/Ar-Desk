// let myData = "Madrid, Valencia, Castilla, Cataluña, Granada";
// let myDataArray = myData.split(",");
// console.log(myData);
// console.log(myDataArray);

// myDataArray.push("Portugal");
// console.log(myDataArray);

// myDataArray.pop();

let semana = "Lunes, Martes, Miércoles, Jueves, Viernes, Sabado, Domingo";
let semanaArray = semana.split(",");
console.log(semanaArray);

let actualDia = new Date();
let dia = actualDia.getDay();

console.log("DIA " + dia);
console.log("DIA " + semanaArray[dia -1]);


let diasVacio = [];

diasVacio.push(["lunes", "martes", "miércoles", "jueves", "viernes"]);
diasVacio.push(["sábado", "domingo"]);

console.log(diasVacio[1][0]);


let arrayVacio = [];
let parrafo = document.querySelector("#parrafo");

function addTexto() {

        

        arrayVacio.push(parrafo.value);
        console.log(arrayVacio);
        // actualizar text area

        cuadro.innerHTML = arrayVacio;
        
}



let cuadro = document.querySelector("#cuadro");
let btn_pulsa = document.querySelector("#btn_pulsa");

btn_pulsa.addEventListener("click", addTexto);  

let btn_desacer = document.querySelector("#btn_desacer");

function quitTexto() {

        arrayVacio.pop();
        cuadro.innerHTML = arrayVacio;
}

btn_desacer.addEventListener("click", quitTexto);



let btn_borrar = document.querySelector("#btn_borrar");

function clearTexto() {

        arrayVacio = [];
        cuadro.innerHTML = arrayVacio;
        
}

btn_borrar.addEventListener("click", clearTexto);


