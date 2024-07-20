"use strict";
import ChoferoDto from "../dto/chofer.dto.js";

export class ChoferController {
    constructor({ ChoferModel }) {
        this.choferModel = ChoferModel;
    }

    getAll = async(req, res) => {
        try {
            const result = await this.choferModel.getAll();
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    getById = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de chofer para realizar la búsqueda`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de chofer para realizar la búsqueda' });
            }

            const result = await this.choferModel.getById(id);
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    create = async(req, res) => {
        try {
            const { nombre, apellido, dni, tipoLicencia, fechaVencimiento } = req.body;

            const badRequestError = ChoferoDto.badRequestCreate({ nombre, apellido, dni, tipoLicencia, fechaVencimiento });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const choferDTO = ChoferoDto.create(req.body);

            await this.choferModel.create(choferDTO);

            res.status(200).json({ statusCode: 200, message: 'Chofer creado correctamente' });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    deleteById = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de chofer para realizar la eliminación`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de chofer para realizar la eliminación' });
            }

            await this.choferModel.deleteById(id);
            res.status(200).json({ statusCode: 200, message: 'Chofer eliminado correctamente' });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
