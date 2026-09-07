function obtenerStorage(clave) {
    let datos = JSON.parse(localStorage.getItem(clave));
    
    if (!datos || datos.length === 0) {
        if (clave === 'skyops_catalogo') {
            datos = [
                { nombre: 'Actuador de Superficie de Control', pn: 'PN-27-6612', sn: 'SN-34410', bodega: 'Bodega ANF - A03', ata: 'ESTRUCTURAS - ATA 27', stock: 4 },
                { nombre: 'Actuador de Tren Principal', pn: 'PN-32-4471', sn: 'SN-88213', bodega: 'Bodega SCL - A17', ata: 'TREN DE ATERRIZAJE - ATA 32', stock: 1 },
                { nombre: 'Álabe de Turbina (Fan Blade)', pn: 'PN-72-7754', sn: 'SN-40213', bodega: 'Bodega ANF - D11', ata: 'MOTORES - ATA 72', stock: 2 }
            ];
            guardarStorage(clave, datos);
        }
        
        if (clave === 'skyops_bitacora') {
            datos = [
                { folio: 'AOG-8004', matricula: 'CC-AZS', destino: 'Hangar 2', responsable: 'Fernanda Rojas', fecha: '2026-08-27 16:55', respuesta: '78 s', estado: 'COMPLETADO', origen: 'HISTÓRICO' },
                { folio: 'AOG-8006', matricula: 'CC-DBA', destino: 'Puerta 9', responsable: 'Fernanda Rojas', fecha: '2026-08-27 12:30', respuesta: '74 s', estado: 'EN CURSO', origen: 'HISTÓRICO' },
                { folio: 'AOG-8003', matricula: 'CC-BFA', destino: 'Puerta 14', responsable: 'Diego Salinas', fecha: '2026-08-26 09:48', respuesta: '91 s', estado: 'COMPLETADO', origen: 'HISTÓRICO' },
                { folio: 'AOG-8002', matricula: 'CC-DBC', destino: 'Puerta 22', responsable: 'Fernanda Rojas', fecha: '2026-08-25 14:19', respuesta: '65 s', estado: 'COMPLETADO', origen: 'HISTÓRICO' },
                { folio: 'AOG-8001', matricula: 'CC-AZS', destino: 'Hangar 2', responsable: 'Diego Salinas', fecha: '2026-08-24 18:22', respuesta: '78 s', estado: 'COMPLETADO', origen: 'HISTÓRICO' },
                { folio: 'AOG-8005', matricula: 'CC-RFA', destino: 'Puerta 14', responsable: 'Diego Salinas', fecha: '2026-08-24 09:20', respuesta: '82 s', estado: 'EN CURSO', origen: 'HISTÓRICO' }
            ];
            guardarStorage(clave, datos);
        }

        if (clave === 'skyops_manifiesto') {
            datos = [];
            guardarStorage(clave, datos);
        }
    }

    return datos || [];
}

function guardarStorage(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}