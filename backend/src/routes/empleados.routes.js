import { Router } from "express";
import { EmpleadoController } from "../controllers/empleados.controllers.js";

export const createEmpleadosRouter = ({ EmpleadoModel }) => {
    const router = Router();

    const empleadoController = new EmpleadoController({ EmpleadoModel });

    router.get("/", empleadoController.getAll);

    router.get("/:id", empleadoController.getById);

    router.post("/", empleadoController.create);

    router.delete("/:id", empleadoController.deleteById);

    return router;
}
