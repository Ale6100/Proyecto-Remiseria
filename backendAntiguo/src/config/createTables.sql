DROP TABLE IF EXISTS `historial_precio_por_km`;
CREATE TABLE `historial_precio_por_km` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `precio_por_km` INT NOT NULL,
  `dia` TINYINT NOT NULL,
  `mes` TINYINT NOT NULL,
  `anio` YEAR NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `licencias`;
CREATE TABLE `licencias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('particulares', 'profesionales') NOT NULL,
  `fechaEmision` DATE NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `choferes`;
CREATE TABLE `choferes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `dni` VARCHAR(9) NOT NULL,
  `idLicencia` INT NOT NULL,
  CONSTRAINT `choferes_licencias_fk` FOREIGN KEY (`idLicencia`) REFERENCES `licencias`(`id`),
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `marcas`;
CREATE TABLE `marcas` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS `vehiculos`;
CREATE TABLE `vehiculos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `dominio` VARCHAR(20) NOT NULL,
  `modelo` VARCHAR(50) NOT NULL,
  `kmParciales` INT NOT NULL,
  `kmTotales` INT NOT NULL,
  `marca_id` INT NOT NULL,
  CONSTRAINT `marca_fk` FOREIGN KEY (`marca_id`) REFERENCES `marcas`(`id`)
);

DROP TABLE IF EXISTS `viajes`;
CREATE TABLE `viajes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `horas` INT NOT NULL,
  `minutos` INT NOT NULL,
  `kms` INT NOT NULL,
  `chofer_id` INT NOT NULL,
  `vehiculo_id` INT NOT NULL,
  `precio_por_km_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chofer_fk`
    FOREIGN KEY (`chofer_id`)
    REFERENCES `choferes`(`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `vehiculo_fk`
    FOREIGN KEY (`vehiculo_id`)
    REFERENCES `vehiculos`(`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `precio_por_km_fk`
    FOREIGN KEY (`precio_por_km_id`)
    REFERENCES `historial_precio_por_km`(`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

INSERT INTO `historial_precio_por_km` VALUES (3, 50, 20, 2, 2023);

INSERT INTO `marcas` VALUES (1, 'Toyota'),(2, 'Ford'), (3, 'Honda'), (4, 'Chevrolet'), (5, 'Nissan'), (6, 'BMW'), (7, 'Audi'), (8, 'Volkswagen'), (9, 'Mercedes-Benz'), (10, 'Hyundai');
