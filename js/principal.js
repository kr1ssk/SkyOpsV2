document.addEventListener('DOMContentLoaded', () => {
    actualizarContadoresIndex();
});

function actualizarContadoresIndex() {
    const elAog = document.getElementById('stat-aog');
    const elRepuestos = document.getElementById('stat-repuestos');

    if (elAog && elRepuestos) {
        const bitacora = obtenerStorage('skyops_bitacora');
        const catalogo = obtenerStorage('skyops_catalogo');
        elAog.textContent = bitacora.length;
        elRepuestos.textContent = catalogo.length;
    }
}