// Version de los datos de ejemplo.
// El navegador guarda el catalogo en localStorage la primera vez que entras.
// Si despues cambiamos los datos de aqui abajo, el navegador seguiria usando
// los viejos porque ya los tenia guardados. Por eso llevamos un numero de
// version: si no coincide, se borra lo guardado y se cargan los datos nuevos.
const VERSION_DATOS = 3;
let versionRevisada = false;

function revisarVersionDatos() {
    if (versionRevisada) return;
    versionRevisada = true;

    const guardada = localStorage.getItem('skyops_version');

    if (guardada !== String(VERSION_DATOS)) {
        // El catalogo y la flota son datos de referencia: se recargan.
        // La bitacora y el manifiesto NO se tocan porque son del usuario.
        localStorage.removeItem('skyops_catalogo');
        localStorage.removeItem('skyops_flota');
        localStorage.setItem('skyops_version', String(VERSION_DATOS));
    }
}

function obtenerStorage(clave) {
    revisarVersionDatos();

    let datos = JSON.parse(localStorage.getItem(clave));
    
    if (!datos || datos.length === 0) {
        if (clave === 'skyops_catalogo') {
            datos = [
                { 
                    nombre: 'Actuador de Superficie de Control', 
                    pn: 'PN-27-6612', 
                    sn: 'SN-34410', 
                    bodega: 'Bodega ANF - A03', 
                    ata: 'ESTRUCTURAS - ATA 27', 
                    stock: 4, 
                    certificado: true, 
                    imagen: 'assets/img/actuador-superficie.svg' 
                },
                { 
                    nombre: 'Actuador de Tren Principal', 
                    pn: 'PN-32-4471', 
                    sn: 'SN-88213', 
                    bodega: 'Bodega SCL - A17', 
                    ata: 'TREN DE ATERRIZAJE - ATA 32', 
                    stock: 1, 
                    certificado: true, 
                    imagen: 'assets/img/actuador-tren.svg' 
                },
                { 
                    nombre: 'Álabe de Turbina (Fan Blade)', 
                    pn: 'PN-72-7754', 
                    sn: 'SN-40213', 
                    bodega: 'Bodega ANF - D11', 
                    ata: 'MOTORES - ATA 72', 
                    stock: 2, 
                    certificado: false, 
                    imagen: 'assets/img/alabe-turbina.svg' 
                }
            ];
            guardarStorage(clave, datos);
        }
        
        if (clave === 'skyops_bitacora') {
            datos = [
                { folio: 'AOG-8004', matricula: 'CC-AZS', destino: 'Hangar 2', responsable: 'Fernanda Rojas', fecha: '2026-08-27 16:55', respuesta: '78 s', estado: 'COMPLETADO', origen: 'HISTÓRICO' },
                { folio: 'AOG-8006', matricula: 'CC-DGA', destino: 'Puerta 9', responsable: 'Fernanda Rojas', fecha: '2026-08-27 12:30', respuesta: '74 s', estado: 'EN CURSO', origen: 'HISTÓRICO' }
            ];
            guardarStorage(clave, datos);
        }

        if (clave === 'skyops_flota') {
            datos = [
                { matricula: 'CC-BFA', modelo: 'Airbus A320neo', aerolinea: 'LATAM Airlines', aeropuerto: 'SCL', ubicacion: 'Puerta 14', aog: true },
                { matricula: 'CC-AVE', modelo: 'Airbus A321', aerolinea: 'LATAM Airlines', aeropuerto: 'SCL', ubicacion: 'Plataforma Remota 3', aog: false },
                { matricula: 'CC-AZS', modelo: 'Boeing 737-800', aerolinea: 'Sky Airline', aeropuerto: 'ANF', ubicacion: 'Hangar 2', aog: true },
                { matricula: 'CC-DBC', modelo: 'Airbus A320', aerolinea: 'JetSMART', aeropuerto: 'SCL', ubicacion: 'Puerta 22', aog: false }
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