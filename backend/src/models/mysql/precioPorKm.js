export class PrecioPorKmModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getLast() {
        const [ result ] = await this.connection.query(`
            SELECT *
            FROM historial_precio_por_km
            ORDER BY anio DESC, mes DESC, dia DESC, id DESC
            LIMIT 1
        `);

        return result[0];
    }

    async create({ precio_por_km, dia, mes, anio }) {
        const [ result ] = await this.connection.query(`
            INSERT INTO historial_precio_por_km (precio_por_km, dia, mes, anio)
            VALUES (?, ?, ?, ?)
        `, [ precio_por_km, dia, mes, anio ]);

        return result.insertId;
    }
}
