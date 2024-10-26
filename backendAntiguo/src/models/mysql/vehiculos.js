export class VehiculoModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll(page = 1, limit = 10, ignoreLimit = 'false') {
        if (ignoreLimit === 'true') {
            const [ result ] = await this.connection.query(`
                SELECT v.*, m.nombre AS marca
                FROM vehiculos AS v
                JOIN marcas AS m ON v.marca_id = m.id
                ORDER BY v.id
                `
            );
            return {
                data: result,
                totalPages: 1
            };
        }

        const offset = (page - 1) * limit;

        const [[{ totalCount }]] = await this.connection.query(`
            SELECT COUNT(*) AS totalCount
            FROM vehiculos
        `);

        const [ result ] = await this.connection.query(`
            SELECT v.*, m.nombre AS marca
            FROM vehiculos AS v
            JOIN marcas AS m ON v.marca_id = m.id
            ORDER BY v.id
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: result,
            totalPages
        };
    }

    async create(vehiculo, limit = 10) {
        const [ marca ] = await this.connection.query('SELECT id FROM marcas WHERE nombre = ?', [vehiculo.marca]);
        const marcaId = marca[0].id;

        const [ result ] = await this.connection.query('INSERT INTO vehiculos (dominio, modelo, kmParciales, kmTotales, marca_id) VALUES (?, ?, ?, ?, ?)', [vehiculo.dominio, vehiculo.modelo, vehiculo.kmParciales, vehiculo.kmParciales, marcaId]);
        const newId = result.insertId;

        const [[{ totalCount }]] = await this.connection.query(`
            SELECT COUNT(*) AS totalCount
            FROM vehiculos
        `);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            newId,
            totalPages
        };
    }

    async deleteById(id, limit = 10) {
        await this.connection.query('DELETE FROM vehiculos WHERE id = ?', [id]);

        const [[{ totalCount }]] = await this.connection.query(`
            SELECT COUNT(*) AS totalCount
            FROM vehiculos
        `);
        return Math.ceil(totalCount / limit);
    }

    async resetKm(id) {
        await this.connection.query(`
            UPDATE vehiculos
            SET kmParciales = 0
            WHERE id = ?
        `, [id]);
    }
}
