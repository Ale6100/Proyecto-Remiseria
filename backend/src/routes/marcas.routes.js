import { Router } from "express";
import { MarcaController } from "../controllers/marcas.controller.js";

export const createMarcasRouter = ({ MarcaModel }) => {
    const router = Router();

    const marcaController = new MarcaController({ MarcaModel });

    router.get("/", marcaController.getAll);

    router.post("/", marcaController.create);

    router.delete("/:id", marcaController.deleteById);

    return router;
}
