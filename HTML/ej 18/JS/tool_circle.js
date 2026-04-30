// tool_circle.js
window.ToolCircle = {
    startX: 0, startY: 0,
    start: (ctx, x, y) => {
        this.startX = x; this.startY = y;
    },
    move: (ctx, x, y) => {
        uiCtx.clearRect(0, 0, state.width, state.height);
        uiCtx.strokeStyle = state.color;
        uiCtx.lineWidth = state.size;
        uiCtx.beginPath();
        uiCtx.arc(this.startX, this.startY, Math.hypot(x - this.startX, y - this.startY), 0, Math.PI * 2);
        uiCtx.stroke();
    },
    end: (ctx, x, y) => {
        uiCtx.clearRect(0, 0, state.width, state.height);
        ctx.strokeStyle = state.color;
        ctx.lineWidth = state.size;
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.arc(this.startX, this.startY, Math.hypot(x - this.startX, y - this.startY), 0, Math.PI * 2);
        ctx.stroke();
    }
};