import VehiculoDto from "../dto/vehiculo.dto.js";

export class VehiculoController {
    constructor({ VehiculoModel }) {
        this.vehiculoModel = VehiculoModel;
    }

    getAll = async(req, res) => {
        try {
            let { page, limit } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);

            const badRequestError = VehiculoDto.badRequestGetAll({ page, limit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const result = await this.vehiculoModel.getAll(page, limit);
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    create = async(req, res) => {
        try {
            const { dominio, modelo, kmParciales, marca } = req.body;
            let { limit } = req.query;
            limit = parseInt(limit);

            const badRequestError = VehiculoDto.badRequestCreate({ dominio, modelo, kmParciales, marca, limit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const vehiculoDTO = VehiculoDto.create(req.body);

            const result = await this.vehiculoModel.create(vehiculoDTO);

            res.status(200).json({ statusCode: 200, message: 'Vehículo creado correctamente', payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    deleteById = async(req, res) => {
        try {
            const { id } = req.params;
            let { limit } = req.query;
            limit = parseInt(limit);

            const badRequestError = VehiculoDto.badRequestDelete({ id, limit });

            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const totalPages = await this.vehiculoModel.deleteById(id);

            res.status(200).json({ statusCode: 200, message: 'Vehículo eliminado correctamente', payload: totalPages } )
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
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
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
