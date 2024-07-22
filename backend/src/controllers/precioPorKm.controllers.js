import PrecioPorKmDto from "../dto/precioPorKm.dto.js";

export class PrecioPorKmController {
    constructor({ PrecioPorKmModel }) {
        this.precioPorKmModel = PrecioPorKmModel;
    }

    getLast = async(req, res) => {
        try {
            const result = await this.precioPorKmModel.getLast();
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    create = async(req, res) => {
        try {
            const badRequestError = PrecioPorKmDto.badRequestCreate(req.body);
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const precioPorKmDto = PrecioPorKmDto.create(req.body);

            const id = await this.precioPorKmModel.create(precioPorKmDto);
            res.status(200).json({ statusCode: 200, payload: { newId: id, dia: precioPorKmDto.dia, mes: precioPorKmDto.mes, anio: precioPorKmDto.anio } });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
