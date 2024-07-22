export class ViajeModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const [[{ totalCount }]] = await this.connection.query(`
            SELECT COUNT(*) AS totalCount
            FROM viajes
        `);

        const [result] = await this.connection.query(`
            SELECT
                vi.*,
                c.nombre,
                c.apellido,
                ve.dominio,
                m.nombre AS marca
            FROM
                viajes AS vi
                JOIN choferes AS c ON vi.chofer_id = c.id
                JOIN vehiculos AS ve ON vi.vehiculo_id = ve.id
                JOIN marcas AS m ON ve.marca_id = m.id
            ORDER BY
                vi.fecha
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: result,
            totalPages
        };
    }
}
