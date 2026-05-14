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
-- Table structure for table `transid`
--

DROP TABLE IF EXISTS `transid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transid` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `trans_id` int DEFAULT NULL,
  `trans_code` varchar(250) DEFAULT NULL,
  `pr_date` datetime DEFAULT NULL,
  `approved_budget` varchar(45) DEFAULT NULL,
  `pr_classification` varchar(50) DEFAULT NULL,
  `procurement_type` text,
  `requisitioner` text,
  `prepared_by` varchar(255) DEFAULT NULL,
  `division` varchar(45) DEFAULT NULL,
  `banner_program` text,
  `fund_source` json DEFAULT NULL,
  `bac_unit` varchar(45) DEFAULT NULL,
  `bid_notice_title` text,
  `remarks` text,
  UNIQUE KEY `product_id_UNIQUE` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transid`
--

LOCK TABLES `transid` WRITE;
/*!40000 ALTER TABLE `transid` DISABLE KEYS */;
INSERT INTO `transid` VALUES (1,NULL,'[null,\"FOD-C-26-0005\",\"10000-05-12-0001\"]','2026-05-07 21:05:13','5000000','Goods','Limited Source Bidding','A. Maribojoc','{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"}',NULL,NULL,'[{\"amount\": \"5000000\", \"source\": \"01101101::310103100003000 ESETS CORN | MOOE | 50203100-00 | Agricultural and Marine Supplies Exp.\"}]','BAC 1','Procurement of Corn Seeds and Fertilizer','{\"remarks\":{\"remarks\":{\"remarks\":{\"message\":\"Created Transaction\",\"updatedBy\":{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"},\"updatedAt\":\"2026-05-10T23:25:09.847Z\"},\"updatedBy\":{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"},\"updatedAt\":\"2026-05-10T23:28:49.960Z\"},\"updatedBy\":{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"},\"updatedAt\":\"2026-05-10T23:31:37.194Z\"}}'),(2,NULL,NULL,'2026-05-07 22:05:56','5000000','Others','Competitive Bidding','A. Maribojoc','{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"}',NULL,NULL,'[{\"amount\": \"5000000\", \"source\": \"01102101::310103100003000 ESETS CORN | MOOE | 50203100-00 | Agricultural and Marine Supplies Exp. | GAA Continuing\"}]','BAC 1','Procurement of Corn Seeds and Fertilizer for Year 2028 ss','{\"remarks\":{\"remarks\":{\"remarks\":{\"updatedBy\":{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"},\"updatedAt\":\"2026-05-08T09:34:30.087Z\"},\"updatedBy\":{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"},\"updatedAt\":\"2026-05-08T09:35:08.609Z\"},\"updatedBy\":{\"employeeid\":984,\"name\":\"Joegie P. Wagwag\",\"position\":\"Computer Programmer II\"},\"updatedAt\":\"2026-05-09T20:49:08.607Z\"}}');
/*!40000 ALTER TABLE `transid` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-12 16:24:17
