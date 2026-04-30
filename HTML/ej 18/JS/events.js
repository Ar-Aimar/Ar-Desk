// --- COORDENADAS PRECISAS ---
function getMousePos(e) {
    const rect = dom.uiLayer.getBoundingClientRect();
    let clientX = e.clientX; let clientY = e.clientY;
    
    if (e.touches && e.touches.length > 0) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; } 
    else if (e.changedTouches && e.changedTouches.length > 0) { clientX = e.changedTouches[0].clientX; clientY = e.changedTouches[0].clientY; }

    return {
        x: (clientX - rect.left) * (state.width / rect.width),
        y: (clientY - rect.top) * (state.height / rect.height)
    };
}

let panStart = {x: 0, y: 0};

// --- CURSOR FANTASMA ---
function drawCursorPreview(e) {
    uiCtx.clearRect(0, 0, state.width, state.height);
    if (state.isSpacePressed || (state.tool !== 'brush' && state.tool !== 'eraser')) {
        dom.uiLayer.style.cursor = 'default'; return;
    }
    dom.uiLayer.style.cursor = 'none';
    const pos = getMousePos(e);
    const size = state.tool === 'brush' ? state.brush.size : state.eraser.size;

    uiCtx.beginPath();
    uiCtx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
    uiCtx.strokeStyle = 'rgba(128, 128, 128, 0.8)';
    uiCtx.lineWidth = 1 / state.zoom; 
    uiCtx.stroke();
}

// --- EVENTOS PRINCIPALES ---
function handleStart(e) {
    if (state.isSpacePressed) {
        state.isPanning = true; document.body.classList.add('panning-active');
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        panStart = { x: clientX - state.panX, y: clientY - state.panY };
        return;
    }
    if (state.layers.length === 0) return;
    state.isDrawing = true;
    
    const pos = getMousePos(e);
    const ctx = getActiveCtx();
    const toolName = 'Tool' + state.tool.charAt(0).toUpperCase() + state.tool.slice(1);
    if (window[toolName] && window[toolName].start) window[toolName].start(ctx, pos.x, pos.y);
}

function handleMove(e) {
    if (state.layers.length > 0 && !state.isDrawing && !state.isPanning && !e.touches) drawCursorPreview(e);

    if (state.isPanning) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        state.panX = clientX - panStart.x; state.panY = clientY - panStart.y;
        updateTransform();
        return;
    }

    if (!state.isDrawing || state.layers.length === 0) return;
    if(e.touches) e.preventDefault(); 
    
    const pos = getMousePos(e);
    const ctx = getActiveCtx();
    const toolName = 'Tool' + state.tool.charAt(0).toUpperCase() + state.tool.slice(1);
    if (window[toolName] && window[toolName].move) window[toolName].move(ctx, pos.x, pos.y);
}

function handleEnd(e) {
    if (state.isPanning) { state.isPanning = false; document.body.classList.remove('panning-active'); return; }
    if (!state.isDrawing) return;
    state.isDrawing = false;
    
    const pos = getMousePos(e);
    const ctx = getActiveCtx();
    const toolName = 'Tool' + state.tool.charAt(0).toUpperCase() + state.tool.slice(1);
    if (window[toolName] && window[toolName].end) window[toolName].end(ctx, pos.x, pos.y);
}

// Listeners
dom.wrapper.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);
dom.workspace.addEventListener('mouseleave', () => uiCtx.clearRect(0, 0, state.width, state.height));
dom.wrapper.addEventListener('touchstart', handleStart, {passive: false});
window.addEventListener('touchmove', handleMove, {passive: false});
window.addEventListener('touchend', handleEnd);

// --- TECLADO ---
window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    if (e.ctrlKey && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    if (e.code === 'Space') { state.isSpacePressed = true; document.body.classList.add('panning'); uiCtx.clearRect(0,0,state.width,state.height); }
    if (e.key === 'Alt') state.isAltPressed = true;
});
window.addEventListener('keyup', e => { 
    if (e.code === 'Space') { state.isSpacePressed = false; state.isPanning = false; document.body.classList.remove('panning', 'panning-active'); }
    if (e.key === 'Alt') state.isAltPressed = false;
});

// --- MENÚS Y PROPIEDADES ---
document.querySelectorAll('.tool').forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.tool.active').classList.remove('active');
        btn.classList.add('active');
        state.tool = btn.id.replace('tool-', '');
        document.querySelectorAll('.props-group').forEach(p => p.classList.remove('active'));
        const propsPanel = document.getElementById('props-' + state.tool);
        if (propsPanel) propsPanel.classList.add('active');
        dom.uiLayer.style.cursor = state.tool === 'move' ? 'move' : 'crosshair';
    };
});

