window.addEventListener("load", (event) => {  
    console.log("Página cargada");

    let character = document.getElementById("character_text");
    console.log("character: " + character);
    let input = document.getElementById("character_input");

    let characterTop = parseInt(character.style.top);
    let characterLeft = parseInt(character.style.left);
    let arrayDirections = ["w", "a", "s", "d"];

    //al añadir una tecla al input, w, a, s, d, se moverá el cuadrado y se eliminará la letra del input
    input.addEventListener("input", (event) => {
        let value = input.value;
        value = value.toLowerCase();
        console.log("value: " + value);
        for (let i = 0; i < arrayDirections.length; i++) {
            if (arrayDirections[i] == value) {

                if (value == "w") {
                    characterTop = characterTop - 10;
                    character.style.top = characterTop + "px";
                    console.log("mover arriba");
                }
                if (value == "a") {
                    characterLeft = characterLeft - 10;
                    character.style.left = characterLeft + "px";
                    console.log("mover izquierda");
                }
                if (value == "s") {
                    characterTop = characterTop + 10;
                    character.style.top = characterTop + "px";
                    console.log("mover abajo");
                }
                if (value == "d") {
                    characterLeft = characterLeft + 10;
                    character.style.left = characterLeft + "px";
                    console.log("mover derecha");
                }
                input.value = "";
            }else {
                input.value = "";
            };
}})});
