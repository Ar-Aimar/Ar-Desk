window.ToolEraser = (function() {
    let lastX = 0, lastY = 0;

    return {
        start: function(ctx, x, y) {
            lastX = x; lastY = y;
            runEraser(ctx, x, y, x, y);
        },
        move: function(ctx, x, y) {
            runEraser(ctx, x, y, lastX, lastY);
            lastX = x; lastY = y;
            
            // Dibuja el círculo en tiempo real mientras arrastras
            uiCtx.clearRect(0, 0, state.width, state.height);
            uiCtx.beginPath();
            uiCtx.arc(x, y, state.eraser.size / 2, 0, Math.PI * 2);
            uiCtx.strokeStyle = 'rgba(128, 128, 128, 0.8)';
            uiCtx.lineWidth = 1 / state.zoom;
            uiCtx.stroke();
        },
        end: function(ctx) {
            uiCtx.clearRect(0, 0, state.width, state.height);
            saveHistory();
        }
    };
})();