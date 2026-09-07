function agregarAlManifiesto(index) {
    const catalogo = obtenerStorage('skyops_catalogo');
    const item = catalogo[index];
    const qtyInput = document.getElementById(`qty-${index}`);
    const qty = parseInt(qtyInput ? qtyInput.value : 1);

    const manifiesto = obtenerStorage('skyops_manifiesto');
    
    // Verificar si ya existe en el manifiesto para sumar la cantidad en lugar de duplicar línea
    const existente = manifiesto.find(m => m.guia === item.pn);
    if (existente) {
        existente.cantidad = (parseInt(existente.cantidad) || 1) + qty;
        if (existente.cantidad > item.stock) existente.cantidad = item.stock;
    } else {
        manifiesto.push({
            guia: item.pn,
            nombre: item.nombre,
            sn: item.sn,
            ata: item.ata,
            bodega: item.bodega,
            cantidad: qty,
            stockMax: item.stock,
            destino: `${item.nombre} - ${item.bodega}`
        });
    }

    guardarStorage('skyops_manifiesto', manifiesto);
    alert(`¡Componente ${item.pn} agregado correctamente al Manifiesto (Work Order)!`);
}