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

export class ChoferModel {
    static async getAll() {
        const [ result ] = await connection.query('SELECT * FROM choferes');
        return result
    }

    static async getById(id) {
        const [ result ] = await connection.query('SELECT * FROM choferes WHERE id = ?', [id]);
        return result
    }

    static async create(chofer) {
        const [ resultInsert ] = await connection.query(`
            INSERT INTO licencias (tipo, fechaVencimiento)
            VALUES (?, ?)`, [chofer.tipoLicencia, chofer.fechaVencimiento]);

        await connection.query(`
            INSERT INTO choferes (nombre, apellido, dni, idLicencia)
            VALUES (?, ?, ?, ?)`, [chofer.nombre, chofer.apellido, chofer.dni, resultInsert.insertId]);
    }

    static async deleteById(id) {
        const [ resultSelect ] = await connection.query('SELECT * FROM choferes WHERE id = ?', [id]);

        await connection.query('DELETE FROM choferes WHERE id = ?', [id]);

        if (resultSelect[0]) { // También se elimina su licencia
            await connection.query('DELETE FROM licencias WHERE id = ?', [resultSelect[0].idLicencia]);
        }
    }
}
