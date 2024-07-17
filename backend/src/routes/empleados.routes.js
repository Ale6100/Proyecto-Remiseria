import { Router } from "express";
import empleadosControllers from "../controllers/empleados.controllers.js";

const router = Router();

router.get("/", empleadosControllers.getAll);

export default router;
