import moment from 'moment-timezone';

export default class ViajeDto {
    static create({ kms, chofer_id, vehiculo_id, precio_por_km_id }) {
        const fechaActual = moment.tz('America/Argentina/Buenos_Aires');
        const fecha = fechaActual.format('YYYY-MM-DD');
        const horas = fechaActual.hours();
        const minutos = fechaActual.minutes();

        return {
            fecha,
            horas,
            minutos,
            kms,
            chofer_id,
            vehiculo_id,
            precio_por_km_id
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

    static badRequestCreate({ kms, chofer_id, vehiculo_id, precio_por_km_id, limit }) {
        if ([kms, chofer_id, vehiculo_id, precio_por_km_id].some(value => value === undefined)) {
            return 'Los siguientes campos son requeridos: kms, chofer_id, vehiculo_id y precio_por_km_id';
        }

        if (typeof kms !== 'number' || typeof chofer_id !== 'number' || typeof vehiculo_id !== 'number' || typeof precio_por_km_id !== 'number') {
            return 'kms, chofer_id, vehiculo_id y precio_por_km_id deben ser números naturales';
        }

        if ([kms, chofer_id, vehiculo_id, precio_por_km_id].some(value => value <= 0)) {
            return 'kms, chofer_id, vehiculo_id y precio_por_km_id deben ser números naturales';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "limit" debe ser un número natural mayor a cero';
        }

        return '';
    }
}
