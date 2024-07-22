import ViajeDto from "../dto/viaje.dto.js";

export class ViajeController {
    constructor({ ViajeModel }) {
        this.viajeModel = ViajeModel;
    }

    getAll = async(req, res) => {
        try {
            let { page, limit } = req.query;
            if (page !== undefined) page = parseInt(page);
            if (limit !== undefined) limit = parseInt(limit);

            const badRequestError = ViajeDto.badRequestGetAll({ page, limit });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const result = await this.viajeModel.getAll(page, limit);
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
