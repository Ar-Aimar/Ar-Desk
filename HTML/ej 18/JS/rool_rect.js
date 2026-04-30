// tool_rect.js
window.ToolRect = {
    startX: 0, startY: 0,
    start: (ctx, x, y) => {
        this.startX = x; this.startY = y;
    },
    move: (ctx, x, y) => {
        uiCtx.clearRect(0, 0, state.width, state.height);
        uiCtx.strokeStyle = state.color;
        uiCtx.lineWidth = state.size;
        uiCtx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
    },
    end: (ctx, x, y) => {
        uiCtx.clearRect(0, 0, state.width, state.height);
        ctx.strokeStyle = state.color;
        ctx.lineWidth = state.size;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
    }
};