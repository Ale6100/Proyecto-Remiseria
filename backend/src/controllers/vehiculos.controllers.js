import VehiculoDto from "../dto/vehiculo.dto.js";

export class VehiculoController {
    constructor({ VehiculoModel }) {
        this.vehiculoModel = VehiculoModel;
    }

    getAll = async(req, res) => {
        try {
            const { page, limit } = req.query;

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

            const badRequestError = VehiculoDto.badRequestCreate({ dominio, modelo, kmParciales, marca });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const vehiculoDTO = VehiculoDto.create(req.body);

            const id = await this.vehiculoModel.create(vehiculoDTO);

            res.status(200).json({ statusCode: 200, message: 'Vehículo creado correctamente', payload: id });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    deleteById = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de vehículo para realizar la eliminación`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de vehículo para realizar la eliminación' });
            }

            await this.vehiculoModel.deleteById(id);

            res.status(200).json({ statusCode: 200, message: 'Vehículo eliminado correctamente' });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
