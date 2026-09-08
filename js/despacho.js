document.addEventListener('DOMContentLoaded', () => {
    renderizarManifiestoEnDespacho();
    configurarFormularioDespacho();
    
    // Autorellenar matrícula si viene seleccionada desde la flota
    const matSeleccionada = sessionStorage.getItem('skyops_aeronave_seleccionada');
    if (matSeleccionada) {
        const inputMat = document.getElementById('despacho-matricula');
        if (inputMat) inputMat.value = matSeleccionada;
    }
});

function renderizarManifiestoEnDespacho() {
    const tbody = document.getElementById('tabla-despacho-body');
    if (!tbody) return;

    let manifiesto = obtenerStorage('skyops_manifiesto');
    tbody.innerHTML = '';

    if (manifiesto.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="celda-vacia">No hay componentes en el manifiesto activo. Agrega piezas desde el catálogo.</td></tr>`;
        return;
    }

    manifiesto.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${item.guia}</strong></td>
                <td>${item.nombre}</td>
                <td>${item.ata}</td>
                <td>${item.bodega}</td>
                <td><strong class="texto-celeste">${item.cantidad}</strong></td>
            </tr>
        `;
    });
}

function configurarFormularioDespacho() {
    const form = document.getElementById('form-despacho');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let manifiesto = obtenerStorage('skyops_manifiesto');
        if (manifiesto.length === 0) {
            alert('Error: No puedes autorizar un despacho sin componentes en el manifiesto.');
            window.location.href = 'catalogo.html';
            return;
        }

        const matricula = document.getElementById('despacho-matricula').value.trim();
        const destino = document.getElementById('despacho-destino').value;
        const ingeniero = document.getElementById('despacho-ingeniero').value.trim();
        const licencia = document.getElementById('despacho-licencia').value.trim();
        const check = document.getElementById('check-autorizacion').checked;

        if (!matricula || !destino || !ingeniero || !licencia || !check) {
            alert('Por favor, complete todos los campos obligatorios y marque la casilla de aceptación.');
            return;
        }

        // Generar número de folio único
        const folioRandom = 'AOG-' + Math.floor(1000 + Math.random() * 9000);
        const ahora = new Date();
        const fechaStr = ahora.toISOString().slice(0, 10) + ' ' + ahora.toTimeString().slice(0, 5);
        const segundosResp = Math.floor(60 + Math.random() * 30) + ' s';

        let bitacora = obtenerStorage('skyops_bitacora');
        
        const nuevoDespacho = {
            folio: folioRandom,
            matricula: matricula.toUpperCase(),
            destino: destino,
            responsable: ingeniero,
            fecha: fechaStr,
            respuesta: segundosResp,
            estado: 'EN CURSO',
            origen: 'ESTA SESIÓN'
        };

        bitacora.unshift(nuevoDespacho);
        guardarStorage('skyops_bitacora', bitacora);

        // Vaciar manifiesto activo tras autorizar
        guardarStorage('skyops_manifiesto', []);
        sessionStorage.removeItem('skyops_aeronave_seleccionada');

        alert(`¡Despacho autorizado con éxito!\nFolio generado: ${folioRandom}\nEl registro se ha enviado a la bitácora.`);
        window.location.href = 'bitacora.html';
    });
}