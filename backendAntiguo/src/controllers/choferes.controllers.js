"use strict";
import ChoferoDto from "../dto/chofer.dto.js";

export class ChoferController {
    constructor({ ChoferModel }) {
        this.choferModel = ChoferModel;
    }

    getAll = async(req, res) => {
        try {
            let { idPrecioPorKm, page, limit, ignoreLimit } = req.query;
            if (idPrecioPorKm !== undefined) idPrecioPorKm = parseInt(idPrecioPorKm);
            if (page !== undefined) page = parseInt(page);
            if (limit !== undefined) limit = parseInt(limit);

            const badRequestError = ChoferoDto.badRequestGetAll({ idPrecioPorKm, page, limit, ignoreLimit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const result = await this.choferModel.getAll(idPrecioPorKm, page, limit, ignoreLimit);
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.fatal(`${req.infoPeticion} | ${error.message}`)
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
            req.logger.fatal(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    create = async(req, res) => {
        try {
            const body = req.body;
            let { limit } = req.query;
            if (limit !== undefined) limit = parseInt(limit);

            const badRequestError = ChoferoDto.badRequestCreate({ ...body, limit: limit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const choferDTO = ChoferoDto.create(body);

            const result = await this.choferModel.create(choferDTO, limit);

            res.status(200).json({ statusCode: 200, message: 'Chofer creado correctamente', payload: result });
        } catch (error) {
            req.logger.fatal(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    deleteById = async(req, res) => {
        try {
            const { id } = req.params;
            let { limit } = req.query;
            if (limit !== undefined) limit = parseInt(limit);

            const badRequestError = ChoferoDto.badRequestDelete({ id, limit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const totalPages = await this.choferModel.deleteById(id);
            res.status(200).json({ statusCode: 200, message: 'Chofer eliminado correctamente', payload: totalPages});
        } catch (error) {
            if (error.message.includes('a foreign key constraint fails')) {
                req.logger.error(`${req.infoPeticion} | No se puede eliminar un chofer que tenga viajes asociados`)
                return res.status(400).json({ statusCode: 400, error: 'No se puede eliminar un chofer que tenga viajes asociados' });
            }
            req.logger.fatal(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    renewLicence = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de chofer para realizar la renovación de la licencia`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de chofer para realizar la renovación de la licencia' });
            }

            await this.choferModel.renewLicence(id);
            res.status(200).json({ statusCode: 200, message: 'Licencia renovada correctamente' });
        } catch (error) {
            req.logger.fatal(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
