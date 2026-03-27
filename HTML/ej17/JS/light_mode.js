document.addEventListener("DOMContentLoaded", () => {
    const btnTheme = document.getElementById('toggleTheme');
    const themeIcon = document.getElementById('themeIcon');
    const toggleIcon = document.getElementById('toggleIcon');
    const body = document.body;

    const images = {
        light: {
            mode: "IMG/light_mode_100dp_7A611D_FILL0_wght400_GRAD0_opsz48.png",
            toggle: "IMG/toggle_off_100dp_000000_FILL0_wght400_GRAD0_opsz48.png"
        },
        dark: {
            mode: "IMG/mode_night_100dp_A9C3C8_FILL0_wght400_GRAD0_opsz48.png",
            toggle: "IMG/toggle_on_100dp_000000_FILL0_wght400_GRAD0_opsz48.png"
        }
    };

btnTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');

    // Cambiar las rutas de las imágenes
    themeIcon.src = isDark ? images.dark.mode : images.light.mode;
    toggleIcon.src = isDark ? images.dark.toggle : images.light.toggle;

    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
});