-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: procurementtracker
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `market_scoping`
--

DROP TABLE IF EXISTS `market_scoping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_scoping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_title` varchar(255) NOT NULL,
  `estimated_budget` decimal(15,2) DEFAULT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `date_conducted` text,
  `end_user_unit` varchar(255) DEFAULT NULL,
  `expected_delivery` date DEFAULT NULL,
  `consultations_with_suppliers` tinyint(1) DEFAULT '0',
  `participation_in_summits` tinyint(1) DEFAULT '0',
  `review_reports` tinyint(1) DEFAULT '0',
  `review_brochures` tinyint(1) DEFAULT '0',
  `price_sourcing` tinyint(1) DEFAULT '0',
  `use_philgeps_data` tinyint(1) DEFAULT '0',
  `other_activity` text,
  `documentation` text,
  `prepared_by_name` varchar(255) DEFAULT NULL,
  `prepared_by_position` varchar(255) DEFAULT NULL,
  `prepared_by_date` timestamp NULL DEFAULT NULL,
  `prepared_by_signature` varchar(255) DEFAULT NULL,
  `reviewed_by_name` varchar(255) DEFAULT NULL,
  `reviewed_by_position` varchar(255) DEFAULT NULL,
  `reviewed_by_date` timestamp NULL DEFAULT NULL,
  `reviewed_by_signature` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_scoping`
--

LOCK TABLES `market_scoping` WRITE;
/*!40000 ALTER TABLE `market_scoping` DISABLE KEYS */;
INSERT INTO `market_scoping` VALUES (1,'Procurement of Corn Seeds and Fertilizer',5000000.00,'[1,2]','05/2026 - 05/2026','Corn Program','2026-07-08',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'Joegie P. Wagwag','Computer Programmer II','2026-05-07 16:00:00',NULL,'Annearth V. Maribojoc','Information System Analyst II','2026-05-07 16:00:00',NULL,'2026-05-07 13:09:25','2026-05-07 14:15:56');
/*!40000 ALTER TABLE `market_scoping` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-12 16:24:20
