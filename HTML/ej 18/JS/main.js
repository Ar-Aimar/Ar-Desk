const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentTool = 'pencil';
let currentPoints = [];
let startPos = null;

// --- GESTIÓN DE MODALES ---
const modalNew = document.getElementById('modal-new');
const modalSave = document.getElementById('modal-save');

document.getElementById('btn-open-new').onclick = () => modalNew.style.display = 'block';
document.getElementById('btn-open-save').onclick = () => modalSave.style.display = 'block';
document.getElementById('btn-cancel-new').onclick = () => modalNew.style.display = 'none';

// --- NUEVO LIENZO Y PRESETS ---
window.setPreset = (w, h) => {
    document.getElementById('canvas-w').value = w;
    document.getElementById('canvas-h').value = h;
    updatePreview();
};

document.getElementById('btn-rotate').onclick = () => {
    const w = document.getElementById('canvas-w');
    const h = document.getElementById('canvas-h');
    [w.value, h.value] = [h.value, w.value];
    updatePreview();
};

function updatePreview() {
    const w = document.getElementById('canvas-w').value;
    const h = document.getElementById('canvas-h').value;
    const preview = document.getElementById('mini-preview');
    const ratio = w / h;
    if (ratio > 1) {
        preview.style.width = '120px'; preview.style.height = (120/ratio) + 'px';
    } else {
        preview.style.height = '120px'; preview.style.width = (120*ratio) + 'px';
    }
}

document.getElementById('btn-create').onclick = () => {
    const unit = document.getElementById('unit-select').value;
    canvas.width = toPx(document.getElementById('canvas-w').value, unit);
    canvas.height = toPx(document.getElementById('canvas-h').value, unit);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!document.getElementById('bg-transparent').checked) {
        ctx.fillStyle = document.getElementById('bg-color').value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    historial = [];
    modalNew.style.display = 'none';
};

// --- IMPORTAR / GUARDAR ---
document.getElementById('btn-import').onclick = () => document.getElementById('input-import').click();
document.getElementById('input-import').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
};

document.querySelectorAll('.export-btn').forEach(btn => {
    btn.onclick = () => {
        const format = btn.getAttribute('data-fmt');
        const link = document.createElement('a');
        link.download = `dibujo.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
        modalSave.style.display = 'none';
    };
});

// --- LÓGICA DE HERRAMIENTAS ---
document.querySelectorAll('.tool').forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.tool.active').classList.remove('active');
        btn.classList.add('active');
        currentTool = btn.id.replace('tool-', '');
    };
});

// --- EVENTOS DE DIBUJO ---
canvas.onmousedown = (e) => {
    drawing = true;
    startPos = obtenerCoordenadas(canvas, e);
    currentPoints = [startPos];
};

window.onmousemove = (e) => {
    if (!drawing) return;
    const pos = obtenerCoordenadas(canvas, e);
    
    // Redibujar historial para vista previa
    ctx.clearRect(0,0, canvas.width, canvas.height);
    // (Aquí deberías rellenar el fondo si no es transparente)
    historial.forEach(a => dibujar(ctx, a));
    
    const tempAccion = {
        tool: currentTool,
        color: document.getElementById('color-picker').value,
        size: document.getElementById('size-slider').value,
        start: startPos,
        end: pos,
        points: currentPoints
    };
    
    if (currentTool === 'pencil' || currentTool === 'eraser') {
        currentPoints.push(pos);
    }
    
    dibujar(ctx, tempAccion);
};

window.onmouseup = () => {
    if (drawing) {
        guardarEnHistorial({
            tool: currentTool,
            color: document.getElementById('color-picker').value,
            size: document.getElementById('size-slider').value,
            start: startPos,
            end: currentPoints[currentPoints.length-1],
            points: [...currentPoints]
        });
    }
    drawing = false;
};