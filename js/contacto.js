document.addEventListener('DOMContentLoaded', () => {
    const mensajeInput = document.getElementById('mensaje-contacto');
    const contador = document.getElementById('contador-caracteres');
    const form = document.getElementById('form-contacto');

    if (mensajeInput && contador) {
        mensajeInput.addEventListener('input', () => {
            const actual = mensajeInput.value.length;
            contador.textContent = `${actual} / 500`;
            if (actual > 500) {
                contador.style.color = '#ef4444';
            } else {
                contador.style.color = '#94a3b8';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre-contacto').value;
            const correo = document.getElementById('correo-contacto').value;
            const mensaje = mensajeInput.value;

            if (mensaje.length < 20) {
                alert('El mensaje es demasiado corto. Debe tener al menos 20 caracteres para detallar la incidencia.');
                return;
            }

            alert(`¡Solicitud enviada exitosamente, ${nombre}!\nUn operador del centro de control se comunicará a ${correo} según el SLA comprometido.`);
            form.reset();
            if (contador) contador.textContent = '0 / 500';
        });
    }
});