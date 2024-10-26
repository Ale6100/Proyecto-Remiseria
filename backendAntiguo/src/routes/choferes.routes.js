import { Router } from "express";
import { ChoferController } from "../controllers/choferes.controllers.js";

export const createChoferesRouter = ({ ChoferModel }) => {
    const router = Router();

    const choferController = new ChoferController({ ChoferModel });

    router.get("/", choferController.getAll);

    router.get("/:id", choferController.getById);

    router.post("/", choferController.create);

    router.delete("/:id", choferController.deleteById);

    router.put("/renewLicence/:id", choferController.renewLicence);

    return router;
}
