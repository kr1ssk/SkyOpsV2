document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-bitacora');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const matricula = document.getElementById('matricula').value;
            const falla = document.getElementById('falla').value;

            const bitacora = obtenerStorage('skyops_bitacora');
            bitacora.push({ matricula, falla });
            guardarStorage('skyops_bitacora', bitacora);

            form.reset();
            renderizarBitacora();
        });
        renderizarBitacora();
    }
});

function renderizarBitacora() {
    const contenedor = document.getElementById('lista-bitacora');
    if (!contenedor) return;

    const bitacora = obtenerStorage('skyops_bitacora');
    contenedor.innerHTML = '';

    if (bitacora.length === 0) {
        contenedor.innerHTML = `<p style="color: #64748b; grid-column: 1/-1;">No hay aeronaves reportadas en tierra actualmente.</p>`;
        return;
    }

    bitacora.forEach((item, index) => {
        contenedor.innerHTML += `
            <div class="caja-formulario" style="background: #0f172a; color: white; margin-bottom: 0; border-left: 4px solid #ef4444; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 0.75rem; color: #ef4444; font-weight: bold; text-transform: uppercase;">Estado: AOG Activo</span>
                    <h4 style="font-size: 1.2rem; margin: 0.4rem 0;">Aeronave: ${item.matricula}</h4>
                    <p style="margin: 0.5rem 0; color: #cbd5e1; font-size: 0.9rem;"><strong>Incidente:</strong> ${item.falla}</p>
                </div>
                <button class="btn-eliminar" style="margin-top: 1rem; width: 100%;" onclick="borrarBitacora(${index})">Resolver / Cerrar AOG</button>
            </div>
        `;
    });
}

function borrarBitacora(index) {
    let bitacora = obtenerStorage('skyops_bitacora');
    bitacora.splice(index, 1);
    guardarStorage('skyops_bitacora', bitacora);
    renderizarBitacora();
}