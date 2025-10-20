-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: transto
-- ------------------------------------------------------
-- Server version	8.0.38

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
  `message` varchar(45) NOT NULL,
  `link` varchar(45) DEFAULT NULL,
  `component` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'New Transactions was created','17261','transactions','2024-10-14 08:49:19',NULL),(5,'New user was registered','888','employees','2024-10-17 01:52:15',NULL),(6,'New Remarks is added','110','remarks','2024-10-18 00:00:00',NULL),(7,'New Remarks is added','111','remarks','2024-10-18 08:10:19',NULL),(8,'New Remarks is added','112','remarks','2024-10-18 08:10:55',NULL),(9,'New Remarks is added','113','remarks','2024-10-18 10:10:24',NULL),(10,'New Remarks is added','114','remarks','2024-10-18 12:10:10',NULL),(11,'New remark is added','17256','remarks','2024-10-18 12:10:19',NULL),(12,'New remark is added on Trans ID #17256','17256','remarks','2024-10-22 09:10:41',NULL),(13,'New remark is added on Trans ID #17256','17256','remarks','2024-10-22 12:10:17',NULL),(14,'New remark is added #17256!','17256','remarks','2024-10-24 08:10:14',NULL),(15,'New remark is added #17256!','17256','remarks','2024-10-24 08:10:47',NULL),(16,'New remark is added #17256!','17256','remarks','2024-10-24 09:10:11',NULL),(17,'New remark is added #17256!','17256','remarks','2024-10-24 09:10:13',NULL),(18,'New remark is added #17256!','17256','remarks','2024-10-24 09:10:20',NULL),(19,'New remark is added #17256!','17256','remarks','2024-10-25 08:10:41',NULL),(20,'New remark is added #17256!','17256','remarks','2024-10-25 10:10:45',NULL),(21,'New remark is added #17256!','17256','remarks','2024-10-25 11:10:41',NULL),(22,'New remark is added #17256!','17256','remarks','2024-10-25 12:10:45',NULL),(23,'New remark is added #17256!','17256','remarks','2024-11-05 14:11:55',NULL),(24,'New remark is added #17256!','17256','remarks','2024-11-05 14:11:29',NULL),(25,'New remark is added #17256!','17256','remarks','2024-11-05 14:11:42',NULL),(26,'New transaction was created','17262','transactions','2024-11-14 15:11:19',NULL),(27,'New remark is added #17262!','17262','remarks','2024-11-14 15:11:23',NULL),(28,'New user was registered','999','employees','2024-11-19 09:11:05',NULL),(29,'New remark is added #17255!','17255','remarks','2024-11-22 08:11:28',NULL),(30,'New remark is added #17255!','17255','remarks','2024-11-22 08:11:29',NULL),(31,'New remark is added #17255!','17255','remarks','2024-11-27 12:11:59',NULL),(32,'New remark is added #17123!','17123','remarks','2024-11-27 12:11:34',NULL),(33,'New transaction was created','17266','transactions','2024-12-02 16:12:02',NULL);
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

-- Dump completed on 2024-12-09 11:07:09
