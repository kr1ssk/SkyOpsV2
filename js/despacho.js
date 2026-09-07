document.addEventListener('DOMContentLoaded', () => {
    renderizarManifiestoDespacho();
    configurarFormularioDespacho();
});

function renderizarManifiestoDespacho() {
    const tbody = document.getElementById('tabla-despacho-body');
    if (!tbody) return;

    const manifiesto = obtenerStorage('skyops_manifiesto');
    tbody.innerHTML = '';

    if (manifiesto.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 1rem;">No hay elementos en el manifiesto actual. Añade componentes desde el catálogo.</td></tr>`;
        return;
    }

    manifiesto.forEach((item) => {
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #334155;">
                <td>${item.guia}</td>
                <td>${item.destino}</td>
                <td>Estructura / Motor</td>
                <td>Bodega Central</td>
                <td>1</td>
            </tr>
        `;
    });
}

function configurarFormularioDespacho() {
    const form = document.getElementById('form-despacho');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const matricula = document.getElementById('despacho-matricula').value;
            const destino = document.getElementById('despacho-destino').value;
            const ingeniero = document.getElementById('despacho-ingeniero').value;

            // Generar fecha y folio automático
            const ahora = new Date();
            const fechaStr = ahora.toISOString().slice(0, 10) + ' ' + ahora.toTimeString().slice(0, 5);
            const folioAleatorio = 'AOG-' + Math.floor(1000 + Math.random() * 9000);

            // Guardar en la bitácora
            const bitacora = obtenerStorage('skyops_bitacora');
            bitacora.unshift({
                folio: folioAleatorio,
                matricula: matricula.toUpperCase(),
                destino: destino,
                responsable: ingeniero,
                fecha: fechaStr,
                respuesta: '72 s',
                estado: 'EN CURSO',
                origen: 'ESTA SESIÓN'
            });
            guardarStorage('skyops_bitacora', bitacora);

            alert(`¡Despacho AOG autorizado con éxito!\nFolio generado: ${folioAleatorio}\nRegistrado en la Bitácora de Despachos.`);
            
            // Limpiar manifiesto tras autorizar
            localStorage.setItem('skyops_manifiesto', JSON.stringify([]));
            form.reset();
            renderizarManifiestoDespacho();
        });
    }
}