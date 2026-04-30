function dibujar(ctx, accion) {
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = accion.color;
    ctx.lineWidth = accion.size;

    // Modo Borrador
    if (accion.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }

    switch(accion.tool) {
        case 'pencil':
        case 'eraser':
            if (accion.points.length < 2) return;
            ctx.moveTo(accion.points[0].x, accion.points[0].y);
            accion.points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
            break;
        case 'rect':
            ctx.strokeRect(accion.start.x, accion.start.y, accion.end.x - accion.start.x, accion.end.y - accion.start.y);
            break;
        case 'circle':
            const r = Math.hypot(accion.end.x - accion.start.x, accion.end.y - accion.start.y);
            ctx.arc(accion.start.x, accion.start.y, r, 0, Math.PI * 2);
            ctx.stroke();
            break;
    }
}