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

export class VehiculoModel {
    static async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [ result ] = await connection.query('SELECT * FROM vehiculos LIMIT ? OFFSET ?', [limit, offset]);
        return result
    }

    static async create(vehiculo) {
        const [ marca ] = await connection.query('SELECT id FROM marcas WHERE nombre = ?', [vehiculo.marca]);

        const marcaId = marca[0].id;
        const [ result ] = await connection.query('INSERT INTO vehiculos (dominio, modelo, km_parciales, km_totales, marca_id) VALUES (?, ?, ?, ?, ?)', [vehiculo.dominio, vehiculo.modelo, vehiculo.kmParciales, 0, marcaId]);
        return result.insertId;
    }

    static async deleteById(id) {
        await connection.query('DELETE FROM vehiculos WHERE id = ?', [id]);
    }
}
