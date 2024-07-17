"use strict";
import winston from "winston";
import __dirname from "../utils.js"

const customLevelsConfig = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
}

export default winston.createLogger({
    levels: customLevelsConfig,
    transports: [
        new winston.transports.Console({ // Especifico que uno de los medios para crear logs será la consola
            level: "info" // Nivel de prioridad minímo en el cual se va a utilizar este transporte
        }),

        new winston.transports.File({ // Otro medio para guardar logs será en archivos
            level: "warn",
            filename: `${__dirname}/info/warn.log`
        }),

        new winston.transports.File({
            level: "error",
            filename: `${__dirname}/info/error.log`
        }),

        new winston.transports.File({
            level: "fatal",
            filename: `${__dirname}/info/fatal.log`
        })
    ]
})
