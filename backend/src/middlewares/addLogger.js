"use strict";
import moment from "moment-timezone";
import logger from "../utils/logger.js"

const addLogger = (req, _res, next) => {
    req.infoPeticion = `${moment.tz('America/Argentina/Buenos_Aires')} | Petición a la ruta '${req.url}' | Método ${req.method}` // Defino esta propiedad y la de abajo para usarlos en cualquier otro request
    req.logger = logger; // Agrego la configuracion del logger al req
    req.logger.info(`${req.infoPeticion}`) // Se muestra este mensaje en la consola con el método "info" cada vez que se visita una ruta
    next()
}

export default addLogger
