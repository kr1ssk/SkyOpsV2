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
        tbody.innerHTML = `<tr><td colspan="7" class="celda-vacia">No se encontraron aeronaves con los filtros seleccionados.</td></tr>`;
        return;
    }

    filtrados.forEach((item) => {
        let estadoBadge = item.aog 
            ? `<span class="badge-aog"><span class="punto"></span> AOG</span>`
            : `<span class="badge-operativa"><span class="punto"></span> OPERATIVA</span>`;

        let accionBoton = item.aog
            ? `<button onclick="seleccionarAeronaveAOG('${item.matricula}')" class="btn-manifesto btn-tabla">Abrir manifiesto</button>`
            : `<span class="texto-inactivo">Sin acción</span>`;

        tbody.innerHTML += `
            <tr>
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

function seleccionarAeronaveAOG(matricula) {
    sessionStorage.setItem('skyops_aeronave_seleccionada', matricula);
    window.location.href = 'catalogo.html';
}

function configurarFiltrosFlota() {
    const selAerolinea = document.getElementById('filtro-aerolinea');
    const selAeropuerto = document.getElementById('filtro-aeropuerto');
    const checkAog = document.getElementById('check-aog');

    const actualizar = () => {
        renderizarFlota(
            selAerolinea ? selAerolinea.value : '',
            selAeropuerto ? selAeropuerto.value : '',
            checkAog ? checkAog.checked : false
        );
    };

    if (selAerolinea) selAerolinea.addEventListener('change', actualizar);
    if (selAeropuerto) selAeropuerto.addEventListener('change', actualizar);
    if (checkAog) checkAog.addEventListener('change', actualizar);
}