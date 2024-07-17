"use strict";
// import { EmpleadoModel } from "../models/database/empleado.js";

const getAll = async (_req, res) => {
  res.status(200).json({ message: `Obtener empleados` });
}

export default {
  getAll
}
