export class ChoferModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll() {
        const [ result ] = await this.connection.query('SELECT * FROM choferes');
        return result
    }

    async getById(id) {
        const [ result ] = await this.connection.query('SELECT * FROM choferes WHERE id = ?', [id]);
        return result
    }

    async create(chofer) {
        const [ resultInsert ] = await this.connection.query(`
            INSERT INTO licencias (tipo, fechaVencimiento)
            VALUES (?, ?)`, [chofer.tipoLicencia, chofer.fechaVencimiento]);

        await this.connection.query(`
            INSERT INTO choferes (nombre, apellido, dni, idLicencia)
            VALUES (?, ?, ?, ?)`, [chofer.nombre, chofer.apellido, chofer.dni, resultInsert.insertId]);
    }

    async deleteById(id) {
        const [ resultSelect ] = await this.connection.query('SELECT * FROM choferes WHERE id = ?', [id]);

        await this.connection.query('DELETE FROM choferes WHERE id = ?', [id]);

        if (resultSelect[0]) { // También se elimina su licencia
            await this.connection.query('DELETE FROM licencias WHERE id = ?', [resultSelect[0].idLicencia]);
        }
    }
}
