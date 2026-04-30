window.ToolSelect = (function() {
    let startX = 0, startY = 0;
    let pathPoints = [];

    function drawPreview(x, y) {
        uiCtx.clearRect(0, 0, state.width, state.height);
        uiCtx.strokeStyle = '#fff';
        uiCtx.setLineDash([5, 5]);
        uiCtx.lineWidth = 1;
        uiCtx.beginPath();

        if (state.select.type === 'lasso') {
            uiCtx.moveTo(pathPoints[0].x, pathPoints[0].y);
            pathPoints.forEach(p => uiCtx.lineTo(p.x, p.y));
        } else if (state.select.type === 'rect') {
            uiCtx.rect(startX, startY, x - startX, y - startY);
        } else if (state.select.type === 'circle') {
            uiCtx.ellipse(startX, startY, Math.abs(x - startX), Math.abs(y - startY), 0, 0, Math.PI * 2);
        }
        uiCtx.stroke();
    }

    return {
        start: function(ctx, x, y) {
            startX = x; startY = y;
            pathPoints = [{x, y}];
            drawPreview(x, y);
        },
        move: function(ctx, x, y) {
            if (state.select.type === 'lasso') pathPoints.push({x, y});
            drawPreview(x, y);
        },
        end: function(ctx, x, y) {
            uiCtx.clearRect(0, 0, state.width, state.height);
            uiCtx.setLineDash([]);
            
            const path = new Path2D();
            if (state.select.type === 'lasso') {
                if (pathPoints.length < 3) return;
                path.moveTo(pathPoints[0].x, pathPoints[0].y);
                pathPoints.forEach(p => path.lineTo(p.x, p.y));
            } else if (state.select.type === 'rect') {
                path.rect(startX, startY, x - startX, y - startY);
            } else if (state.select.type === 'circle') {
                path.ellipse(startX, startY, Math.abs(x - startX), Math.abs(y - startY), 0, 0, Math.PI * 2);
            }
            path.closePath();

            // Recortar a nueva capa
            const floatLayer = addLayer("Recorte");
            floatLayer.ctx.drawImage(ctx.canvas, 0, 0);
            
            floatLayer.ctx.globalCompositeOperation = 'destination-in';
            floatLayer.ctx.fill(path);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fill(path);
            ctx.globalCompositeOperation = 'source-over';

            document.getElementById('tool-move').click();
        }
    };
})();