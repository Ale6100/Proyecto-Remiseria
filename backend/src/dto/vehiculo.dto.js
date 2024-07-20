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

    static badRequestGetAll({ page, limit }) {

        if (page !== undefined && !(typeof page === 'number' && Number.isInteger(page) && page >= 0)) {
            return 'El parámetro "page" debe ser un número natural o cero';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "page" debe ser un número natural';
        }
        return '';
    }

    static badRequestCreate({ dominio, modelo, kmParciales, kmTotales, marca }) {
        if ([dominio, modelo, kmParciales, kmTotales, marca].some(value => value === undefined)) {
            return 'Los siguientes campos son requeridos: dominio, modelo, kmParciales, kmTotales y marca';
        }

        if (typeof dominio !== 'string' || typeof modelo !== 'string' || typeof marca !== 'string') {
            return 'dominio, modelo y marca deben ser cadenas de texto';
        }

        if (dominio.length > 20 || modelo.length > 50 || marca.length >= 50) {
            return 'dominio, modelo y marca deben tener una longitud máxima de 20, 20 y 50 caracteres respectivamente';
        }

        if (typeof kmParciales !== 'number' || typeof kmTotales !== 'number') {
            return 'kmParciales y kmTotales deben ser números';
        }

        if (kmParciales < 0 || kmTotales < 0) {
            return 'kmParciales y kmTotales deben ser mayores o iguales a cero';
        }
        return '';
    }
}
