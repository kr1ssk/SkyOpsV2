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

    // Actualizar KPIs globales
    if (kpiTotal) kpiTotal.textContent = registros.length;
    if (kpiCompletados) kpiCompletados.textContent = registros.filter(r => r.estado === 'COMPLETADO').length;
    if (kpiCursos) kpiCursos.textContent = registros.filter(r => r.estado === 'EN CURSO').length;

    // Filtrar registros
    const filtrados = registros.filter(item => {
        const matMatch = item.matricula.toLowerCase().includes(filtroMat.toLowerCase());
        const estadoMatch = filtroEstado === '' || item.estado === filtroEstado;
        return matMatch && estadoMatch;
    });

    tbody.innerHTML = '';

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 1.5rem;">No se encontraron despachos registrados con los filtros seleccionados.</td></tr>`;
        return;
    }

    filtrados.forEach((item) => {
        let colorEstado = item.estado === 'COMPLETADO' ? '#16a34a' : '#eab308';
        
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #334155;">
                <td><strong>${item.folio}</strong></td>
                <td>${item.matricula}</td>
                <td>${item.destino}</td>
                <td>${item.responsable}</td>
                <td>${item.fecha}</td>
                <td>${item.respuesta}</td>
                <td><span style="background: ${colorEstado}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">${item.estado}</span></td>
                <td><span style="background: #1e293b; color: #38bdf8; border: 1px solid #334155; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">${item.origen || 'ESTA SESIÓN'}</span></td>
            </tr>
        `;
    });
}

function configurarFiltrosBitacora() {
    const inputMat = document.getElementById('filtro-mat');
    const selectEstado = document.getElementById('filtro-estado');

    const actualizar = () => {
        renderizarBitacora(inputMat.value, selectEstado.value);
    };

    if (inputMat) inputMat.addEventListener('input', actualizar);
    if (selectEstado) selectEstado.addEventListener('change', actualizar);
}