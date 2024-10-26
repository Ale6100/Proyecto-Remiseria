import { Router } from "express";
import baseControllers from "../controllers/base.controllers.js";

const router = Router();

router.get("/", baseControllers.base)

export default router;
