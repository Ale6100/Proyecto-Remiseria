"use strict";
import EmpleadoDto from "../dto/empleado.dto.js";

export class EmpleadoController {
    constructor({ EmpleadoModel }) {
        this.empleadoModel = EmpleadoModel;
    }

    getAll = async(req, res) => {
        try {
            const result = await this.empleadoModel.getAll();
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    getById = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de empleado para realizar la búsqueda`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de empleado para realizar la búsqueda' });
            }

            const result = await this.empleadoModel.getById(id);
            res.status(200).json({ statusCode: 200, payload: result });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    create = async(req, res) => {
        try {
            const { nombre, apellido, dni, tipoLicencia, fechaVencimiento } = req.body;

            const badRequestError = EmpleadoDto.badRequestCreate({ nombre, apellido, dni, tipoLicencia, fechaVencimiento });
            if (badRequestError) {
                req.logger.error(`${req.infoPeticion} | ${badRequestError}`)
                return res.status(400).json({ statusCode: 400, error: badRequestError });
            }

            const empleadoDTO = EmpleadoDto.create(req.body);

            await this.empleadoModel.create(empleadoDTO);

            res.status(200).json({ statusCode: 200, message: 'Empleado creado correctamente' });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }

    deleteById = async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                req.logger.error(`${req.infoPeticion} | Se requiere un ID de empleado para realizar la eliminación`)
                return res.status(400).json({ statusCode: 400, error: 'Se requiere un ID de empleado para realizar la eliminación' });
            }

            await this.empleadoModel.deleteById(id);
            res.status(200).json({ statusCode: 200, message: 'Empleado eliminado correctamente' });
        } catch (error) {
            req.logger.error(`${req.infoPeticion} | ${error.message}`)
            res.status(500).json({ statusCode: 500, error: error.message });
        }
    }
}
