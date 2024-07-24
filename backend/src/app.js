"use strict";
import express from "express";
import logger from "./utils/logger.js";
import addLogger from "./middlewares/addLogger.js";
import baseRouter from "./routes/base.routes.js"
import { createChoferesRouter } from "./routes/choferes.routes.js"
import { createVehiculosRouter } from "./routes/vehiculos.routes.js"
import { createMarcasRouter } from "./routes/marcas.routes.js"
import { createViajesRouter } from "./routes/viajes.routes.js";
import { createPrecioPorKmRouter } from "./routes/precioPorKm.routes.js";
import config from "./config/config.js";
import { waitFor } from "./utils.js";
import cors from "cors";
import { ChoferModel } from "./models/mysql/chofer.js";
import { VehiculoModel } from "./models/mysql/vehiculos.js";
import { MarcaModel } from "./models/mysql/marcas.js";
import { ViajeModel } from "./models/mysql/viajes.js";
import { PrecioPorKmModel } from "./models/mysql/precioPorKm.js";
import connectDB from "./config/connectMySQL.js";
import validateToken from "./middlewares/validateToken.js";

const app = express();

const PORT = process.env["PORT"] ?? 8080; // Elige el puerto 8080 en caso de que no venga definido uno por defecto como variable de entorno

const server = app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${server.address().port}`)
});

server.on("error", async error => {
    await waitFor(750)
    logger.fatal(`${error}`);
    throw new Error(`${error}`)
})

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(cors({ origin: config.site.urlfrontend ? [config.site.urlfrontend] : [] }))

app.use(addLogger)
app.use(validateToken)

app.use("/", baseRouter)
app.use("/choferes", createChoferesRouter({ ChoferModel: new ChoferModel(connectDB) }))
app.use("/vehiculos", createVehiculosRouter({ VehiculoModel: new VehiculoModel(connectDB) }))
app.use("/marcas", createMarcasRouter({ MarcaModel: new MarcaModel(connectDB) }))
app.use("/viajes", createViajesRouter({ ViajeModel: new ViajeModel(connectDB) }))
app.use("/precioPorKm", createPrecioPorKmRouter({ PrecioPorKmModel: new PrecioPorKmModel(connectDB) }))
