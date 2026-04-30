const state = {
    width: 0, height: 0,
    layers: [], activeLayerIndex: -1,
    zoom: 1, panX: 0, panY: 0,
    isDrawing: false, isSpacePressed: false, isAltPressed: false, isPanning: false,
    
    tool: 'brush', 
    color: '#ff8c00',

    brush: { size: 5, blur: 0, style: 'solid' },
    eraser: { size: 20, blur: 0 },
    shapes: { type: 'rect', sides: 5, size: 3 },
    select: { type: 'lasso' },

    undoStack: [],
    redoStack: [],
    maxHistory: 20
};

const dom = {
    wrapper: document.getElementById('canvas-wrapper'),
    uiLayer: document.getElementById('ui-layer'),
    workspace: document.getElementById('workspace'),
    layersList: document.getElementById('layers-list')
};

const uiCtx = dom.uiLayer.getContext('2d');