export class VehiculoModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [ result ] = await this.connection.query('SELECT * FROM vehiculos LIMIT ? OFFSET ?', [limit, offset]);
        return result
    }

    async create(vehiculo) {
        const [ marca ] = await this.connection.query('SELECT id FROM marcas WHERE nombre = ?', [vehiculo.marca]);

        const marcaId = marca[0].id;
        const [ result ] = await this.connection.query('INSERT INTO vehiculos (dominio, modelo, km_parciales, km_totales, marca_id) VALUES (?, ?, ?, ?, ?)', [vehiculo.dominio, vehiculo.modelo, vehiculo.kmParciales, 0, marcaId]);
        return result.insertId;
    }

    async deleteById(id) {
        await this.connection.query('DELETE FROM vehiculos WHERE id = ?', [id]);
    }
}
