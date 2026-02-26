console.log( "start" );

//detecta el boton del html
let btnChangeColors = document.querySelector("#btnChangeColors")

//cambia colores de los textos numericos
function colorCambiar(red, green, blue){
    let color = "rgb(" + red + "," + green + "," + blue + ")";
    console.log("cambiar color");
    let areaColor = document.querySelector("#areaColor");
    areaColor.style.backgroundColor = color;

}

//cambia colores de la paleta de colores
function altColorCambiar(altRed, altGreen, altBlue){
    let color = "rgb(" + altRed + "," + altGreen + "," + altBlue + ")";
    console.log("cambiar color");
    let areaColor = document.querySelector("#areaColor");
    areaColor.style.backgroundColor = color;
    red.value = altRed;
    green.value = altGreen;
    blue.value = altBlue;

}



function colorCodeLimit() {
    //detecta los numeros de los inputs
    let red = document.querySelector("#red");
    red = red.value;
    let green = document.querySelector("#green");
    green = green.value;
    let blue = document.querySelector("#blue");
    blue = blue.value;
    console.log("verificar colores");

    //detecta el valor de la paleta de colores
    let paletaColores = document.querySelector("#paletaColores");
    paletaColores = paletaColores.value;
    console.log( paletaColores );

    //cambia el valor #000000 a rgb normal saltandose el "#"
    let altRed = parseInt(paletaColores.substring(1, 3), 16);
    let altGreen = parseInt(paletaColores.substring(3, 5), 16);
    let altBlue = parseInt(paletaColores.substring(5, 7), 16);
    console.log(altRed, altGreen, altBlue);

    
    if (
        altRed > 0 || altGreen > 0 || altBlue > 0, red == 0 && green == 0 && blue == 0 
        ) 
        {
        //cambia el color del div con la paleta de colores
            console.log("cambiar color alternativo");
            altColorCambiar(altRed, altGreen, altBlue); 
        
        } else if (
        //verifica que el valor de los colores esté bien
        red >= 0 && 
        green >= 0 && 
        blue >= 0 && 
        red <= 255 && 
        green <= 255 && 
        blue <= 255) {
            
            //cambia el color del div
        console.log("permitir cambiar color");
        colorCambiar(red, green, blue);
            

        }else if (altRed > 0 || altGreen > 0 || altBlue > 0) {
            //cambia el color del div con la paleta de colores
            console.log("cambiar color alternativo");
            altColorCambiar(altRed, altGreen, altBlue);

        }        else{
            //muestra una alerta de error
            alert("El valor de los colores es diferente al permitido, 0-255")
        }
}

//añade el evento del botton
btnChangeColors.addEventListener("click", colorCodeLimit);