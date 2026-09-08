document.addEventListener('DOMContentLoaded', function () {
    renderizarFlota();
    configurarFiltrosFlota();
});

function obtenerFlotaCompleta() {
    return obtenerStorage('skyops_flota');
}

function contarAog(flota) {
    let total = 0;
    for (let i = 0; i < flota.length; i++) {
        if (flota[i].aog) {
            total = total + 1;
        }
    }
    return total;
}

function renderizarFlota(filtroAerolinea, filtroAeropuerto, soloAog) {
    if (filtroAerolinea === undefined) filtroAerolinea = '';
    if (filtroAeropuerto === undefined) filtroAeropuerto = '';
    if (soloAog === undefined) soloAog = false;

    const tbody = document.getElementById('tabla-flota-body');
    const contador = document.getElementById('contador-flota');
    if (!tbody) return;

    let flota = obtenerFlotaCompleta();

    const filtrados = [];
    for (let i = 0; i < flota.length; i++) {
        const item = flota[i];
        const aerolineaMatch = filtroAerolinea === '' || item.aerolinea === filtroAerolinea;
        const aeropuertoMatch = filtroAeropuerto === '' || item.aeropuerto === filtroAeropuerto;
        const aogMatch = !soloAog || item.aog === true;

        if (aerolineaMatch && aeropuertoMatch && aogMatch) {
            filtrados.push(item);
        }
    }

    if (contador) {
        contador.textContent = filtrados.length + ' aeronave(s) listada(s) - ' +
                               contarAog(flota) + ' declarada(s) AOG';
    }

    tbody.innerHTML = '';

    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="celda-vacia">' +
                          'No se encontraron aeronaves con los filtros seleccionados.</td></tr>';
        return;
    }

    for (let i = 0; i < filtrados.length; i++) {
        const item = filtrados[i];

        let estadoBadge = '<span class="badge-operativa"><span class="punto"></span> OPERATIVA</span>';
        let accionBoton = '<span class="texto-inactivo">Sin accion</span>';

        if (item.aog) {
            estadoBadge = '<span class="badge-aog"><span class="punto"></span> AOG</span>';
            accionBoton = '<button class="btn-manifesto btn-tabla" onclick="seleccionarAeronaveAOG(\'' +
                          item.matricula + '\')">Abrir manifiesto</button>';
        }

        tbody.innerHTML +=
            '<tr>' +
                '<td><strong>' + item.matricula + '</strong></td>' +
                '<td>' + item.modelo + '</td>' +
                '<td>' + item.aerolinea + '</td>' +
                '<td>' + item.aeropuerto + '</td>' +
                '<td>' + item.ubicacion + '</td>' +
                '<td>' + estadoBadge + '</td>' +
                '<td>' + accionBoton + '</td>' +
            '</tr>';
    }
}

function seleccionarAeronaveAOG(matricula) {
    sessionStorage.setItem('skyops_aeronave_seleccionada', matricula);
    window.location.href = 'catalogo.html';
}

function configurarFiltrosFlota() {
    const selAerolinea = document.getElementById('filtro-aerolinea');
    const selAeropuerto = document.getElementById('filtro-aeropuerto');
    const checkAog = document.getElementById('check-aog');

    function actualizar() {
        renderizarFlota(
            selAerolinea ? selAerolinea.value : '',
            selAeropuerto ? selAeropuerto.value : '',
            checkAog ? checkAog.checked : false
        );
    }

    if (selAerolinea) selAerolinea.addEventListener('change', actualizar);
    if (selAeropuerto) selAeropuerto.addEventListener('change', actualizar);
    if (checkAog) checkAog.addEventListener('change', actualizar);
}
