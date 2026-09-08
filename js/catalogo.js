document.addEventListener('DOMContentLoaded', function () {
    mostrarAeronaveSeleccionada();
    renderizarCatalogo();
    configurarFiltros();
});

function obtenerCatalogoCompleto() {
    return obtenerStorage('skyops_catalogo');
}

// Si el usuario llego aqui desde la pagina de Flota, avisamos para que
// aeronave esta armando el manifiesto.
function mostrarAeronaveSeleccionada() {
    const aviso = document.getElementById('aviso-aeronave');
    const matricula = sessionStorage.getItem('skyops_aeronave_seleccionada');
    if (!aviso) return;

    if (matricula) {
        aviso.textContent = 'Estas armando el manifiesto para la aeronave ' + matricula +
                            ', declarada AOG. Los componentes que agregues quedaran ' +
                            'asociados a ese despacho.';
    } else {
        aviso.classList.add('oculto');
    }
}

// Busca la posicion de un componente en el catalogo completo usando su P/N
function buscarPosicionPorPn(catalogo, pn) {
    for (let i = 0; i < catalogo.length; i++) {
        if (catalogo[i].pn === pn) {
            return i;
        }
    }
    return -1;
}

function renderizarCatalogo(filtroTexto, filtroCat, filtroAta, soloStock) {
    if (filtroTexto === undefined) filtroTexto = '';
    if (filtroCat === undefined) filtroCat = '';
    if (filtroAta === undefined) filtroAta = '';
    if (soloStock === undefined) soloStock = false;

    const contenedor = document.getElementById('grid-catalogo');
    const contador = document.getElementById('contador-resultados');
    if (!contenedor) return;

    let catalogo = obtenerCatalogoCompleto();
    const texto = filtroTexto.toLowerCase();

    const filtrados = [];
    for (let i = 0; i < catalogo.length; i++) {
        const item = catalogo[i];
        const buscable = (item.nombre + ' ' + item.pn + ' ' + item.sn + ' ' + item.ata).toLowerCase();

        const textoMatch = buscable.indexOf(texto) !== -1;
        const catMatch = filtroCat === '' || item.ata.toUpperCase().indexOf(filtroCat.toUpperCase()) !== -1;
        const ataMatch = filtroAta === '' || item.ata.toUpperCase().indexOf(filtroAta.toUpperCase()) !== -1;
        const stockMatch = !soloStock || item.stock > 0;

        if (textoMatch && catMatch && ataMatch && stockMatch) {
            filtrados.push(item);
        }
    }

    if (contador) {
        contador.textContent = filtrados.length + ' componentes encontrados';
    }

    contenedor.innerHTML = '';

    if (filtrados.length === 0) {
        contenedor.innerHTML = '<p class="sin-resultados">No se encontraron componentes ' +
                               'con los filtros seleccionados.</p>';
        return;
    }

    for (let i = 0; i < filtrados.length; i++) {
        const item = filtrados[i];
        const posicion = buscarPosicionPorPn(catalogo, item.pn);

        let claseBadge = 'badge-bajo';
        if (item.stock > 1) {
            claseBadge = 'badge-disp';
        }

        let textoEstado = 'AGOTADO';
        if (item.stock > 0) {
            textoEstado = 'DISPONIBLE';
        }

        const imagenUrl = item.imagen || 'assets/img/actuador-tren.svg';

        contenedor.innerHTML +=
            '<article class="tarjeta-componente">' +
                '<div>' +
                    '<div class="imagen-componente">' +
                        '<img src="' + imagenUrl + '" alt="' + item.nombre + '">' +
                    '</div>' +
                    '<div class="card-header-info">' +
                        '<span class="ata-tag">' + (item.ata || 'ATA GENERAL') + '</span>' +
                        '<h4>' + item.nombre + '</h4>' +
                    '</div>' +
                    '<div class="badges-row">' +
                        '<span class="' + claseBadge + '">' + textoEstado + '</span>' +
                        '<span class="badge-cert">8130-3</span>' +
                    '</div>' +
                    '<div class="specs-grid">' +
                        '<div class="spec-row"><span>Part Number</span><strong>' + item.pn + '</strong></div>' +
                        '<div class="spec-row"><span>Serial Number</span><strong>' + (item.sn || 'SN-0000') + '</strong></div>' +
                        '<div class="spec-row"><span>Bodega</span><strong>' + (item.bodega || 'Bodega Central') + '</strong></div>' +
                        '<div class="spec-row"><span>Stock</span><strong>' + (item.stock || 1) + '</strong></div>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<div class="card-action-row">' +
                        '<label class="etiqueta-oculta" for="qty-' + posicion + '">Cantidad de ' + item.nombre + '</label>' +
                        '<input type="number" id="qty-' + posicion + '" class="input-qty" value="1" min="1" max="' + (item.stock || 1) + '">' +
                        '<button class="btn-manifesto" onclick="agregarAlManifiesto(' + posicion + ')">Agregar al manifiesto</button>' +
                    '</div>' +
                    '<button class="btn-eliminar btn-ancho" onclick="borrarPieza(' + posicion + ')">Eliminar Componente</button>' +
                '</div>' +
            '</article>';
    }
}

function configurarFiltros() {
    const inputBuscar = document.getElementById('input-buscar');
    const selCat = document.getElementById('filtro-categoria');
    const selAta = document.getElementById('filtro-ata');
    const checkStock = document.getElementById('check-stock');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');

    function actualizar() {
        renderizarCatalogo(
            inputBuscar ? inputBuscar.value : '',
            selCat ? selCat.value : '',
            selAta ? selAta.value : '',
            checkStock ? checkStock.checked : false
        );
    }

    if (inputBuscar) inputBuscar.addEventListener('input', actualizar);
    if (selCat) selCat.addEventListener('change', actualizar);
    if (selAta) selAta.addEventListener('change', actualizar);
    if (checkStock) checkStock.addEventListener('change', actualizar);

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function () {
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
    const qtyInput = document.getElementById('qty-' + index);
    const qty = parseInt(qtyInput ? qtyInput.value : 1);

    const manifiesto = obtenerStorage('skyops_manifiesto');

    // Buscamos si el componente ya estaba en el manifiesto
    let posicion = -1;
    for (let i = 0; i < manifiesto.length; i++) {
        if (manifiesto[i].guia === item.pn) {
            posicion = i;
        }
    }

    if (posicion !== -1) {
        let nuevaCantidad = (parseInt(manifiesto[posicion].cantidad) || 1) + qty;
        if (nuevaCantidad > item.stock) {
            nuevaCantidad = item.stock;
        }
        manifiesto[posicion].cantidad = nuevaCantidad;
    } else {
        manifiesto.push({
            guia: item.pn,
            nombre: item.nombre,
            sn: item.sn,
            ata: item.ata,
            bodega: item.bodega,
            cantidad: qty,
            stockMax: item.stock,
            destino: item.nombre + ' - ' + item.bodega
        });
    }

    guardarStorage('skyops_manifiesto', manifiesto);
    alert('Componente ' + item.pn + ' agregado al Manifiesto (Work Order).');
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
