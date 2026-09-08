document.addEventListener('DOMContentLoaded', () => {
    renderizarBitacora();
    configurarFiltrosBitacora();
});

function obtenerBitacoraCompleta() {
    return obtenerStorage('skyops_bitacora');
}

function renderizarBitacora(filtroMat = '', filtroEstado = '') {
    const tbody = document.getElementById('tabla-bitacora-body');
    const kpiTotal = document.getElementById('kpi-total');
    const kpiCompletados = document.getElementById('kpi-completados');
    const kpiCursos = document.getElementById('kpi-cursos');
    if (!tbody) return;

    let registros = obtenerBitacoraCompleta();

    if (kpiTotal) kpiTotal.textContent = registros.length;
    if (kpiCompletados) kpiCompletados.textContent = registros.filter(r => r.estado === 'COMPLETADO').length;
    if (kpiCursos) kpiCursos.textContent = registros.filter(r => r.estado === 'EN CURSO').length;

    const filtrados = registros.filter(item => {
        const matMatch = item.matricula.toLowerCase().includes(filtroMat.toLowerCase());
        const estadoMatch = filtroEstado === '' || item.estado === filtroEstado;
        return matMatch && estadoMatch;
    });

    tbody.innerHTML = '';

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="celda-vacia">No se encontraron despachos registrados con los filtros seleccionados.</td></tr>`;
        return;
    }

    filtrados.forEach((item) => {
        let claseEstado = item.estado === 'COMPLETADO' ? 'badge-completado' : 'badge-encurso';
        
        let botonAccion = item.estado === 'EN CURSO' 
            ? `<button onclick="resolverDespacho('${item.folio}')" class="btn-resolver">Resolver AOG</button>`
            : `<span class="texto-inactivo">Cerrado</span>`;

        tbody.innerHTML += `
            <tr>
                <td><strong>${item.folio}</strong></td>
                <td>${item.matricula}</td>
                <td>${item.destino}</td>
                <td>${item.responsable}</td>
                <td>${item.fecha}</td>
                <td>${item.respuesta}</td>
                <td><span class="${claseEstado}">${item.estado}</span></td>
                <td>${botonAccion}</td>
            </tr>
        `;
    });
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

    const actualizar = () => {
        renderizarBitacora(inputMat ? inputMat.value : '', selectEstado ? selectEstado.value : '');
    };

    if (inputMat) inputMat.addEventListener('input', actualizar);
    if (selectEstado) selectEstado.addEventListener('change', actualizar);
}