export class ChoferModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll(idPrecioPorKm, page = 1, limit = 10, ignoreLimit = 'false') {
        if (ignoreLimit === 'true') {
            const [result] = await this.connection.query(`
                SELECT c.*, l.tipo, l.fechaEmision,
                COALESCE(SUM(v.kms), 0) AS kilometrosRecorridos
                FROM choferes AS c
                JOIN licencias AS l ON c.idLicencia = l.id
                LEFT JOIN viajes AS v ON c.id = v.chofer_id AND v.precio_por_km_id = ?
                GROUP BY c.id, l.id
            `, [idPrecioPorKm]);
            return {
                data: result,
                totalPages: 1
            };
        }

        const offset = (page - 1) * limit;

        const [[{ totalCount }]] = await this.connection.query(`
            SELECT COUNT(*) AS totalCount
            FROM choferes
        `);

        const [result] = await this.connection.query(`
            SELECT c.*, l.tipo, l.fechaEmision,
            COALESCE(SUM(v.kms), 0) AS kilometrosRecorridos
            FROM choferes AS c
            JOIN licencias AS l ON c.idLicencia = l.id
            LEFT JOIN viajes AS v ON c.id = v.chofer_id AND v.precio_por_km_id = ?
            GROUP BY c.id, l.id
            LIMIT ? OFFSET ?
        `, [idPrecioPorKm, limit, offset]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: result,
            totalPages
        };
    }

    async getById(id) {
        const [ result ] = await this.connection.query('SELECT * FROM choferes WHERE id = ?', [id]);
        return result
    }

    async create(chofer, limit = 10) {
        const [ resultInsert ] = await this.connection.query(`
            INSERT INTO licencias (tipo, fechaEmision)
            VALUES (?, ?)`, [chofer.tipoLicencia, chofer.fechaEmision]);

        const [ result ] = await this.connection.query(`
            INSERT INTO choferes (nombre, apellido, dni, idLicencia)
            VALUES (?, ?, ?, ?)`, [chofer.nombre, chofer.apellido, chofer.dni, resultInsert.insertId]);
        const newId = result.insertId;

        const [[{ totalCount }]] = await this.connection.query(`
            SELECT COUNT(*) AS totalCount
            FROM choferes
        `);
        const totalPages = Math.ceil(totalCount / limit);
        return {
            newId,
            totalPages
        };
    }

    async deleteById(id, limit = 10) {
        const [ resultSelect ] = await this.connection.query('SELECT * FROM choferes WHERE id = ?', [id]);

        await this.connection.query('DELETE FROM choferes WHERE id = ?', [id]);

        if (resultSelect[0]) { // También se elimina su licencia
            await this.connection.query('DELETE FROM licencias WHERE id = ?', [resultSelect[0].idLicencia]);
        }

        const [[{ totalCount }]] = await this.connection.query(`
            SELECT COUNT(*) AS totalCount
            FROM choferes
        `);
        return Math.ceil(totalCount / limit);
    }

    async renewLicence(id) {
        const [ resultSelect ] = await this.connection.query('SELECT * FROM choferes WHERE id = ?', [id]);

        const fechaActual = new Date().toISOString().slice(0, 10);

        await this.connection.query('UPDATE licencias SET fechaEmision = ? WHERE id = ?', [fechaActual, resultSelect[0].idLicencia]);
    }
}
