import { Router } from "express";
import { PrecioPorKmController } from "../controllers/precioPorKm.controllers.js";

export const createPrecioPorKmRouter = ({ PrecioPorKmModel }) => {
    const router = Router();

    const precioPorKmController = new PrecioPorKmController({ PrecioPorKmModel });

    router.get("/last", precioPorKmController.getLast);

    return router;
}
