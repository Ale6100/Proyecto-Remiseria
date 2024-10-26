export default class VehiculoDto {
    static create({ dominio, modelo, kmParciales, kmTotales, marca }) {
        return {
            dominio,
            modelo,
            kmParciales,
            kmTotales,
            marca
        };
    }

    static badRequestGetAll({ page, limit, ignoreLimit }) {

        if (page !== undefined && !(typeof page === 'number' && Number.isInteger(page) && page >= 0)) {
            return 'El parámetro "page" debe ser un número natural o cero';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "page" debe ser un número natural';
        }

        if (ignoreLimit !== undefined && ignoreLimit !== 'true' && ignoreLimit !== 'false') {
            return 'ignoreLimit sólo puede ser true o false';
        }
        return '';
    }

    static badRequestCreate({ dominio, modelo, kmParciales, marca, limit }) {
        if ([dominio, modelo, kmParciales, marca].some(value => value === undefined)) {
            return 'Los siguientes campos son requeridos: dominio, modelo, kmParciales y marca';
        }

        if (typeof dominio !== 'string' || typeof modelo !== 'string' || typeof marca !== 'string') {
            return 'dominio, modelo y marca deben ser cadenas de texto';
        }

        if (dominio.length > 20 || modelo.length > 50 || marca.length > 50) {
            return 'dominio, modelo y marca deben tener una longitud máxima de 20, 20 y 50 caracteres respectivamente';
        }

        if (typeof kmParciales !== 'number' || kmParciales < 0 || kmParciales >= 1000000) {
            return 'kmParciales deben ser un número entero menor a 1000000';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "limit" debe ser un número natural mayor a cero';
        }

        return '';
    }

    static badRequestDelete({ id, limit }) {
        if (id === undefined) {
            return 'Se requiere un ID de vehículo para realizar la eliminación';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "limit" debe ser un número natural';
        }

        return '';
    }
}
