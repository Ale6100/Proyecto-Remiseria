export class PrecioPorKmModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getLast() {
        const [ result ] = await this.connection.query(`
            SELECT *
            FROM historial_precio_por_km
            ORDER BY anio DESC, mes DESC
            LIMIT 1
        `);

        return result[0];
    }
}
