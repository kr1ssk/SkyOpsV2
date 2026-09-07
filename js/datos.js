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
                { folio: 'AOG-8004', matricula: 'CC-AZS', destino: 'Hangar 2', responsable: 'Fernanda Rojas', fecha: '2026-08-27 16:55', respuesta: '78 s', estado: 'COMPLETADO', origen: 'HISTÓRICO' }
            ];
            guardarStorage(clave, datos);
        }

        if (clave === 'skyops_flota') {
            datos = [
                { matricula: 'CC-BFA', modelo: 'Airbus A320neo', aerolinea: 'LATAM Airlines', aeropuerto: 'SCL', ubicacion: 'Puerta 14', aog: true },
                { matricula: 'CC-AVE', modelo: 'Airbus A321', aerolinea: 'LATAM Airlines', aeropuerto: 'SCL', ubicacion: 'Plataforma Remota 3', aog: false },
                { matricula: 'CC-AZS', modelo: 'Boeing 737-800', aerolinea: 'Sky Airline', aeropuerto: 'ANF', ubicacion: 'Hangar 2', aog: true },
                { matricula: 'CC-DBC', modelo: 'Airbus A320', aerolinea: 'JetSMART', aeropuerto: 'SCL', ubicacion: 'Puerta 22', aog: false },
                { matricula: 'CC-BHB', modelo: 'Boeing 737 MAX 8', aerolinea: 'Sky Airline', aeropuerto: 'PMC', ubicacion: 'Plataforma Remota 1', aog: false },
                { matricula: 'CC-AWX', modelo: 'Airbus A321neo', aerolinea: 'LATAM Airlines', aeropuerto: 'CCP', ubicacion: 'Hangar 1', aog: true },
                { matricula: 'CC-DGA', modelo: 'Airbus A320', aerolinea: 'JetSMART', aeropuerto: 'SCL', ubicacion: 'Puerta 9', aog: false },
                { matricula: 'CC-BGO', modelo: 'Boeing 787-9', aerolinea: 'LATAM Airlines', aeropuerto: 'SCL', ubicacion: 'Puerta 31 (Internacional)', aog: false }
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