function bindInput(id, stateObj, stateProp, valLabelId = null) {
    const el = document.getElementById(id);
    if (!el) return;
    el.oninput = e => {
        state[stateObj][stateProp] = e.target.value;
        if (valLabelId) document.getElementById(valLabelId).innerText = e.target.value;
        if (id === 'shape-type') document.getElementById('shape-sides-container').style.display = (e.target.value === 'polygon' || e.target.value === 'star') ? 'block' : 'none';
    };
}

document.getElementById('global-color').oninput = e => state.color = e.target.value;
bindInput('brush-size', 'brush', 'size', 'val-brush-size');
bindInput('brush-blur', 'brush', 'blur', 'val-brush-blur');
bindInput('brush-style', 'brush', 'style');
bindInput('eraser-size', 'eraser', 'size', 'val-eraser-size');
bindInput('eraser-blur', 'eraser', 'blur', 'val-eraser-blur');
bindInput('shape-type', 'shapes', 'type');
bindInput('shape-sides', 'shapes', 'sides', 'val-shape-sides');
bindInput('shape-size', 'shapes', 'size', 'val-shape-size');
bindInput('select-type', 'select', 'type');

document.getElementById('btn-undo').onclick = undo;
document.getElementById('btn-redo').onclick = redo;

// --- SOLUCIÓN A LAS CAPAS ---
document.getElementById('btn-add-layer').onclick = () => { 
    if(state.layers.length > 0) {
        addLayer(); 
        saveHistory(); // Guardar acción en el historial
    }
};

document.getElementById('btn-delete-layer').onclick = () => {
    if (state.layers.length <= 1) {
        alert("No puedes borrar la última capa.");
        return;
    }
    if (state.activeLayerIndex !== -1) {
        // Eliminar el canvas del DOM
        state.layers[state.activeLayerIndex].canvas.remove();
        // Eliminar del array
        state.layers.splice(state.activeLayerIndex, 1);
        // Seleccionar la capa inmediatamente inferior
        const newIndex = state.activeLayerIndex > 0 ? state.activeLayerIndex - 1 : 0;
        setActiveLayer(newIndex);
        saveHistory();
    }
};

// --- IMPORTAR/EXPORTAR ---
document.getElementById('btn-export').onclick = () => document.getElementById('modal-export').style.display = 'block';
document.getElementById('btn-close-export').onclick = () => document.getElementById('modal-export').style.display = 'none';
window.exportImage = (format) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = state.width; tempCanvas.height = state.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (format === 'jpeg') { tempCtx.fillStyle = '#fff'; tempCtx.fillRect(0, 0, state.width, state.height); }
    state.layers.forEach(layer => tempCtx.drawImage(layer.canvas, 0, 0));
    const link = document.createElement('a'); link.download = `imagen.${format}`; link.href = tempCanvas.toDataURL(`image/${format}`, 0.9); link.click();
    document.getElementById('modal-export').style.display = 'none';
};

document.getElementById('btn-save-project').onclick = exportProject;
document.getElementById('btn-load-project').onclick = () => document.getElementById('file-load-project').click();
document.getElementById('file-load-project').onchange = e => loadProject(e.target.files[0]);

document.getElementById('btn-import-img').onclick = () => document.getElementById('file-import-img').click();
document.getElementById('file-import-img').onchange = e => cargarImagenComoCapa(e.target.files[0]);
dom.workspace.addEventListener('dragover', e => e.preventDefault());
dom.workspace.addEventListener('drop', e => { e.preventDefault(); if (e.dataTransfer.files.length > 0) cargarImagenComoCapa(e.dataTransfer.files[0]); });

// --- MODALES ---
document.getElementById('btn-new').onclick = () => { updatePreview(); document.getElementById('modal-new').style.display = 'block'; };
document.getElementById('btn-empty-new').onclick = () => { updatePreview(); document.getElementById('modal-new').style.display = 'block'; };
document.getElementById('btn-close-new').onclick = () => document.getElementById('modal-new').style.display = 'none';

function updatePreview() {
    const w = parseInt(document.getElementById('canvas-w').value) || 1080;
    const h = parseInt(document.getElementById('canvas-h').value) || 1080;
    const preview = document.getElementById('canvas-preview');
    const maxDim = 120; 
    if (w > h) { preview.style.width = maxDim + 'px'; preview.style.height = (maxDim * (h / w)) + 'px'; } 
    else { preview.style.height = maxDim + 'px'; preview.style.width = (maxDim * (w / h)) + 'px'; }
    document.getElementById('preview-text').innerText = `${w} x ${h} px`;
}
window.setPreset = (w, h) => { document.getElementById('canvas-w').value = w; document.getElementById('canvas-h').value = h; updatePreview(); };
document.getElementById('canvas-w').addEventListener('input', updatePreview);
document.getElementById('canvas-h').addEventListener('input', updatePreview);

document.getElementById('btn-create-canvas').onclick = () => {
    initProject(parseInt(document.getElementById('canvas-w').value), parseInt(document.getElementById('canvas-h').value), document.getElementById('bg-color').value, document.getElementById('bg-transparent').checked);
    document.getElementById('modal-new').style.display = 'none';
};