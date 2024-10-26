import VehiculoDto from "../dto/vehiculo.dto.js";

export class VehiculoController {
    constructor({ VehiculoModel }) {
        this.vehiculoModel = VehiculoModel;
    }

    getAll = async(req, res) => {
        try {
            let { page, limit, ignoreLimit } = req.query;
            if (page !== undefined) page = parseInt(page);
            if (limit !== undefined) limit = parseInt(limit);

            const badRequestError = VehiculoDto.badRequestGetAll({ page, limit, ignoreLimit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const result = await this.vehiculoModel.getAll(page, limit, ignoreLimit);
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

            const badRequestError = VehiculoDto.badRequestCreate({ ...body, limit: limit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const vehiculoDTO = VehiculoDto.create(body);

            const result = await this.vehiculoModel.create(vehiculoDTO);

            res.status(200).json({ statusCode: 200, message: 'Vehículo creado correctamente', payload: result });
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

            const badRequestError = VehiculoDto.badRequestDelete({ id, limit });

            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const totalPages = await this.vehiculoModel.deleteById(id);

            res.status(200).json({ statusCode: 200, message: 'Vehículo eliminado correctamente', payload: totalPages } )
        } catch (error) {
            if (error.message.includes('a foreign key constraint fails')) {
                req.logger.error(`${req.infoPeticion} | No se puede eliminar un vehículo que tenga viajes asociados`)
                return res.status(400).json({ statusCode: 400, error: 'No se puede eliminar un vehículo que tenga viajes asociados' });
            }
            req.logger.fatal(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    resetKm = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de vehículo para realizar el reseteo del kilometraje`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de vehículo para realizar el reseteo del kilometraje`)' });
            }

            await this.vehiculoModel.resetKm(id);

            res.status(200).json({ statusCode: 200, message: 'Kilometraje reseteados correctamente' });
        } catch (error) {
            req.logger.fatal(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
