document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-manifiesto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const guia = document.getElementById('guia').value;
            const destino = document.getElementById('destino').value;

            const manifiesto = obtenerStorage('skyops_manifiesto');
            manifiesto.push({ guia, destino });
            guardarStorage('skyops_manifiesto', manifiesto);

            form.reset();
            renderizarManifiesto();
        });
        renderizarManifiesto();
    }
});

function renderizarManifiesto() {
    const cuerpo = document.getElementById('cuerpo-manifiesto');
    if (!cuerpo) return;

    const manifiesto = obtenerStorage('skyops_manifiesto');
    cuerpo.innerHTML = '';

    if (manifiesto.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #64748b;">No hay envíos registrados en el manifiesto.</td></tr>`;
        return;
    }

    manifiesto.forEach((item, index) => {
        cuerpo.innerHTML += `
            <tr>
                <td>${item.guia}</td>
                <td>${item.destino}</td>
                <td><button class="btn-eliminar" onclick="borrarManifiesto(${index})">X</button></td>
            </tr>
        `;
    });
}

function borrarManifiesto(index) {
    let manifiesto = obtenerStorage('skyops_manifiesto');
    manifiesto.splice(index, 1);
    guardarStorage('skyops_manifiesto', manifiesto);
    renderizarManifiesto();
}