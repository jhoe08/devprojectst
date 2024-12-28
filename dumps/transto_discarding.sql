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
-- Table structure for table `discarding`
--

DROP TABLE IF EXISTS `discarding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discarding` (
  `id` int NOT NULL AUTO_INCREMENT,
  `component` varchar(45) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discarding`
--

LOCK TABLES `discarding` WRITE;
/*!40000 ALTER TABLE `discarding` DISABLE KEYS */;
INSERT INTO `discarding` VALUES (1,'transactions','[17022,\"17222\",\"17223\",\"17224\",\"17227\",\"17246\",\"17240\",\"17239\",\"17241\",\"17238\",\"17237\",\"17236\",\"17235\",\"17234\",\"17233\",\"17251\",\"17250\",\"17249\",\"17248\",\"17247\",\"17261\",\"17260\",\"17259\",\"17258\",\"17257\",\"17256\",\"17262\",\"17253\",\"17243\",\"17266\",\"17265\",\"17264\",\"17263\"]'),(2,'employees','[888]'),(9,'transactions','[17022,\"17222\",\"17223\",\"17224\",\"17227\",\"17246\",\"17240\",\"17239\",\"17241\",\"17238\",\"17237\",\"17236\",\"17235\",\"17234\",\"17233\",\"17251\",\"17250\",\"17249\",\"17248\",\"17247\",\"17261\",\"17260\",\"17259\",\"17258\",\"17257\",\"17256\",\"17262\",\"17253\",\"17243\",\"17266\",\"17265\",\"17264\",\"17263\"]'),(10,'transactions','[17022,\"17222\",\"17223\",\"17224\",\"17227\",\"17246\",\"17240\",\"17239\",\"17241\",\"17238\",\"17237\",\"17236\",\"17235\",\"17234\",\"17233\",\"17251\",\"17250\",\"17249\",\"17248\",\"17247\",\"17261\",\"17260\",\"17259\",\"17258\",\"17257\",\"17256\",\"17262\",\"17253\",\"17243\",\"17266\",\"17265\",\"17264\",\"17263\"]'),(11,'transactions','[17022,\"17222\",\"17223\",\"17224\",\"17227\",\"17246\",\"17240\",\"17239\",\"17241\",\"17238\",\"17237\",\"17236\",\"17235\",\"17234\",\"17233\",\"17251\",\"17250\",\"17249\",\"17248\",\"17247\",\"17261\",\"17260\",\"17259\",\"17258\",\"17257\",\"17256\",\"17262\",\"17253\",\"17243\",\"17266\",\"17265\",\"17264\",\"17263\"]'),(12,'transactions','[17022,\"17222\",\"17223\",\"17224\",\"17227\",\"17246\",\"17240\",\"17239\",\"17241\",\"17238\",\"17237\",\"17236\",\"17235\",\"17234\",\"17233\",\"17251\",\"17250\",\"17249\",\"17248\",\"17247\",\"17261\",\"17260\",\"17259\",\"17258\",\"17257\",\"17256\",\"17262\",\"17253\",\"17243\",\"17266\",\"17265\",\"17264\",\"17263\"]');
/*!40000 ALTER TABLE `discarding` ENABLE KEYS */;
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
