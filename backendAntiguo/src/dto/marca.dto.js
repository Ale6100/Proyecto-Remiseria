export default class MarcaDto {
    static create({ nombre }) {
        return {
            nombre
        };
    }

    static badRequestCreate({ nombre }) {
        if (!nombre) {
            return 'El campo nombre es requerido';
        }

        if (typeof nombre !== 'string') {
            return 'nombre debe ser una cadena de texto';
        }

        if (nombre.length > 50) {
            return 'nombre debe tener una longitud máxima de 50 caracteres';
        }

        return '';
    }
}
