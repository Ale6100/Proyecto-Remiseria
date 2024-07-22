export default class ViajeDto {
    static badRequestGetAll({ page, limit }) {

        if (page !== undefined && !(typeof page === 'number' && Number.isInteger(page) && page >= 0)) {
            return 'El parámetro "page" debe ser un número natural o cero';
        }

        if (limit !== undefined && !(typeof limit === 'number' && Number.isInteger(limit) && limit > 0)) {
            return 'El parámetro "page" debe ser un número natural';
        }
        return '';
    }
}
