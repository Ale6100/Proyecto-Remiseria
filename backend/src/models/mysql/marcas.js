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

export class MarcaModel {
    static async getAll() {
        const [ result ] = await connection.query('SELECT * FROM marcas');
        return result;
    }

    static async create(marca) {
        await connection.query('INSERT INTO marcas (nombre) VALUES (?)', [marca.nombre]);
    }

    static async deleteById(id) {
        await connection.query('DELETE FROM marcas WHERE id = ?', [id]);
    }
}
