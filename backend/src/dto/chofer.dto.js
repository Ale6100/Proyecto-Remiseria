export default class ChoferDto {
    static tipoLicenciaDTO = {
        "1": 'profesionales',
        "2": 'particulares'
    };

    static create({ nombre, apellido, dni, tipoLicencia, fechaVencimiento }) {
        let fecha_vencimiento;

        if (!fechaVencimiento) {
            const fechaActual = new Date();
            if (tipoLicencia === this.tipoLicenciaDTO["1"]) {
                fechaActual.setFullYear(fechaActual.getFullYear() + 1);
                fecha_vencimiento = fechaActual.toISOString().slice(0, 10);
            } else if (tipoLicencia === this.tipoLicenciaDTO["2"]) {
                fechaActual.setFullYear(fechaActual.getFullYear() + 5);
                fecha_vencimiento = fechaActual.toISOString().slice(0, 10);
            }
        } else {
            fecha_vencimiento = fechaVencimiento;
        }

        return {
            nombre,
            apellido,
            dni,
            tipoLicencia,
            fechaVencimiento: fecha_vencimiento
        };
    }

    static badRequestCreate({ nombre, apellido, dni, tipoLicencia, fechaVencimiento }) {
        if ([nombre, apellido, dni, tipoLicencia].some(value => value === undefined) ) {
            return 'Los siguientes campos son requeridos: nombre, apellido, dni y tipoLicencia';
        }

        if (typeof nombre !== 'string' || typeof apellido !== 'string' || typeof dni !== 'string') {
            return 'Nombre, apellido y DNI deben ser cadenas de texto';
        }

        if (nombre.length > 45 || apellido.length > 45 || dni.length > 8) {
            return 'Nombre, apellido y DNI deben tener una longitud máxima de 45, 45 y 8 caracteres respectivamente';
        }

        if (tipoLicencia !== this.tipoLicenciaDTO["1"] && tipoLicencia !== this.tipoLicenciaDTO["2"]) {
            return 'Tipo de licencia inválida. Los valores permitidos son "profesionales" y "particulares"';
        }

        const fechaVencimientoRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (fechaVencimiento && !fechaVencimientoRegex.test(fechaVencimiento)) {
            return 'Fecha de vencimiento inválida. El formato debe ser "YYYY-MM-DD"';
        };

        return '';
    }
}
