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
-- Table structure for table `transid_activity`
--

DROP TABLE IF EXISTS `transid_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transid_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `steps_number` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `remarks` text,
  `updated_by` varchar(100) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `responsible` varchar(45) DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transid_activity`
--

LOCK TABLES `transid_activity` WRITE;
/*!40000 ALTER TABLE `transid_activity` DISABLE KEYS */;
INSERT INTO `transid_activity` VALUES (1,1,2,'approved','The Bid Proposal has been successfully forwarded to the next approver.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-07 22:32:33',116,NULL,NULL,'2026-05-07 19:34:31'),(2,2,2,'approved','The Bid Proposal has been successfully forwarded to the next approver.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-08 17:35:50',116,NULL,NULL,'2026-05-07 19:45:57'),(3,3,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 19:47:57'),(4,4,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 19:50:34'),(5,5,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 19:54:25'),(6,6,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 19:56:06'),(7,7,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 19:57:19'),(8,8,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 20:00:14'),(9,9,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 20:01:54'),(10,10,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 20:07:20'),(11,11,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 20:08:42'),(12,12,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2026-05-07 21:05:17'),(13,1,2,'approved','The Bid Proposal has been successfully forwarded to the next approver.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-07 22:32:33',116,NULL,NULL,'2026-05-07 21:10:14'),(14,2,2,'approved','The Bid Proposal has been successfully forwarded to the next approver.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-08 17:35:50',116,NULL,NULL,'2026-05-07 22:15:56'),(15,1,3,'approved','Funds availability has been approved.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-07 22:33:12',NULL,NULL,NULL,'2026-05-07 22:33:33'),(16,1,4,'approved','The Annual Procurement Plan has been successfully validated.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:09:38',NULL,NULL,NULL,'2026-05-07 22:34:12'),(17,2,3,'approved','Funds availability has been approved.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:29:31',NULL,NULL,NULL,'2026-05-08 17:36:50'),(18,1,5,'approved','BAC Secretariat has completed the review.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:09:45',NULL,NULL,NULL,'2026-05-09 11:10:38'),(19,1,6,'approved','Invitation to Bid has been successfully prepared.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:23:35',NULL,NULL,NULL,'2026-05-09 11:10:45'),(20,1,7,'approved','Bidding opportunity has been successfully advertised.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:23:43',NULL,NULL,NULL,'2026-05-09 11:24:35'),(21,1,8,'approved','Pre-bid conference has been successfully conducted.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:25:48',NULL,NULL,NULL,'2026-05-09 11:24:43'),(22,1,9,'approved','BAC evaluation has been successfully completed.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:25:54',NULL,NULL,NULL,'2026-05-09 11:26:48'),(23,1,10,'approved','Post-qualification has been finalized.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:26:01',NULL,NULL,NULL,'2026-05-09 11:26:54'),(24,1,11,'approved','Executive approval has been granted.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:26:09',NULL,NULL,NULL,'2026-05-09 11:27:01'),(25,1,12,'pending',NULL,'{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}',NULL,NULL,NULL,NULL,'2026-05-09 11:27:09'),(26,2,4,'approved','The Annual Procurement Plan has been successfully validated.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:29:36',NULL,NULL,NULL,'2026-05-09 11:30:31'),(27,2,5,'approved','BAC Secretariat has completed the review.','{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}','2026-05-09 11:29:42',NULL,NULL,NULL,'2026-05-09 11:30:36'),(28,2,6,'pending',NULL,'{employeeid:984,name:Joegie P. Wagwag,position:Computer Programmer II}',NULL,NULL,NULL,NULL,'2026-05-09 11:30:42');
/*!40000 ALTER TABLE `transid_activity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-12 16:24:19
