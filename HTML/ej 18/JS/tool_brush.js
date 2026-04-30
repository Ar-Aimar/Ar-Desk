window.ToolBrush = (function() {
    let pathPoints = [];

    function drawFullStroke(targetCtx) {
        if (pathPoints.length === 0) return;
        targetCtx.beginPath();
        targetCtx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
            targetCtx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        targetCtx.strokeStyle = state.color;
        targetCtx.lineWidth = state.brush.size;
        targetCtx.lineCap = 'round'; targetCtx.lineJoin = 'round';
        targetCtx.shadowBlur = state.brush.blur;
        targetCtx.shadowColor = state.brush.blur > 0 ? state.color : 'transparent';
        targetCtx.globalAlpha = state.brush.style === 'marker' ? 0.5 : 1.0;
        targetCtx.stroke();
        targetCtx.shadowBlur = 0; targetCtx.globalAlpha = 1.0;
    }

    return {
        start: function(ctx, x, y) { pathPoints = [{x, y}]; },
        move: function(ctx, x, y) {
            pathPoints.push({x, y});
            uiCtx.clearRect(0, 0, state.width, state.height);
            drawFullStroke(uiCtx);
        },
        end: function(ctx) {
            uiCtx.clearRect(0, 0, state.width, state.height);
            drawFullStroke(ctx);
            pathPoints = [];
            saveHistory();
        }
    };
})();