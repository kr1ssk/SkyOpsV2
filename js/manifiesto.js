document.addEventListener('DOMContentLoaded', () => {
    renderizarManifiesto();
});

function renderizarManifiesto() {
    const contenedor = document.getElementById('lista-manifiesto');
    const badge = document.getElementById('badge-contador');
    const resLineas = document.getElementById('resumen-lineas');
    const resUnidades = document.getElementById('resumen-unidades');
    if (!contenedor) return;

    let manifiesto = obtenerStorage('skyops_manifiesto');
    contenedor.innerHTML = '';

    if (badge) badge.textContent = manifiesto.length;
    if (resLineas) resLineas.textContent = manifiesto.length;

    let totalUnidades = 0;
    manifiesto.forEach(item => totalUnidades += parseInt(item.cantidad || 1));
    if (resUnidades) resUnidades.textContent = totalUnidades;

    if (manifiesto.length === 0) {
        contenedor.innerHTML = `<p style="color: #64748b; padding: 1rem;">El manifiesto está vacío. Agrega componentes desde el Catálogo.</p>`;
        return;
    }

    manifiesto.forEach((item, index) => {
        contenedor.innerHTML += `
            <div style="background: #1e293b; padding: 1rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;">
                <div>
                    <h4 style="color: white; font-size: 1rem; margin-bottom: 3px;">${item.nombre || item.destino}</h4>
                    <span style="font-size: 0.75rem; color: #94a3b8; display: block;">P/N: ${item.guia} &nbsp;|&nbsp; S/N: ${item.sn || 'SN-40213'} &nbsp;|&nbsp; ${item.ata || 'ATA 72'}</span>
                    <span style="font-size: 0.75rem; color: #38bdf8; display: block; margin-top: 3px;">${item.bodega || 'Bodega ANF - D11'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="number" id="cant-${index}" value="${item.cantidad || 1}" min="1" max="${item.stockMax || 10}" onchange="actualizarCantidad(${index})" style="width: 60px; background: #0f172a; border: 1px solid #475569; color: white; text-align: center; padding: 4px; border-radius: 4px;">
                    <button class="btn-eliminar" onclick="quitarLinea(${index})" style="padding: 5px 10px; font-size: 0.8rem;">Quitar</button>
                </div>
            </div>
        `;
    });
}

function actualizarCantidad(index) {
    let manifiesto = obtenerStorage('skyops_manifiesto');
    const input = document.getElementById(`cant-${index}`);
    let nuevaCant = parseInt(input.value);

    // Regla de negocio: Cantidad mínima 1
    if (nuevaCant <= 0) {
        quitarLinea(index);
        return;
    }

    // Regla de negocio: Nunca por sobre el stock
    if (manifiesto[index].stockMax && nuevaCant > manifiesto[index].stockMax) {
        alert(`Stock máximo disponible en bodega: ${manifiesto[index].stockMax}. No puedes solicitar más de lo existente.`);
        nuevaCant = manifiesto[index].stockMax;
        input.value = nuevaCant;
    }

    manifiesto[index].cantidad = nuevaCant;
    guardarStorage('skyops_manifiesto', manifiesto);
    renderizarManifiesto();
}

function quitarLinea(index) {
    let manifiesto = obtenerStorage('skyops_manifiesto');
    manifiesto.splice(index, 1);
    guardarStorage('skyops_manifiesto', manifiesto);
    renderizarManifiesto();
}

function vaciarManifiesto() {
    if (confirm('¿Desea vaciar todo el manifiesto de repuestos?')) {
        localStorage.setItem('skyops_manifiesto', JSON.stringify([]));
        renderizarManifiesto();
    }
}