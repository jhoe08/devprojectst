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
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `link` varchar(45) DEFAULT NULL,
  `component` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'New transaction was created','1','transactions','2026-03-17 09:03:52','2026-03-17 09:03:52'),(2,'New transaction was created','2','transactions','2026-03-17 11:03:04','2026-03-17 11:03:04'),(3,'New transaction was created','3','transactions','2026-03-17 11:03:30','2026-03-17 11:03:30'),(4,'New transaction was created','4','transactions','2026-03-17 11:03:13','2026-03-17 11:03:13'),(5,'The Purchase Request has been successfully forwarded to the next approver.','3','transactions','2026-03-23 11:03:54','2026-03-23 11:03:54'),(6,'Funds availability has been approved.','3','transactions','2026-03-23 13:03:31','2026-03-23 13:03:31'),(7,'New transaction was created','5','transactions','2026-03-26 09:03:41','2026-03-26 09:03:41'),(8,'New transaction was created','6','transactions','2026-03-26 09:03:36','2026-03-26 09:03:36'),(9,'New transaction was created','7','transactions','2026-03-26 09:03:30','2026-03-26 09:03:30'),(10,'The Purchase Request has been successfully forwarded to the next approver.','7','transactions','2026-03-26 09:03:16','2026-03-26 09:03:16'),(11,'The Purchase Request has been successfully forwarded to the next approver.','6','transactions','2026-03-26 16:03:01','2026-03-26 16:03:01'),(12,'New transaction was created','1','transactions','2026-04-01 09:04:05','2026-04-01 09:04:05'),(13,'New transaction was created','2','transactions','2026-04-01 09:04:48','2026-04-01 09:04:48'),(14,'New transaction was created','3','transactions','2026-04-01 09:04:52','2026-04-01 09:04:52'),(15,'New transaction was created','4','transactions','2026-04-01 09:04:07','2026-04-01 09:04:07'),(16,'New transaction was created','5','transactions','2026-04-01 09:04:16','2026-04-01 09:04:16'),(17,'New transaction was created','1','transactions','2026-04-01 10:04:25','2026-04-01 10:04:25'),(18,'New transaction was created','2','transactions','2026-04-01 10:04:29','2026-04-01 10:04:29'),(19,'New transaction was created','3','transactions','2026-04-01 10:04:51','2026-04-01 10:04:51'),(20,'New transaction was created','4','transactions','2026-04-01 10:04:14','2026-04-01 10:04:14'),(21,'New transaction was created','5','transactions','2026-04-01 10:04:51','2026-04-01 10:04:51'),(22,'New transaction was created','6','transactions','2026-04-01 10:04:34','2026-04-01 10:04:34'),(23,'New transaction was created','7','transactions','2026-04-01 10:04:39','2026-04-01 10:04:39'),(24,'New transaction was created','8','transactions','2026-04-01 10:04:25','2026-04-01 10:04:25'),(25,'New transaction was created','8','transactions','2026-04-01 11:04:34','2026-04-01 11:04:34'),(26,'New transaction was created','1','transactions','2026-04-06 10:04:45','2026-04-06 10:04:45'),(27,'New transaction was created','2','transactions','2026-04-06 10:04:39','2026-04-06 10:04:39'),(28,'New transaction was created','3','transactions','2026-04-06 11:04:55','2026-04-06 11:04:55'),(29,'New transaction was created','1','transactions','2026-04-07 10:04:40','2026-04-07 10:04:40'),(30,'New transaction was created','1','transactions','2026-05-07 19:05:31','2026-05-07 19:05:31'),(31,'New transaction was created','2','transactions','2026-05-07 19:05:57','2026-05-07 19:05:57'),(32,'New transaction was created','3','transactions','2026-05-07 19:05:57','2026-05-07 19:05:57'),(33,'New transaction was created','4','transactions','2026-05-07 19:05:34','2026-05-07 19:05:34'),(34,'New transaction was created','5','transactions','2026-05-07 19:05:25','2026-05-07 19:05:25'),(35,'New transaction was created','6','transactions','2026-05-07 19:05:06','2026-05-07 19:05:06'),(36,'New transaction was created','7','transactions','2026-05-07 19:05:19','2026-05-07 19:05:19'),(37,'New transaction was created','8','transactions','2026-05-07 20:05:14','2026-05-07 20:05:14'),(38,'New transaction was created','9','transactions','2026-05-07 20:05:54','2026-05-07 20:05:54'),(39,'New transaction was created','10','transactions','2026-05-07 20:05:20','2026-05-07 20:05:20'),(40,'New transaction was created','11','transactions','2026-05-07 20:05:42','2026-05-07 20:05:42'),(41,'New transaction was created','12','transactions','2026-05-07 21:05:16','2026-05-07 21:05:16'),(42,'New transaction was created','1','transactions','2026-05-07 21:05:14','2026-05-07 21:05:14'),(43,'New transaction was created','2','transactions','2026-05-07 22:05:56','2026-05-07 22:05:56'),(44,'The Bid Proposal has been successfully forwarded to the next approver.','1','transactions','2026-05-07 22:05:33','2026-05-07 22:05:33'),(45,'Funds availability has been approved.','1','transactions','2026-05-07 22:05:12','2026-05-07 22:05:12'),(46,'The Bid Proposal has been successfully forwarded to the next approver.','2','transactions','2026-05-08 17:05:50','2026-05-08 17:05:50'),(47,'The Annual Procurement Plan has been successfully validated.','1','transactions','2026-05-09 11:05:38','2026-05-09 11:05:38'),(48,'BAC Secretariat has completed the review.','1','transactions','2026-05-09 11:05:45','2026-05-09 11:05:45'),(49,'Invitation to Bid has been successfully prepared.','1','transactions','2026-05-09 11:05:35','2026-05-09 11:05:35'),(50,'Bidding opportunity has been successfully advertised.','1','transactions','2026-05-09 11:05:43','2026-05-09 11:05:43'),(51,'Pre-bid conference has been successfully conducted.','1','transactions','2026-05-09 11:05:48','2026-05-09 11:05:48'),(52,'BAC evaluation has been successfully completed.','1','transactions','2026-05-09 11:05:54','2026-05-09 11:05:54'),(53,'Post-qualification has been finalized.','1','transactions','2026-05-09 11:05:01','2026-05-09 11:05:01'),(54,'Executive approval has been granted.','1','transactions','2026-05-09 11:05:09','2026-05-09 11:05:09'),(55,'Funds availability has been approved.','2','transactions','2026-05-09 11:05:31','2026-05-09 11:05:31'),(56,'The Annual Procurement Plan has been successfully validated.','2','transactions','2026-05-09 11:05:36','2026-05-09 11:05:36'),(57,'BAC Secretariat has completed the review.','2','transactions','2026-05-09 11:05:42','2026-05-09 11:05:42');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-12 16:24:18
