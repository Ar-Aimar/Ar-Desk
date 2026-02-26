console.log("Inicio de JS");

let ahora = new Date();
console.log(ahora);

let hora_actual = ahora.getHours();
hora_actual = hora_actual.toString();

console.log(ahora + hora_actual);

const valorFecha = "Hoy es " + 
ahora.getDay() + "/" + 
(ahora.getMonth() + 1) + "/" + 
ahora.getFullYear() + ", " + 
ahora.getHours() + ":" + 
ahora.getMinutes();

console.log(valorFecha);

const valorFecha_dia_3 = "Hoy es " + 
(ahora.getDay() + 3) + "/" + 
(ahora.getMonth() + 1) + "/" + 
ahora.getFullYear() + ", " + 
ahora.getHours() + ":" + 
ahora.getMinutes();

console.log(valorFecha_dia_3);

const valorFecha_minutos_antes = "Hoy es " + 
ahora.getDay() + "/" + 
(ahora.getMonth() + 1) + "/" + 
ahora.getFullYear() + ", " + 
ahora.getHours() + ":" + 
(ahora.getMinutes() - 35);

console.log(valorFecha_minutos_antes);

    
const valorFecha_segundos = "Hoy es " + 
ahora.getDay() + "/" + 
(ahora.getMonth() + 1) + "/" + 
ahora.getFullYear() + ", " + 
ahora.getHours() + ":" + 
ahora.getMinutes() + ":" +
ahora.getSeconds();

let texto = valorFecha_segundos;
let parrafo = document.querySelector(".parrafo");
const btn_pulsa = document.querySelector("#btn_pulsa");

btn_pulsa.addEventListener("click", () => {
    
    parrafo.innerHTML = texto;
    parrafo.innerHTML = "<div> hola </div>";
});    


    function clickPulsado() {
        let ahora = new Date();
        let mensaje = "Hola, son las " +
            ahora.getHours() + ":" +
            ahora.getMinutes() + ":" +
            ahora.getSeconds();

        let parrafo = document.querySelector(".parrafo");
        parrafo.innerHTML = "<div> hola </div>";
        //parrafo.innerHTML = mensaje;
    }

    let boton = document.querySelector("#btn_pulsa");
    boton.addEventListener("click", clickPulsado);

    let shopping = ["bread", "milk", "cheese", "humus", "noodles", [0, 1, 2]];
    console.log(shopping[0]);
    console.log(shopping[5][1]);