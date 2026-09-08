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

    const filtrados = catalogo.filter(item => {
        const textoMatch = (item.nombre + ' ' + item.pn + ' ' + item.sn + ' ' + item.ata).toLowerCase().includes(filtroTexto.toLowerCase());
        const catMatch = filtroCat === '' || item.ata.toUpperCase().includes(filtroCat.toUpperCase());
        const ataMatch = filtroAta === '' || item.ata.toUpperCase().includes(filtroAta.toUpperCase());
        const stockMatch = !soloStock || item.stock > 0;

        return textoMatch && catMatch && ataMatch && stockMatch;
    });

    if (contador) contador.textContent = `${filtrados.length} componentes encontrados`;
    contenedor.innerHTML = '';

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<p style="color: #64748b; grid-column: 1/-1;">No se encontraron componentes con los filtros seleccionados.</p>`;
        return;
    }

    filtrados.forEach((item) => {
        const indexReal = catalogo.findIndex(i => i.pn === item.pn);
        let claseBadge = item.stock > 1 ? 'badge-disp' : 'badge-bajo';
        let textoEstado = item.stock > 0 ? 'DISPONIBLE' : 'AGOTADO';
        let imagenUrl = item.imagen || 'assets/img/actuador-tren.svg';

        contenedor.innerHTML += `
            <div class="tarjeta-componente" style="display: flex; flex-direction: column; justify-content: space-between; background: #1e293b; border: 1px solid #334155; border-radius: 8px; overflow: hidden; padding: 1rem;">
                <div>
                    <div style="width: 100%; height: 140px; overflow: hidden; border-radius: 6px; margin-bottom: 1rem; background: #0f172a;">
                        <img src="${imagenUrl}" alt="${item.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="card-header-info">
                        <span class="ata-tag" style="background: #0284c7; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">${item.ata || 'ATA GENERAL'}</span>
                        <h4 style="color: white; font-size: 1rem; margin: 8px 0;">${item.nombre}</h4>
                    </div>
                    <div class="badges-row" style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <span class="${claseBadge}">${textoEstado}</span>
                        <span class="badge-cert" style="background: #334155; color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">8130-3</span>
                    </div>
                    <div class="specs-grid" style="font-size: 0.8rem; color: #94a3b8; display: flex; flex-direction: column; gap: 4px; margin-bottom: 1rem;">
                        <div class="spec-row" style="display: flex; justify-content: space-between;"><span>Part Number</span><strong style="color:white;">${item.pn}</strong></div>
                        <div class="spec-row" style="display: flex; justify-content: space-between;"><span>Serial Number</span><strong style="color:white;">${item.sn || 'SN-0000'}</strong></div>
                        <div class="spec-row" style="display: flex; justify-content: space-between;"><span>Bodega</span><strong style="color:white;">${item.bodega || 'Bodega Central'}</strong></div>
                        <div class="spec-row" style="display: flex; justify-content: space-between;"><span>Stock</span><strong style="color:white;">${item.stock || 1}</strong></div>
                    </div>
                </div>
                <div>
                    <div class="card-action-row" style="display: flex; gap: 8px; align-items: center;">
                        <input type="number" id="qty-${indexReal}" class="input-qty" value="1" min="1" max="${item.stock || 1}" style="width: 50px; padding: 4px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 4px; text-align: center;">
                        <button class="btn-manifesto" onclick="agregarAlManifiesto(${indexReal})" style="flex: 1; padding: 6px; font-size: 0.8rem; cursor: pointer;">Agregar al manifiesto</button>
                    </div>
                    <button class="btn-eliminar" style="width: 100%; margin-top: 8px; background: #7f1d1d; color: #fca5a5; border: none; padding: 5px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;" onclick="borrarPieza(${indexReal})">Eliminar Componente</button>
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
            inputBuscar ? inputBuscar.value : '',
            selCat ? selCat.value : '',
            selAta ? selAta.value : '',
            checkStock ? checkStock.checked : false
        );
    };

    if (inputBuscar) inputBuscar.addEventListener('input', actualizar);
    if (selCat) selCat.addEventListener('change', actualizar);
    if (selAta) selAta.addEventListener('change', actualizar);
    if (checkStock) checkStock.addEventListener('change', actualizar);

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (inputBuscar) inputBuscar.value = '';
            if (selCat) selCat.value = '';
            if (selAta) selAta.value = '';
            if (checkStock) checkStock.checked = false;
            renderizarCatalogo();
        });
    }
}

function agregarAlManifiesto(index) {
    const catalogo = obtenerStorage('skyops_catalogo');
    const item = catalogo[index];
    const qtyInput = document.getElementById(`qty-${index}`);
    const qty = parseInt(qtyInput ? qtyInput.value : 1);

    const manifiesto = obtenerStorage('skyops_manifiesto');
    const existente = manifiesto.find(m => m.guia === item.pn);
    
    if (existente) {
        existente.cantidad = (parseInt(existente.cantidad) || 1) + qty;
        if (existente.cantidad > item.stock) existente.cantidad = item.stock;
    } else {
        manifiesto.push({
            guia: item.pn,
            nombre: item.nombre,
            sn: item.sn,
            ata: item.ata,
            bodega: item.bodega,
            cantidad: qty,
            stockMax: item.stock,
            destino: `${item.nombre} - ${item.bodega}`
        });
    }

    guardarStorage('skyops_manifiesto', manifiesto);
    alert(`¡Componente ${item.pn} agregado correctamente al Manifiesto (Work Order)!`);
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