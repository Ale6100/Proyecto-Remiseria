"use strict";
import dotenv from "dotenv"
import logger from "../utils/logger.js";
import { waitFor } from "../utils.js";

dotenv.config(); // Copia todas las igualdades que estén en el archivo ".env" y las convierte a propiedades del process.env (es decir, inicializa todas las variables de entorno que defina allí)

// Por seguridad al archivo .env no lo dejo como público, puedes hacerte el tuyo a la altura de la carpeta src

const retornarSiExiste = async (variable) => { // Comprueba la existencia de variables de entorno
    const v = process.env[variable]

    if (v !== undefined) {
        return v
    } else {
        logger.fatal(`Error: La variable de entorno ${variable} no está definida`)
        await waitFor(750)
        throw new Error(`Error: La variable de entorno ${variable} no está definida`);
    }
}

export default { // Exporto un objeto que incluye de manera ordenada las variables de entorno recién mencionadas
    site: {
        urlfrontend: await retornarSiExiste("URL_FRONTEND"), // Sitio donde está ubicado nuestro frontend
        accessToken: await retornarSiExiste("ACCESS_TOKEN")
    }
}