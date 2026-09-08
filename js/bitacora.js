document.addEventListener('DOMContentLoaded', function () {
    renderizarBitacora();
    configurarFiltrosBitacora();
});

function obtenerBitacoraCompleta() {
    return obtenerStorage('skyops_bitacora');
}

// Cuenta cuantos registros estan en un estado, recorriendo el arreglo
function contarPorEstado(registros, estado) {
    let total = 0;
    for (let i = 0; i < registros.length; i++) {
        if (registros[i].estado === estado) {
            total = total + 1;
        }
    }
    return total;
}

function renderizarBitacora(filtroMat, filtroEstado) {
    if (filtroMat === undefined) filtroMat = '';
    if (filtroEstado === undefined) filtroEstado = '';

    const tbody = document.getElementById('tabla-bitacora-body');
    const kpiTotal = document.getElementById('kpi-total');
    const kpiCompletados = document.getElementById('kpi-completados');
    const kpiCursos = document.getElementById('kpi-cursos');
    if (!tbody) return;

    let registros = obtenerBitacoraCompleta();

    if (kpiTotal) kpiTotal.textContent = registros.length;
    if (kpiCompletados) kpiCompletados.textContent = contarPorEstado(registros, 'COMPLETADO');
    if (kpiCursos) kpiCursos.textContent = contarPorEstado(registros, 'EN CURSO');

    // Armamos la lista filtrada con un for y un arreglo nuevo
    const filtrados = [];
    for (let i = 0; i < registros.length; i++) {
        const item = registros[i];
        const matMatch = item.matricula.toLowerCase().indexOf(filtroMat.toLowerCase()) !== -1;
        const estadoMatch = filtroEstado === '' || item.estado === filtroEstado;

        if (matMatch && estadoMatch) {
            filtrados.push(item);
        }
    }

    tbody.innerHTML = '';

    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="celda-vacia">' +
                          'No se encontraron despachos con los filtros seleccionados.</td></tr>';
        return;
    }

    for (let i = 0; i < filtrados.length; i++) {
        const item = filtrados[i];
        let claseEstado = 'badge-encurso';
        if (item.estado === 'COMPLETADO') {
            claseEstado = 'badge-completado';
        }

        let botonAccion = '<span class="texto-inactivo">Cerrado</span>';
        if (item.estado === 'EN CURSO') {
            botonAccion = '<button class="btn-resolver" onclick="resolverDespacho(\'' +
                          item.folio + '\')">Resolver AOG</button>';
        }

        tbody.innerHTML +=
            '<tr>' +
                '<td><strong>' + item.folio + '</strong></td>' +
                '<td>' + item.matricula + '</td>' +
                '<td>' + item.destino + '</td>' +
                '<td>' + item.responsable + '</td>' +
                '<td>' + item.fecha + '</td>' +
                '<td>' + item.respuesta + '</td>' +
                '<td><span class="' + claseEstado + '">' + item.estado + '</span></td>' +
                '<td>' + botonAccion + '</td>' +
            '</tr>';
    }
}

// Se busca por folio y no por posicion: si hay un filtro activo, la posicion
// dentro de la tabla no es la misma que dentro del arreglo completo.
function resolverDespacho(folio) {
    let bitacora = obtenerStorage('skyops_bitacora');

    for (let i = 0; i < bitacora.length; i++) {
        if (bitacora[i].folio === folio) {
            bitacora[i].estado = 'COMPLETADO';
            guardarStorage('skyops_bitacora', bitacora);

            renderizarBitacora(
                document.getElementById('filtro-mat').value,
                document.getElementById('filtro-estado').value
            );

            alert('Incidente resuelto. El despacho ' + bitacora[i].folio +
                  ' figura como COMPLETADO y la aeronave ' + bitacora[i].matricula +
                  ' fue liberada a servicio.');
            return;
        }
    }
}

function configurarFiltrosBitacora() {
    const inputMat = document.getElementById('filtro-mat');
    const selectEstado = document.getElementById('filtro-estado');

    function actualizar() {
        renderizarBitacora(
            inputMat ? inputMat.value : '',
            selectEstado ? selectEstado.value : ''
        );
    }

    if (inputMat) inputMat.addEventListener('input', actualizar);
    if (selectEstado) selectEstado.addEventListener('change', actualizar);
}
