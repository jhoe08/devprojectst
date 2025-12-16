CREATE TABLE `transid_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trans_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `remarks` text,
  `updated_by` varchar(100) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
