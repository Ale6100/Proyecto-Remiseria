export default class PrecioPorKmDto {
    static create({ precio_por_km }) {
        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1;
        const anio = fechaActual.getFullYear();

        return {
            precio_por_km,
            dia,
            mes,
            anio
        };
    }

    static badRequestCreate({ precio_por_km }) {
        if (precio_por_km === undefined) return 'El precio por kilómetro es requerido';

        if (typeof precio_por_km !== 'number' || !Number.isInteger(precio_por_km) || precio_por_km <= 0) return 'El precio por kilómetro debe ser un número natural';

        return '';
    }
}
