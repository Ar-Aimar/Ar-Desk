const PX_PER_CM = 37.795;

function toPx(val, unit) {
    return unit === 'cm' ? val * PX_PER_CM : val;
}

function obtenerCoordenadas(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // IMPORTANTE: Escalar según el tamaño interno del canvas vs visual
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}