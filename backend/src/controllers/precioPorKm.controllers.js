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
}
