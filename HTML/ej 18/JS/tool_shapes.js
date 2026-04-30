window.ToolShapes = (function() {
    let startX = 0, startY = 0;

    function draw(ctx, x, y) {
        ctx.strokeStyle = state.color;
        ctx.lineWidth = state.shapes.size;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();

        const type = state.shapes.type;
        let cx, cy, rx, ry;

        if (state.isAltPressed) {
            cx = startX; cy = startY;
            rx = Math.abs(x - startX); ry = Math.abs(y - startY);
        } else {
            cx = (startX + x) / 2; cy = (startY + y) / 2;
            rx = Math.abs(x - startX) / 2; ry = Math.abs(y - startY) / 2;
        }

        const radius = Math.hypot(rx, ry);

        if (type === 'rect') {
            if (state.isAltPressed) ctx.rect(cx - rx, cy - ry, rx * 2, ry * 2);
            else ctx.rect(startX, startY, x - startX, y - startY);
        } 
        else if (type === 'circle') {
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        } 
        else if (type === 'polygon' || type === 'star') {
            const sides = parseInt(state.shapes.sides);
            const step = Math.PI * 2 / sides;
            const shift = (Math.PI / 2) * -1;
            ctx.moveTo(cx + radius * Math.cos(shift), cy + radius * Math.sin(shift));
            for (let i = 1; i <= sides; i++) {
                if (type === 'star') {
                    const innerRadius = radius / 2;
                    const innerAngle = shift + step * i - (step / 2);
                    ctx.lineTo(cx + innerRadius * Math.cos(innerAngle), cy + innerRadius * Math.sin(innerAngle));
                }
                const angle = shift + step * i;
                ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
            }
            ctx.closePath();
        }
        else if (type === 'arrow') { // Requerimiento PDF: Flecha
            const headlen = 20; 
            const angle = Math.atan2(y - startY, x - startX);
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.lineTo(x - headlen * Math.cos(angle - Math.PI / 6), y - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(x, y);
            ctx.lineTo(x - headlen * Math.cos(angle + Math.PI / 6), y - headlen * Math.sin(angle + Math.PI / 6));
        }
        ctx.stroke();
    }

    return {
        start: function(ctx, x, y) { startX = x; startY = y; },
        move: function(ctx, x, y) {
            uiCtx.clearRect(0, 0, state.width, state.height);
            draw(uiCtx, x, y);
        },
        end: function(ctx, x, y) {
            uiCtx.clearRect(0, 0, state.width, state.height);
            draw(ctx, x, y);
            saveHistory();
        }
    };
})();