document.addEventListener('DOMContentLoaded', () => {
    mostrarAeronaveSeleccionada();
    renderizarCatalogo();
    configurarFiltros();
});

// Si el usuario llego aqui desde la pagina de Flota, avisamos para que
// aeronave esta armando el manifiesto.
function mostrarAeronaveSeleccionada() {
    const aviso = document.getElementById('aviso-aeronave');
    const matricula = sessionStorage.getItem('skyops_aeronave_seleccionada');

    if (!aviso) return;

    if (matricula) {
        aviso.textContent = 'Estas armando el manifiesto para la aeronave ' + matricula +
                            ', declarada AOG. Los componentes que agregues quedaran asociados a ese despacho.';
    } else {
        aviso.classList.add('oculto');
    }
}

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
        contenedor.innerHTML = `<p class="sin-resultados">No se encontraron componentes con los filtros seleccionados.</p>`;
        return;
    }

    filtrados.forEach((item) => {
        const indexReal = catalogo.findIndex(i => i.pn === item.pn);
        let claseBadge = item.stock > 1 ? 'badge-disp' : 'badge-bajo';
        let textoEstado = item.stock > 0 ? 'DISPONIBLE' : 'AGOTADO';
        let imagenUrl = item.imagen || 'assets/img/actuador-tren.svg';

        contenedor.innerHTML += `
            <article class="tarjeta-componente">
                <div>
                    <div class="imagen-componente">
                        <img src="${imagenUrl}" alt="${item.nombre}">
                    </div>
                    <div class="card-header-info">
                        <span class="ata-tag">${item.ata || 'ATA GENERAL'}</span>
                        <h4>${item.nombre}</h4>
                    </div>
                    <div class="badges-row">
                        <span class="${claseBadge}">${textoEstado}</span>
                        <span class="badge-cert">8130-3</span>
                    </div>
                    <div class="specs-grid">
                        <div class="spec-row"><span>Part Number</span><strong>${item.pn}</strong></div>
                        <div class="spec-row"><span>Serial Number</span><strong>${item.sn || 'SN-0000'}</strong></div>
                        <div class="spec-row"><span>Bodega</span><strong>${item.bodega || 'Bodega Central'}</strong></div>
                        <div class="spec-row"><span>Stock</span><strong>${item.stock || 1}</strong></div>
                    </div>
                </div>
                <div>
                    <div class="card-action-row">
                        <label class="etiqueta-oculta" for="qty-${indexReal}">Cantidad de ${item.nombre}</label>
                        <input type="number" id="qty-${indexReal}" class="input-qty" value="1" min="1" max="${item.stock || 1}">
                        <button class="btn-manifesto" onclick="agregarAlManifiesto(${indexReal})">Agregar al manifiesto</button>
                    </div>
                    <button class="btn-eliminar btn-ancho" onclick="borrarPieza(${indexReal})">Eliminar Componente</button>
                </div>
            </article>
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