import { Router } from "express";
import { ViajeController } from "../controllers/viajes.controllers.js";

export const createViajesRouter = ({ ViajeModel }) => {
    const router = Router();

    const viajeController = new ViajeController({ ViajeModel });

    router.get("/", viajeController.getAll);

    router.post("/", viajeController.create);

    // router.delete("/:id", viajeController.deleteById);

    // router.put("/:id", viajeController.updateById);

    return router;
}
