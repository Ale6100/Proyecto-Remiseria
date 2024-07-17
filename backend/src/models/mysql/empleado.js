import mysql from 'mysql2/promise';
import configEnv from '../../config/config.js';

const { host, user, port, password, database } = configEnv.mysql;

const config = {
    host,
    user,
    port,
    password,
    database
}

const connection = await mysql.createConnection(config);

export class EmpleadoModel {
    static async getAll() {
        const [ result ] = await connection.query('SELECT * FROM empleados');
        return result
    }

    static async getById(id) {
        const [ result ] = await connection.query('SELECT * FROM empleados WHERE id = ?', [id]);
        return result
    }

    static async create(empleado) {
        const [ resultInsert ] = await connection.query(`
            INSERT INTO licencias (tipo, fechaVencimiento)
            VALUES (?, ?)`, [empleado.tipoLicencia, empleado.fechaVencimiento]);

        await connection.query(`
            INSERT INTO empleados (nombre, apellido, dni, idLicencia)
            VALUES (?, ?, ?, ?)`, [empleado.nombre, empleado.apellido, empleado.dni, resultInsert.insertId]);
    }

    static async deleteById(id) {
        const [ resultSelect ] = await connection.query('SELECT * FROM empleados WHERE id = ?', [id]);

        await connection.query('DELETE FROM empleados WHERE id = ?', [id]);

        if (resultSelect[0]) { // También se elimina su licencia
            await connection.query('DELETE FROM licencias WHERE id = ?', [resultSelect[0].idLicencia]);
        }
    }
}

