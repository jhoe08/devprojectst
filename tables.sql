CREATE TABLE `transto`.`remarks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message` TEXT(255) NULL,
  `user` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);