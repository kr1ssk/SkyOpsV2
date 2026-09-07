document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    configurarFiltros();
});

function obtenerCatalogoCompleto() {
    return obtenerStorage('skyops_catalogo');
}

function renderizarCatalogo(filtroTexto = '', filtroCat = '', filtroAta = '', soloStock = false) {
    const contenedor = document.getElementById('grid-catalogo');
    const contador = document.getElementById('contador-resultados');
    if (!contenedor) return;

    let catalogo = obtenerCatalogoCompleto();

    // Aplicar filtros de búsqueda
    const filtrados = catalogo.filter(item => {
        const textoMatch = (item.nombre + ' ' + item.pn + ' ' + item.sn).toLowerCase().includes(filtroTexto.toLowerCase());
        const catMatch = filtroCat === '' || item.ata.toUpperCase().includes(filtroCat.toUpperCase());
        const ataMatch = filtroAta === '' || item.ata.includes(filtroAta);
        const stockMatch = !soloStock || item.stock > 0;

        return textoMatch && catMatch && ataMatch && stockMatch;
    });

    contador.textContent = `${filtrados.length} componentes encontrados`;
    contenedor.innerHTML = '';

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<p style="color: #64748b; grid-column: 1/-1;">No se encontraron componentes con los filtros seleccionados.</p>`;
        return;
    }

    filtrados.forEach((item) => {
        // Encontrar el índice real en el array completo para operaciones
        const indexReal = catalogo.findIndex(i => i.pn === item.pn);
        let claseBadge = item.stock > 1 ? 'badge-disp' : 'badge-bajo';
        let textoEstado = item.stock > 0 ? 'DISPONIBLE' : 'AGOTADO';

        contenedor.innerHTML += `
            <div class="tarjeta-componente">
                <div>
                    <div class="card-icon-container">⚙️</div>
                    <div class="card-header-info">
                        <span class="ata-tag">${item.ata || 'ATA GENERAL'}</span>
                        <h4>${item.nombre}</h4>
                    </div>
                    <div class="badges-row">
                        <span class="${claseBadge}">${textoEstado}</span>
                        <span class="badge-cert">8130-3</span>
                    </div>
                    <div class="specs-grid">
                        <div class="spec-row"><span>Part Number</span><span>${item.pn}</span></div>
                        <div class="spec-row"><span>Serial Number</span><span>${item.sn || 'SN-0000'}</span></div>
                        <div class="spec-row"><span>Bodega</span><span>${item.bodega || 'Bodega Central'}</span></div>
                        <div class="spec-row"><span>Stock</span><span>${item.stock || 1}</span></div>
                    </div>
                </div>
                <div>
                    <div class="card-action-row">
                        <input type="number" id="qty-${indexReal}" class="input-qty" value="1" min="1" max="${item.stock || 1}">
                        <button class="btn-manifesto" onclick="agregarAlManifiesto(${indexReal})">Agregar al manifiesto</button>
                    </div>
                    <button class="btn-eliminar" style="width: 100%; margin-top: 8px;" onclick="borrarPieza(${indexReal})">Eliminar Componente</button>
                </div>
            </div>
        `;
    });
}

function configurarFiltros() {
    const inputBuscar = document.getElementById('input-buscar');
    const selCat = document.getElementById('filtro-categoria');
    const selAta = document.getElementById('filtro-ata');
    const checkStock = document.getElementById('check-stock');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');

    const actualizar = () => {
        renderizarCatalogo(
            inputBuscar.value,
            selCat.value,
            selAta.value,
            checkStock.checked
        );
    };

    if (inputBuscar) inputBuscar.addEventListener('input', actualizar);
    if (selCat) selCat.addEventListener('change', actualizar);
    if (selAta) selAta.addEventListener('change', actualizar);
    if (checkStock) checkStock.addEventListener('change', actualizar);

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            inputBuscar.value = '';
            selCat.value = '';
            selAta.value = '';
            checkStock.checked = false;
            renderizarCatalogo();
        });
    }
}

function agregarAlManifiesto(index) {
    const catalogo = obtenerStorage('skyops_catalogo');
    const item = catalogo[index];
    const qtyInput = document.getElementById(`qty-${index}`);
    const qty = qtyInput ? qtyInput.value : 1;

    const manifiesto = obtenerStorage('skyops_manifiesto');
    manifiesto.push({
        guia: item.pn,
        destino: `${item.nombre} (Cant: ${qty}) - ${item.bodega}`
    });
    guardarStorage('skyops_manifiesto', manifiesto);

    alert(`¡Componente ${item.pn} agregado correctamente al Manifiesto de Carga!`);
}

function borrarPieza(index) {
    let catalogo = obtenerStorage('skyops_catalogo');
    catalogo.splice(index, 1);
    guardarStorage('skyops_catalogo', catalogo);
    renderizarCatalogo(
        document.getElementById('input-buscar').value,
        document.getElementById('filtro-categoria').value,
        document.getElementById('filtro-ata').value,
        document.getElementById('check-stock').checked
    );
}