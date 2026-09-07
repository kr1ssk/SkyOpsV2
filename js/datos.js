function obtenerStorage(clave) {
    let datos = JSON.parse(localStorage.getItem(clave));
    
    if (!datos && clave === 'skyops_catalogo') {
        datos = [
            { nombre: 'Actuador de Superficie de Control', pn: 'PN-27-6612', sn: 'SN-34410', bodega: 'Bodega ANF - A03', ata: 'ESTRUCTURAS - ATA 27', stock: 4 },
            { nombre: 'Actuador de Tren Principal', pn: 'PN-32-4471', sn: 'SN-88213', bodega: 'Bodega SCL - A17', ata: 'TREN DE ATERRIZAJE - ATA 32', stock: 1 },
            { nombre: 'Álabe de Turbina (Fan Blade)', pn: 'PN-72-7754', sn: 'SN-40213', bodega: 'Bodega ANF - D11', ata: 'MOTORES - ATA 72', stock: 2 }
        ];
        guardarStorage(clave, datos);
    }
    
    if (!datos && clave === 'skyops_bitacora') {
        datos = [
            { matricula: 'CC-AXP', falla: 'Falla crítica de presión en sistema hidráulico izquierdo - Aeronave detenida en plataforma principal.' }
        ];
        guardarStorage(clave, datos);
    }

    if (!datos && clave === 'skyops_manifiesto') {
        datos = [];
        guardarStorage(clave, datos);
    }

    return datos || [];
}

function guardarStorage(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}