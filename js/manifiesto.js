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
        contenedor.innerHTML = `<p class="mensaje-vacio">El manifiesto está vacío. Agrega componentes desde el Catálogo.</p>`;
        return;
    }

    manifiesto.forEach((item, index) => {
        contenedor.innerHTML += `
            <div class="linea-manifiesto">
                <div>
                    <h4 class="titulo-linea">${item.nombre || item.destino}</h4>
                    <span class="dato-linea">P/N: ${item.guia} &nbsp;|&nbsp; S/N: ${item.sn || 'SN-40213'} &nbsp;|&nbsp; ${item.ata || 'ATA 72'}</span>
                    <span class="dato-linea dato-bodega">${item.bodega || 'Bodega ANF - D11'}</span>
                </div>
                <div class="controles-linea">
                    <input type="number" id="cant-${index}" value="${item.cantidad || 1}" min="1" max="${item.stockMax || 10}" onchange="actualizarCantidad(${index})" class="input-qty">
                    <button class="btn-eliminar" onclick="quitarLinea(${index})" class="btn-chico">Quitar</button>
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