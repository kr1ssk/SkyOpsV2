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

            alert(`¡Despacho AOG autorizado con éxito para la aeronave ${matricula} hacia ${destino}!\nIngeniero a cargo: ${ingeniero}`);
            
            // Limpiar manifiesto tras autorizar despacho exitoso
            localStorage.setItem('skyops_manifiesto', JSON.stringify([]));
            form.reset();
            renderizarManifiestoDespacho();
        });
    }
}