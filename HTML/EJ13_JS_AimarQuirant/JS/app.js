
//Espacio de texto donde saldrá el resultado
let arrayVacio = [];

 //Agregar el Rol colocado
let inputRol = document.querySelector("#inputRol");
let resultado = document.querySelector("#resultado");

//Intentos
let intentos = 0

//Para detectar que nivel de acceso tiene cada vez que pulsa el boton
function accesRol() {


    
    //borrar/reiniciar
    arrayVacio = [];
    if ( intentos < 3 ){

    let valorInput = inputRol.value;
    console.log(valorInput);



        if ( valorInput  == "Admin" ) {
            arrayVacio.push("Acceso total");
            resultado.innerHTML = arrayVacio;

        } else if ( valorInput  == "Editor" ) {
            arrayVacio.push("Permisos de lectura/escrcitura");
            resultado.innerHTML = arrayVacio;

        } else if ( valorInput  == "Lector" ) {
            arrayVacio.push("Permisos de lectura");
            resultado.innerHTML = arrayVacio;

        } else if ( valorInput  == "Visitante" ) {
            arrayVacio.push("Acceso restrinfido");
            resultado.innerHTML = arrayVacio;

        } else {
            arrayVacio.push("Error");
            resultado.innerHTML = arrayVacio;
            intentos = intentos + 1
        }   
        
} else {
    arrayVacio.push("Intentos Insuficientes");
    resultado.innerHTML = arrayVacio;
    btn_section.innerHTML = "<button disabled id= 'btn_pulsa' >Desabilitado</button>";
}
}
//Llama al boton de HTML
let btn_pulsa = document.querySelector("#btn_pulsa");
let btn_section = document.querySelector("#btn_section");

//Al pulsar el boton activa el detectar el nivel de acceso
btn_pulsa.addEventListener("click", accesRol);  