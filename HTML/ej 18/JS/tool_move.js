window.ToolMove = (function() {
    let moveTempData = null;
    let startX = 0, startY = 0;

    return {
        start: function(ctx, x, y) {
            startX = x; startY = y;
            moveTempData = ctx.getImageData(0, 0, state.width, state.height);
            ctx.clearRect(0, 0, state.width, state.height);
        },
        move: function(ctx, x, y) {
            uiCtx.clearRect(0, 0, state.width, state.height);
            uiCtx.putImageData(moveTempData, x - startX, y - startY);
        },
        end: function(ctx, x, y) {
            uiCtx.clearRect(0, 0, state.width, state.height);
            ctx.putImageData(moveTempData, x - startX, y - startY);
            moveTempData = null;
        }
    };
})();