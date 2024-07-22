import MarcaDto from '../dto/marca.dto.js';

export class MarcaController {
    constructor({ MarcaModel }) {
        this.marcaModel = MarcaModel;
    }

    getAll = async(req, res) => {
        try {
            const result = await this.marcaModel.getAll();
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    create = async(req, res) => {
        try {
            const { nombre } = req.body;

            const badRequestError = MarcaDto.badRequestCreate({ nombre });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const marcaDTO = MarcaDto.create(req.body);

            await this.marcaModel.create(marcaDTO);

            res.status(200).json({ statusCode: 200, message: 'Marca creada correctamente' });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    deleteById = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de marca para realizar la eliminación`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de marca para realizar la eliminación' });
            }

            await this.marcaModel.deleteById(id);

            res.status(200).json({ statusCode: 200, message: 'Marca eliminada correctamente' });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
