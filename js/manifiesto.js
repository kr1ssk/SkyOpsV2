document.addEventListener('DOMContentLoaded', function () {
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

    // Sumamos las unidades recorriendo el arreglo con un for normal
    let totalUnidades = 0;
    for (let i = 0; i < manifiesto.length; i++) {
        totalUnidades = totalUnidades + parseInt(manifiesto[i].cantidad || 1);
    }
    if (resUnidades) resUnidades.textContent = totalUnidades;

    if (manifiesto.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">El manifiesto esta vacio. ' +
                               'Agrega componentes desde el Catalogo.</p>';
        return;
    }

    for (let i = 0; i < manifiesto.length; i++) {
        const item = manifiesto[i];

        contenedor.innerHTML +=
            '<div class="linea-manifiesto">' +
                '<div>' +
                    '<h4 class="titulo-linea">' + (item.nombre || item.destino) + '</h4>' +
                    '<span class="dato-linea">P/N: ' + item.guia +
                        ' &nbsp;|&nbsp; S/N: ' + (item.sn || 'SN-0000') +
                        ' &nbsp;|&nbsp; ' + (item.ata || 'ATA') + '</span>' +
                    '<span class="dato-linea dato-bodega">' + (item.bodega || 'Bodega') + '</span>' +
                '</div>' +
                '<div class="controles-linea">' +
                    '<label class="etiqueta-oculta" for="cant-' + i + '">Cantidad</label>' +
                    '<input type="number" id="cant-' + i + '" class="input-qty" value="' + (item.cantidad || 1) +
                        '" min="1" max="' + (item.stockMax || 10) + '" onchange="actualizarCantidad(' + i + ')">' +
                    '<button class="btn-eliminar btn-chico" onclick="quitarLinea(' + i + ')">Quitar</button>' +
                '</div>' +
            '</div>';
    }
}

function actualizarCantidad(index) {
    let manifiesto = obtenerStorage('skyops_manifiesto');
    const input = document.getElementById('cant-' + index);
    let nuevaCant = parseInt(input.value);

    // Regla de negocio: cantidad minima 1
    if (nuevaCant <= 0) {
        quitarLinea(index);
        return;
    }

    // Regla de negocio: nunca por sobre el stock de bodega
    if (manifiesto[index].stockMax && nuevaCant > manifiesto[index].stockMax) {
        alert('Stock maximo disponible en bodega: ' + manifiesto[index].stockMax +
              '. No puedes solicitar mas de lo que existe.');
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
    if (confirm('Deseas vaciar todo el manifiesto de repuestos?')) {
        guardarStorage('skyops_manifiesto', []);
        renderizarManifiesto();
    }
}
