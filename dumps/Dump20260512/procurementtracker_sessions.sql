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
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('ceVZoJ2i0BLw-7yZ3tGDwWTJhrVwohmc',1778634026,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"error\":401,\"user\":{\"id\":1,\"employeeid\":984,\"firstname\":\"Joegie\",\"lastname\":\"Wagwag\",\"middlename\":\"Paquibot\",\"extname\":null,\"birthdate\":\"1993-10-07T16:00:00.000Z\",\"experience\":\"{\\\"lists\\\": [{\\\"office\\\": \\\"DA RFO7\\\", \\\"salary\\\": \\\"25232.61\\\", \\\"status\\\": true, \\\"enddate\\\": \\\"present\\\", \\\"section\\\": \\\"SDS\\\", \\\"division\\\": \\\"ICTD\\\", \\\"position\\\": \\\"Computer Programmer II\\\", \\\"startdate\\\": \\\"2024-05-01\\\", \\\"employment\\\": \\\"Contract of Service (COS)\\\", \\\"arrangements\\\": \\\"On-site\\\"}]}\",\"contacts\":\"{\\\"email\\\": \\\"\\\", \\\"mobile\\\": \\\"\\\"}\",\"others\":\"{\\\"gender\\\": \\\"n/a\\\", \\\"civilstatus\\\": \\\"single\\\"}\",\"username\":\"justtest\",\"password\":\"$2b$08$oo3lvXfIysYK3//LRrVIROXhV.pQUpBoTGf35TzgBxxVI9NdV7NRG\",\"roles\":\"[\\\"SuperAdmin\\\"]\",\"components\":\"[\\\"Transactions\\\", \\\"Employees\\\",\\\"Documents\\\"]\"},\"isAuthenticated\":true,\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1c3R0ZXN0IiwiaWF0IjoxNzc4NTM5ODg0LCJleHAiOjE3Nzg1NDM0ODR9.HxXeC57vT2DovlDi15i6hTLKAlFugfL0SK518ulcwYg\",\"isGuest\":false}'),('mua0rB-T_UmjOsngyaTjBHFHEWdt0Tyw',1778660641,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"error\":401,\"user\":{\"id\":1,\"employeeid\":984,\"firstname\":\"Joegie\",\"lastname\":\"Wagwag\",\"middlename\":\"Paquibot\",\"extname\":null,\"birthdate\":\"1993-10-07T16:00:00.000Z\",\"experience\":\"{\\\"lists\\\": [{\\\"office\\\": \\\"DA RFO7\\\", \\\"salary\\\": \\\"25232.61\\\", \\\"status\\\": true, \\\"enddate\\\": \\\"present\\\", \\\"section\\\": \\\"SDS\\\", \\\"division\\\": \\\"ICTD\\\", \\\"position\\\": \\\"Computer Programmer II\\\", \\\"startdate\\\": \\\"2024-05-01\\\", \\\"employment\\\": \\\"Contract of Service (COS)\\\", \\\"arrangements\\\": \\\"On-site\\\"}]}\",\"contacts\":\"{\\\"email\\\": \\\"\\\", \\\"mobile\\\": \\\"\\\"}\",\"others\":\"{\\\"gender\\\": \\\"n/a\\\", \\\"civilstatus\\\": \\\"single\\\"}\",\"username\":\"justtest\",\"password\":\"$2b$08$oo3lvXfIysYK3//LRrVIROXhV.pQUpBoTGf35TzgBxxVI9NdV7NRG\",\"roles\":\"[\\\"SuperAdmin\\\"]\",\"components\":\"[\\\"Transactions\\\", \\\"Employees\\\",\\\"Documents\\\"]\"},\"isAuthenticated\":true,\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1c3R0ZXN0IiwiaWF0IjoxNzc4NTQ3ODcyLCJleHAiOjE3Nzg1NTE0NzJ9.YhARKt9iJzTI4_W41funy2prsuKbcGl3gT968T8_N_E\",\"isGuest\":false}'),('wdPM6v78xR3puE5N7T8az8ymDINIEtFA',1778580127,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"employeeid\":984,\"firstname\":\"Joegie\",\"lastname\":\"Wagwag\",\"middlename\":\"Paquibot\",\"extname\":null,\"birthdate\":\"1993-10-07T16:00:00.000Z\",\"experience\":\"{\\\"lists\\\": [{\\\"office\\\": \\\"DA RFO7\\\", \\\"salary\\\": \\\"25232.61\\\", \\\"status\\\": true, \\\"enddate\\\": \\\"present\\\", \\\"section\\\": \\\"SDS\\\", \\\"division\\\": \\\"ICTD\\\", \\\"position\\\": \\\"Computer Programmer II\\\", \\\"startdate\\\": \\\"2024-05-01\\\", \\\"employment\\\": \\\"Contract of Service (COS)\\\", \\\"arrangements\\\": \\\"On-site\\\"}]}\",\"contacts\":\"{\\\"email\\\": \\\"\\\", \\\"mobile\\\": \\\"\\\"}\",\"others\":\"{\\\"gender\\\": \\\"n/a\\\", \\\"civilstatus\\\": \\\"single\\\"}\",\"username\":\"justtest\",\"password\":\"$2b$08$oo3lvXfIysYK3//LRrVIROXhV.pQUpBoTGf35TzgBxxVI9NdV7NRG\",\"roles\":\"[\\\"SuperAdmin\\\"]\",\"components\":\"[\\\"Transactions\\\", \\\"Employees\\\",\\\"Documents\\\"]\"},\"isAuthenticated\":true,\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1c3R0ZXN0IiwiaWF0IjoxNzc4NDU0Njg5LCJleHAiOjE3Nzg0NTgyODl9.EHaN1GMeuml2bAyEbkD9P8Y_hRzJrcc1SxfahFWjlGU\",\"isGuest\":false}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
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
