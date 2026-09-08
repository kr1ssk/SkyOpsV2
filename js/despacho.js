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

// ---------------------------------------------------------------
// Validacion del formulario de despacho
// Cada campo tiene su propia funcion. Si el dato esta malo, escribimos
// el mensaje en el <span> que esta debajo de ese campo y devolvemos
// false. Asi el usuario ve el error justo donde se equivoco y no en
// una ventana aparte.
// ---------------------------------------------------------------

function esLetra(caracter) {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letras.indexOf(caracter.toUpperCase()) !== -1;
}

function esNumero(caracter) {
    return '0123456789'.indexOf(caracter) !== -1;
}

function mostrarError(idCampo, mensaje) {
    const span = document.getElementById('error-' + idCampo);
    if (span) {
        span.textContent = mensaje;
        span.parentNode.classList.add('campo-con-error');
    }
}

function limpiarError(idCampo) {
    const span = document.getElementById('error-' + idCampo);
    if (span) {
        span.textContent = '';
        span.parentNode.classList.remove('campo-con-error');
    }
}

function validarMatricula() {
    const valor = document.getElementById('despacho-matricula').value.trim().toUpperCase();

    if (valor === '') {
        mostrarError('matricula', 'La matricula es obligatoria: sin ella no se puede trazar el despacho.');
        return false;
    }
    if (valor.length !== 6) {
        mostrarError('matricula', 'La matricula tiene 6 caracteres. Escribiste ' + valor.length + '. Ejemplo: CC-BFA.');
        return false;
    }
    if (valor.substring(0, 3) !== 'CC-') {
        mostrarError('matricula', 'Las matriculas chilenas empiezan con CC-. Ejemplo: CC-BFA.');
        return false;
    }
    if (!esLetra(valor.charAt(3)) || !esLetra(valor.charAt(4)) || !esLetra(valor.charAt(5))) {
        mostrarError('matricula', 'Despues de CC- van tres letras, no numeros. Ejemplo: CC-BFA.');
        return false;
    }

    limpiarError('matricula');
    return true;
}

function validarDestino() {
    const valor = document.getElementById('despacho-destino').value;

    if (valor === '') {
        mostrarError('destino', 'Elige la puerta o el hangar donde esta la aeronave.');
        return false;
    }

    limpiarError('destino');
    return true;
}

function validarIngeniero() {
    const valor = document.getElementById('despacho-ingeniero').value.trim();

    if (valor === '') {
        mostrarError('ingeniero', 'Indica quien autoriza el despacho.');
        return false;
    }
    if (valor.length < 5) {
        mostrarError('ingeniero', 'El nombre es muy corto. Escribe nombre y apellido.');
        return false;
    }
    if (valor.indexOf(' ') === -1) {
        mostrarError('ingeniero', 'Falta el apellido. Ejemplo: Agustin Boeri.');
        return false;
    }

    limpiarError('ingeniero');
    return true;
}

function validarLicencia() {
    const valor = document.getElementById('despacho-licencia').value.trim().toUpperCase();

    if (valor === '') {
        mostrarError('licencia', 'La licencia habilita al ingeniero: es obligatoria.');
        return false;
    }
    if (valor.length !== 7) {
        mostrarError('licencia', 'La licencia tiene 7 caracteres. Ejemplo: LE-3401.');
        return false;
    }
    if (!esLetra(valor.charAt(0)) || !esLetra(valor.charAt(1)) || valor.charAt(2) !== '-') {
        mostrarError('licencia', 'La licencia parte con dos letras y un guion. Ejemplo: LE-3401.');
        return false;
    }
    for (let i = 3; i < 7; i++) {
        if (!esNumero(valor.charAt(i))) {
            mostrarError('licencia', 'Despues del guion van cuatro numeros. Ejemplo: LE-3401.');
            return false;
        }
    }

    limpiarError('licencia');
    return true;
}

function validarAutorizacion() {
    const marcado = document.getElementById('check-autorizacion').checked;

    if (!marcado) {
        mostrarError('autorizacion', 'Debes declarar que la informacion es correcta antes de autorizar.');
        return false;
    }

    limpiarError('autorizacion');
    return true;
}

function configurarFormularioDespacho() {
    const form = document.getElementById('form-despacho');
    if (!form) return;

    // Revisamos cada campo cuando el usuario sale de el, para que se de
    // cuenta al tiro y no despues de apretar el boton.
    document.getElementById('despacho-matricula').addEventListener('blur', validarMatricula);
    document.getElementById('despacho-destino').addEventListener('change', validarDestino);
    document.getElementById('despacho-ingeniero').addEventListener('blur', validarIngeniero);
    document.getElementById('despacho-licencia').addEventListener('blur', validarLicencia);
    document.getElementById('check-autorizacion').addEventListener('change', validarAutorizacion);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let manifiesto = obtenerStorage('skyops_manifiesto');
        if (manifiesto.length === 0) {
            alert('No puedes autorizar un despacho sin componentes en el manifiesto.');
            window.location.href = 'catalogo.html';
            return;
        }

        // Se revisan todos, no solo hasta el primer error, para que el
        // usuario vea de una vez todo lo que le falta.
        const okMatricula = validarMatricula();
        const okDestino = validarDestino();
        const okIngeniero = validarIngeniero();
        const okLicencia = validarLicencia();
        const okAutorizacion = validarAutorizacion();

        if (!okMatricula || !okDestino || !okIngeniero || !okLicencia || !okAutorizacion) {
            return;
        }

        const matricula = document.getElementById('despacho-matricula').value.trim().toUpperCase();
        const destino = document.getElementById('despacho-destino').value;
        const ingeniero = document.getElementById('despacho-ingeniero').value.trim();

        const folioRandom = 'AOG-' + Math.floor(1000 + Math.random() * 9000);
        const ahora = new Date();
        const fechaStr = ahora.toISOString().slice(0, 10) + ' ' + ahora.toTimeString().slice(0, 5);
        const segundosResp = Math.floor(60 + Math.random() * 30) + ' s';

        let bitacora = obtenerStorage('skyops_bitacora');

        const nuevoDespacho = {
            folio: folioRandom,
            matricula: matricula,
            destino: destino,
            responsable: ingeniero,
            fecha: fechaStr,
            respuesta: segundosResp,
            estado: 'EN CURSO',
            origen: 'ESTA SESIÓN'
        };

        bitacora.unshift(nuevoDespacho);
        guardarStorage('skyops_bitacora', bitacora);

        guardarStorage('skyops_manifiesto', []);
        sessionStorage.removeItem('skyops_aeronave_seleccionada');

        alert('Despacho autorizado.\nFolio: ' + folioRandom + '\nEl registro quedo en la bitacora.');
        window.location.href = 'bitacora.html';
    });
}
