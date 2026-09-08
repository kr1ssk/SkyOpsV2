// ---------------------------------------------------------------
// Validacion del formulario de soporte.
// Usa la misma idea que el despacho: cada campo tiene una funcion
// que revisa el dato y escribe el mensaje en el <span> de abajo.
// ---------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    configurarContadorMensaje();
    configurarFormularioContacto();
});

function mostrarErrorContacto(idCampo, mensaje) {
    const span = document.getElementById('error-' + idCampo);
    if (span) {
        span.textContent = mensaje;
        span.parentNode.classList.add('campo-con-error');
    }
}

function limpiarErrorContacto(idCampo) {
    const span = document.getElementById('error-' + idCampo);
    if (span) {
        span.textContent = '';
        span.parentNode.classList.remove('campo-con-error');
    }
}

function validarNombre() {
    const valor = document.getElementById('nombre-contacto').value.trim();

    if (valor === '') {
        mostrarErrorContacto('nombre', 'Escribe tu nombre para saber con quien hablamos.');
        return false;
    }
    if (valor.indexOf(' ') === -1) {
        mostrarErrorContacto('nombre', 'Falta el apellido. Ejemplo: Cristian Rivera.');
        return false;
    }

    limpiarErrorContacto('nombre');
    return true;
}

function validarCorreo() {
    const valor = document.getElementById('correo-contacto').value.trim();

    if (valor === '') {
        mostrarErrorContacto('correo', 'Sin correo no podemos responderte.');
        return false;
    }
    if (valor.indexOf('@') === -1) {
        mostrarErrorContacto('correo', 'Al correo le falta el arroba. Ejemplo: c.rivera@skyops.aero');
        return false;
    }
    if (valor.indexOf('.') === -1) {
        mostrarErrorContacto('correo', 'Al correo le falta el punto del dominio. Ejemplo: c.rivera@skyops.aero');
        return false;
    }

    limpiarErrorContacto('correo');
    return true;
}

function validarAeropuerto() {
    const valor = document.getElementById('aeropuerto-base').value.trim();

    if (valor === '') {
        mostrarErrorContacto('aeropuerto', 'Indica tu aeropuerto base. Ejemplo: SCL.');
        return false;
    }
    if (valor.length < 3 || valor.length > 4) {
        mostrarErrorContacto('aeropuerto', 'El codigo tiene 3 letras (IATA) o 4 (OACI). Ejemplo: SCL o SCEL.');
        return false;
    }

    limpiarErrorContacto('aeropuerto');
    return true;
}

function validarTipoSolicitud() {
    const valor = document.getElementById('tipo-solicitud').value;

    if (valor === '') {
        mostrarErrorContacto('tipo', 'Elige el tipo de solicitud para mandarla al equipo correcto.');
        return false;
    }

    limpiarErrorContacto('tipo');
    return true;
}

function validarMensaje() {
    const valor = document.getElementById('mensaje-contacto').value.trim();

    if (valor === '') {
        mostrarErrorContacto('mensaje', 'Cuentanos que necesitas.');
        return false;
    }
    if (valor.length < 20) {
        mostrarErrorContacto('mensaje', 'El mensaje es muy corto: llevas ' + valor.length + ' de 20 caracteres minimos.');
        return false;
    }
    if (valor.length > 500) {
        mostrarErrorContacto('mensaje', 'El mensaje no puede pasar de 500 caracteres.');
        return false;
    }

    limpiarErrorContacto('mensaje');
    return true;
}

function validarConsentimiento() {
    const marcado = document.getElementById('check-autorizacion').checked;

    if (!marcado) {
        mostrarErrorContacto('consentimiento', 'Necesitamos tu autorizacion para responderte por correo.');
        return false;
    }

    limpiarErrorContacto('consentimiento');
    return true;
}

function configurarContadorMensaje() {
    const mensajeInput = document.getElementById('mensaje-contacto');
    const contador = document.getElementById('contador-caracteres');
    if (!mensajeInput || !contador) return;

    mensajeInput.addEventListener('input', function () {
        const actual = mensajeInput.value.length;
        contador.textContent = actual + ' / 500';

        if (actual > 500) {
            contador.classList.add('contador-pasado');
        } else {
            contador.classList.remove('contador-pasado');
        }
    });
}

function configurarFormularioContacto() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    document.getElementById('nombre-contacto').addEventListener('blur', validarNombre);
    document.getElementById('correo-contacto').addEventListener('blur', validarCorreo);
    document.getElementById('aeropuerto-base').addEventListener('blur', validarAeropuerto);
    document.getElementById('tipo-solicitud').addEventListener('change', validarTipoSolicitud);
    document.getElementById('mensaje-contacto').addEventListener('blur', validarMensaje);
    document.getElementById('check-autorizacion').addEventListener('change', validarConsentimiento);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const okNombre = validarNombre();
        const okCorreo = validarCorreo();
        const okAeropuerto = validarAeropuerto();
        const okTipo = validarTipoSolicitud();
        const okMensaje = validarMensaje();
        const okConsentimiento = validarConsentimiento();

        if (!okNombre || !okCorreo || !okAeropuerto || !okTipo || !okMensaje || !okConsentimiento) {
            return;
        }

        const nombre = document.getElementById('nombre-contacto').value.trim();
        const correo = document.getElementById('correo-contacto').value.trim();
        const ticket = 'SOP-' + Math.floor(1000 + Math.random() * 9000);

        alert('Solicitud enviada, ' + nombre + '.\nNumero de ticket: ' + ticket +
              '\nTe responderemos a ' + correo + '.');

        form.reset();
        document.getElementById('contador-caracteres').textContent = '0 / 500';
    });
}
