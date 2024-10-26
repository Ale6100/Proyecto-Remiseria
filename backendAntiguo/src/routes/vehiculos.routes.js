import { Router } from "express";
import { VehiculoController } from "../controllers/vehiculos.controllers.js";

export const createVehiculosRouter = ({ VehiculoModel }) => {
    const router = Router();

    const vehiculoController = new VehiculoController({ VehiculoModel });

    router.get("/", vehiculoController.getAll);

    router.post("/", vehiculoController.create);

    router.delete("/:id", vehiculoController.deleteById);

    router.put("/resetKm/:id", vehiculoController.resetKm);

    return router;
}
