export default class ChoferDto {
    static tipoLicenciaDTO = {
        "1": 'profesionales',
        "2": 'particulares'
    };

    static create({ nombre, apellido, dni, tipoLicencia, fechaEmision }) {
        return {
            nombre,
            apellido,
            dni,
            tipoLicencia,
            fechaEmision: fechaEmision.slice(0, 10)
        };
    }

    static badRequestGetAll({ idPrecioPorKm, page, limit, ignoreLimit }) {
        if (!(typeof idPrecioPorKm === 'number' && Number.isInteger(idPrecioPorKm) && idPrecioPorKm > 0)) {
            return 'El parámetro "idPrecioPorKm" debe ser un número natural';
        }

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

    static badRequestCreate({ nombre, apellido, dni, tipoLicencia, fechaEmision, limit }) {
        if ([nombre, apellido, dni, tipoLicencia, fechaEmision].some(value => value === undefined) ) {
            return 'Los siguientes campos son requeridos: nombre, apellido, dni, tipoLicencia y fechaEmision';
        }

        if (typeof nombre !== 'string' || typeof apellido !== 'string' || typeof dni !== 'string' || typeof tipoLicencia !== 'string') {
            return 'Nombre, apellido, DNI y tipoLicencia deben ser cadenas de texto';
        }

        if (nombre.length > 45 || apellido.length > 45 || dni.length > 9) {
            return 'Nombre, apellido y DNI deben tener una longitud máxima de 45, 45 y 9 caracteres respectivamente';
        }

        if (tipoLicencia !== this.tipoLicenciaDTO["1"] && tipoLicencia !== this.tipoLicenciaDTO["2"]) {
            return 'Tipo de licencia inválida. Los valores permitidos son "profesionales" y "particulares"';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "limit" debe ser un número natural mayor a cero';
        }

        return '';
    }

    static badRequestDelete({ id, limit }) {
        if (id === undefined) {
            return 'Se requiere un ID de chofer para realizar la eliminación';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "limit" debe ser un número natural';
        }

        return '';
    }
}
