function getActiveCtx() { 
    return state.activeLayerIndex === -1 ? null : state.layers[state.activeLayerIndex].ctx; 
}

function addLayer(name = `Capa ${state.layers.length + 1}`) {
    const canvas = document.createElement('canvas');
    canvas.width = state.width; canvas.height = state.height;
    
    // El z-index asegura que las capas se apilen en el orden correcto
    canvas.style.zIndex = state.layers.length;
    dom.wrapper.insertBefore(canvas, dom.uiLayer);
    
    const layer = { id: Date.now() + Math.random(), name, canvas, ctx: canvas.getContext('2d') };
    state.layers.push(layer);
    setActiveLayer(state.layers.length - 1);
    return layer;
}

function setActiveLayer(index) {
    if (index >= 0 && index < state.layers.length) {
        state.activeLayerIndex = index;
        renderLayersUI();
    }
}

function renderLayersUI() {
    dom.layersList.innerHTML = '';
    // Mostramos la lista invertida (la capa de arriba se ve arriba en la UI)
    [...state.layers].reverse().forEach((layer, i) => {
        const realIndex = state.layers.length - 1 - i;
        const li = document.createElement('li');
        li.className = `layer-item ${realIndex === state.activeLayerIndex ? 'active' : ''}`;
        li.innerHTML = `<span>${layer.name}</span>`;
        li.onclick = () => setActiveLayer(realIndex);
        dom.layersList.appendChild(li);
    });
}

function initProject(w, h, bgColor, isTransparent) {
    state.width = w; state.height = h;
    dom.wrapper.style.width = w + 'px'; dom.wrapper.style.height = h + 'px';
    dom.uiLayer.width = w; dom.uiLayer.height = h;
    
    state.layers.forEach(l => l.canvas.remove()); state.layers = [];
    
    if (!isTransparent) {
        const bgLayer = addLayer("Fondo");
        bgLayer.ctx.fillStyle = bgColor; bgLayer.ctx.fillRect(0, 0, w, h);
    }
    addLayer("Capa 1");
    
    state.zoom = 1;
    state.panX = (dom.workspace.clientWidth - w) / 2;
    state.panY = (dom.workspace.clientHeight - h) / 2;
    updateTransform();
    
    document.getElementById('empty-state').style.display = 'none';
    dom.wrapper.style.display = 'block';
    
    state.undoStack = []; state.redoStack = [];
    saveHistory();
}

function updateTransform() {
    dom.wrapper.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
}

dom.workspace.addEventListener('wheel', e => {
    if (state.layers.length === 0) return;
    e.preventDefault();
    state.zoom = Math.max(0.1, Math.min(state.zoom + (e.deltaY > 0 ? -0.1 : 0.1), 5));
    updateTransform();
}, { passive: false });

// --- HISTORIAL (Undo/Redo) ---
function saveHistory() {
    const snapshot = state.layers.map(l => ({ id: l.id, name: l.name, data: l.canvas.toDataURL() }));
    state.undoStack.push(snapshot);
    if (state.undoStack.length > state.maxHistory) state.undoStack.shift();
    state.redoStack = [];
}

function undo() {
    if (state.undoStack.length <= 1) return;
    state.redoStack.push(state.undoStack.pop());
    applySnapshot(state.undoStack[state.undoStack.length - 1]);
}

function redo() {
    if (state.redoStack.length === 0) return;
    const snapshot = state.redoStack.pop();
    state.undoStack.push(snapshot);
    applySnapshot(snapshot);
}

function applySnapshot(snapshot) {
    state.layers.forEach(l => l.canvas.remove());
    state.layers = [];
    
    snapshot.forEach((layerData, idx) => {
        const layer = addLayer(layerData.name);
        layer.id = layerData.id;
        layer.canvas.style.zIndex = idx; // Respetar orden visual
        const img = new Image();
        img.onload = () => layer.ctx.drawImage(img, 0, 0);
        img.src = layerData.data;
    });
    setActiveLayer(state.layers.length - 1);
}


// --- GUARDAR / CARGAR ---
function exportProject() {
    if (state.layers.length === 0) return;
    const projectData = { width: state.width, height: state.height, snapshot: state.layers.map(l => ({ name: l.name, data: l.canvas.toDataURL() })) };
    const blob = new Blob([JSON.stringify(projectData)], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); link.download = "proyecto_canvas.json"; link.click();
}

function loadProject(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            initProject(data.width, data.height, '#fff', true);
            state.layers.forEach(l => l.canvas.remove()); state.layers = [];
            data.snapshot.forEach(layerData => {
                const layer = addLayer(layerData.name);
                const img = new Image();
                img.onload = () => layer.ctx.drawImage(img, 0, 0);
                img.src = layerData.data;
            });
            saveHistory();
        } catch (err) { alert("Archivo de proyecto no válido."); }
    };
    reader.readAsText(file);
}

function cargarImagenComoCapa(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            if (state.layers.length === 0) initProject(img.width, img.height, '#fff', true);
            const layer = addLayer(`Img: ${file.name.substring(0,10)}`);
            layer.ctx.drawImage(img, 0, 0);
            saveHistory();
            document.getElementById('tool-move').click();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function runEraser(ctx, x, y, lastX, lastY) {
    if (!ctx) {
        console.error("El borrador no tiene una capa activa donde actuar.");
        return;
    }
    
    ctx.save();
    
    // MODO BORRADO: 'destination-out' elimina los píxeles existentes donde dibujamos
    ctx.globalCompositeOperation = 'destination-out';
    
    // Es obligatorio usar un color con opacidad total para que el "agujero" sea perfecto
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.strokeStyle = 'rgba(0,0,0,1)';

    // 1. FORZAR BORRADO EN PUNTO ESTÁTICO:
    // Rellena un círculo exacto donde está el ratón. Esto arregla el clic sin movimiento.
    ctx.beginPath();
    ctx.arc(x, y, (state.eraser.size / 2), 0, Math.PI * 2);
    ctx.fill();

    // 2. FORZAR BORRADO EN MOVIMIENTO:
    // Dibuja la línea gruesa entre la posición anterior y la actual.
    ctx.beginPath();
    ctx.lineWidth = state.eraser.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.restore();
}