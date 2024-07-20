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

        let marcaId = null;
        if (!marca[0]) {
            const [ resultInsert ] = await connection.query('INSERT INTO marcas (nombre) VALUES (?)', [vehiculo.marca]);
            marcaId = resultInsert.insertId;
        } else {
            marcaId = marca[0].id;
        }
        await connection.query('INSERT INTO vehiculos (dominio, modelo, km_parciales, km_totales, marca_id) VALUES (?, ?, ?, ?, ?)', [vehiculo.dominio, vehiculo.modelo, vehiculo.kmParciales, vehiculo.kmTotales, marcaId]);
    }

    static async deleteById(id) {
        const [ resultSelect ] = await connection.query('SELECT * FROM vehiculos WHERE id = ?', [id]);

        await connection.query('DELETE FROM vehiculos WHERE id = ?', [id]);

        if (resultSelect[0]) {
            const [ resultVehiculos ] = await connection.query('SELECT * FROM vehiculos WHERE marca_id = ?', [resultSelect[0].marca_id]);

            if (!resultVehiculos[0]) { // Si no hay más vehículos con esa marca, se elimina la marca
                await connection.query('DELETE FROM marcas WHERE id = ?', [resultSelect[0].marca_id]);
            }
        }
    }
}
