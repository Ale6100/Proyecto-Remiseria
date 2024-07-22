export class ChoferModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll(page = 1, limit = 10, ignoreLimit = 'false') {
        if (ignoreLimit === 'true') {
            const [ result ] = await this.connection.query('SELECT c.*, l.tipo, l.fechaEmision FROM choferes AS c JOIN licencias AS l ON c.idLicencia = l.id');
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

        const [ result ] = await this.connection.query(`
            SELECT c.*, l.tipo, l.fechaEmision
            FROM choferes AS c
            JOIN licencias AS l ON c.idLicencia = l.id
            LIMIT ? OFFSET ?
        `, [limit, offset]);

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

    async deleteById(id) {
        const [ resultSelect ] = await this.connection.query('SELECT * FROM choferes WHERE id = ?', [id]);

        await this.connection.query('DELETE FROM choferes WHERE id = ?', [id]);

        if (resultSelect[0]) { // También se elimina su licencia
            await this.connection.query('DELETE FROM licencias WHERE id = ?', [resultSelect[0].idLicencia]);
        }
    }
}
