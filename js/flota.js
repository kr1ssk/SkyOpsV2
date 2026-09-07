document.addEventListener('DOMContentLoaded', () => {
    renderizarFlota();
    configurarFiltrosFlota();
});

function obtenerFlotaCompleta() {
    return obtenerStorage('skyops_flota');
}

function renderizarFlota(filtroAerolinea = '', filtroAeropuerto = '', soloAog = false) {
    const tbody = document.getElementById('tabla-flota-body');
    const contador = document.getElementById('contador-flota');
    if (!tbody) return;

    let flota = obtenerFlotaCompleta();

    const filtrados = flota.filter(item => {
        const aerolineaMatch = filtroAerolinea === '' || item.aerolinea === filtroAerolinea;
        const aeropuertoMatch = filtroAeropuerto === '' || item.aeropuerto === filtroAeropuerto;
        const aogMatch = !soloAog || item.aog === true;

        return aerolineaMatch && aeropuertoMatch && aogMatch;
    });

    const totalAog = flota.filter(i => i.aog).length;
    if (contador) contador.textContent = `${filtrados.length} aeronave(s) listada(s) - ${totalAog} declarada(s) AOG`;

    tbody.innerHTML = '';

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 1.5rem;">No se encontraron aeronaves con los filtros seleccionados.</td></tr>`;
        return;
    }

    filtrados.forEach((item) => {
        let estadoBadge = item.aog 
            ? `<span style="background: #7f1d1d; color: #fca5a5; border: 1px solid #ef4444; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: inline-flex; align-items: center; gap: 5px;"><span style="width: 6px; height: 6px; background: #ef4444; border-radius: 50%;"></span> AOG</span>`
            : `<span style="background: #14532d; color: #86efac; border: 1px solid #22c55e; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: inline-flex; align-items: center; gap: 5px;"><span style="width: 6px; height: 6px; background: #22c55e; border-radius: 50%;"></span> OPERATIVA</span>`;

        let accionBoton = item.aog
            ? `<a href="manifiesto.html" class="btn-manifesto" style="padding: 4px 12px; font-size: 0.8rem; text-decoration: none; display: inline-block;">Abrir manifiesto</a>`
            : `<span style="color: #64748b; font-size: 0.85rem;">Sin acción</span>`;

        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #334155;">
                <td><strong>${item.matricula}</strong></td>
                <td>${item.modelo}</td>
                <td>${item.aerolinea}</td>
                <td>${item.aeropuerto}</td>
                <td>${item.ubicacion}</td>
                <td>${estadoBadge}</td>
                <td>${accionBoton}</td>
            </tr>
        `;
    });
}

function configurarFiltrosFlota() {
    const selAerolinea = document.getElementById('filtro-aerolinea');
    const selAeropuerto = document.getElementById('filtro-aeropuerto');
    const checkAog = document.getElementById('check-aog');

    const actualizar = () => {
        renderizarFlota(
            selAerolinea.value,
            selAeropuerto.value,
            checkAog.checked
        );
    };

    if (selAerolinea) selAerolinea.addEventListener('change', actualizar);
    if (selAeropuerto) selAeropuerto.addEventListener('change', actualizar);
    if (checkAog) checkAog.addEventListener('change', actualizar);
}