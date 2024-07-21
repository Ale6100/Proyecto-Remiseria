export class MarcaModel {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll() {
        const [ result ] = await this.connection.query('SELECT * FROM marcas');
        return result;
    }

    async create(marca) {
        await this.connection.query('INSERT INTO marcas (nombre) VALUES (?)', [marca.nombre]);
    }

    async deleteById(id) {
        await this.connection.query('DELETE FROM marcas WHERE id = ?', [id]);
    }
}
