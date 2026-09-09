document.addEventListener('DOMContentLoaded', function () {
    renderizarManifiesto();
});

function renderizarManifiesto() {
    const contenedor = document.getElementById('lista-manifiesto');
    const badge = document.getElementById('badge-contador');
    const resLineas = document.getElementById('resumen-lineas');
    const resUnidades = document.getElementById('resumen-unidades');
    const resConCert = document.getElementById('resumen-con-cert');
    const resSinCert = document.getElementById('resumen-sin-cert');
    if (!contenedor) return;

    let manifiesto = obtenerStorage('skyops_manifiesto');
    contenedor.innerHTML = '';

    if (badge) badge.textContent = manifiesto.length;
    if (resLineas) resLineas.textContent = manifiesto.length;

    // Sumamos las unidades y contamos los certificados 8130-3 en el mismo
    // recorrido. Antes estos dos numeros estaban escritos a mano en el HTML,
    // asi que decian siempre 1 y 0 aunque el manifiesto tuviera otra cosa.
    let totalUnidades = 0;
    let conCertificado = 0;
    let sinCertificado = 0;

    for (let i = 0; i < manifiesto.length; i++) {
        totalUnidades = totalUnidades + parseInt(manifiesto[i].cantidad || 1);

        if (manifiesto[i].certificado === false) {
            sinCertificado = sinCertificado + 1;
        } else {
            conCertificado = conCertificado + 1;
        }
    }

    if (resUnidades) resUnidades.textContent = totalUnidades;
    if (resConCert) resConCert.textContent = conCertificado;
    if (resSinCert) resSinCert.textContent = sinCertificado;

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
                    avisoCertificado(item) +
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

// Si la linea no trae certificado 8130-3, se avisa aqui mismo: esa pieza
// necesita la autorizacion del Jefe de Mantenimiento antes del despacho.
function avisoCertificado(item) {
    if (item.certificado === false) {
        return '<span class="badge-sin-cert">Sin 8130-3</span>';
    }
    return '';
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
