import moment from 'moment-timezone';

export default class PrecioPorKmDto {
    static create({ precio_por_km }) {
        const fechaActual = moment.tz('America/Argentina/Buenos_Aires');
        const dia = fechaActual.date();
        const mes = fechaActual.month() + 1;
        const anio = fechaActual.year();

        return {
            precio_por_km,
            dia,
            mes,
            anio
        };
    }

    static badRequestCreate({ precio_por_km }) {
        if (precio_por_km === undefined) return 'El precio por kilómetro es requerido';

        if (typeof precio_por_km !== 'number' || !Number.isInteger(precio_por_km) || precio_por_km <= 0 || precio_por_km >= 1000000) return 'El precio por kilómetro debe ser un número natural menor a 1000000';

        return '';
    }
}
