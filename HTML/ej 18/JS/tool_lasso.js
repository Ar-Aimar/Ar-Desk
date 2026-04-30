// tool_lasso.js
let lassoPoints = [];

window.ToolLasso = {
    start: (ctx, x, y) => {
        lassoPoints = [{x, y}];
        uiCtx.strokeStyle = '#fff';
        uiCtx.setLineDash([5, 5]); // Línea punteada
        uiCtx.lineWidth = 1;
    },
    move: (ctx, x, y) => {
        lassoPoints.push({x, y});
        uiCtx.clearRect(0, 0, state.width, state.height);
        uiCtx.beginPath();
        uiCtx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
        for(let p of lassoPoints) uiCtx.lineTo(p.x, p.y);
        uiCtx.stroke();
    },
    end: (ctx, x, y) => {
        uiCtx.clearRect(0, 0, state.width, state.height);
        uiCtx.setLineDash([]); // Resetear
        if(lassoPoints.length < 3) return;

        // Crear el área de recorte (Path)
        const path = new Path2D();
        path.moveTo(lassoPoints[0].x, lassoPoints[0].y);
        for(let p of lassoPoints) path.lineTo(p.x, p.y);
        path.closePath();

        // 1. Crear una nueva capa flotante
        const floatLayer = addLayer("Recorte");
        
        // 2. Copiar todo a la capa flotante
        floatLayer.ctx.drawImage(ctx.canvas, 0, 0);
        
        // 3. Borrar lo que quede FUERA del recorte en la capa nueva
        floatLayer.ctx.globalCompositeOperation = 'destination-in';
        floatLayer.ctx.fill(path);
        floatLayer.ctx.globalCompositeOperation = 'source-over';

        // 4. Borrar el área DENTRO del recorte en la capa original
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill(path);
        ctx.globalCompositeOperation = 'source-over';

        // Cambiar automáticamente a la herramienta mover
        document.getElementById('tool-move').click();
    }
};