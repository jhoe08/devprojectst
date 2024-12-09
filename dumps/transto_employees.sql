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
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeid` int NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `middlename` varchar(45) DEFAULT NULL,
  `extname` varchar(45) DEFAULT NULL,
  `birthdate` date NOT NULL,
  `experience` json DEFAULT NULL,
  `contacts` json DEFAULT NULL,
  `others` json DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employeeid_UNIQUE` (`employeeid`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,984,'Joegie','Wagwag','Paquibot',NULL,'1993-10-08','{\"lists\": [{\"banner\": \"SAAD\", \"office\": \"DA RFO7\", \"salary\": \"25232.61\", \"status\": true, \"enddate\": \"present\", \"division\": \"FOD\", \"position\": \"Data Controller IV\", \"startdate\": \"2024-05-01\", \"employment\": \"Contract of Service (COS)\", \"arrangements\": \"On-site\"}]}','{}','{\"gender\": \"Male\", \"civilstatus\": \"Married\"}','justtest','$2b$08$n.5Nb4Nyq92fwZAOH6iOge5naX.jbi9XEzZDkWkn8x3NCa6ojzV8q'),(2,777,'Just','Joe','The',NULL,'1993-10-08',NULL,NULL,NULL,NULL,NULL),(7,917,'Jeffrey','Obsioma','Ccc',NULL,'1996-08-07','{\"lists\": [{\"office\": \"DA RFO7\", \"salary\": \"33584\", \"status\": true, \"enddate\": \"present\", \"position\": \"Information System Analyst II\", \"startdate\": \"2021-01-01\", \"employment\": \"Contract of Service (COS)\", \"arrangements\": \"On-site\"}]}',NULL,NULL,NULL,NULL),(9,342,'Daryl Rayjay','Villarante','G',NULL,'1992-12-03','{\"lists\": [{\"banner\": \"SAAD\", \"office\": \"DA RFO7\", \"salary\": \"23512\", \"status\": true, \"enddate\": \"present\", \"division\": \"FOD\", \"position\": \"Data Controller III\", \"startdate\": \"2023-12-03\", \"employment\": \"Contract of Service (COS)\", \"arrangements\": \"On-site\"}]}','{\"email\": \"darylrayjay.villarante@gmail.com\", \"mobile\": \"\"}','{\"gender\": \"Male\", \"civilstatus\": \"Married\"}',NULL,NULL),(15,108,'Admin','Admin','Admin','Sr','1993-01-01','{\"lists\": [{\"banner\": \"\", \"office\": \"DA-RFO7\", \"salary\": \"88888\", \"status\": true, \"enddate\": \"present\", \"division\": \"ADMIN\", \"position\": \"Super Admin\", \"startdate\": \"2024-01-01\", \"employment\": \"Permanent\", \"arrangements\": \"On-site\"}]}','{\"email\": \"\", \"mobile\": \"\"}','{\"gender\": \"N/A\", \"civilstatus\": \"Single\"}','admin','$2b$08$HnfUtqXloPtW5mXfDeho1.TMj8Pjg.YdukGDzgt4oZ8wCp9r/5dq6'),(22,888,'firstname','lastname','middlename',NULL,'1993-10-08','{\"lists\": [{\"office\": \"companyname\", \"salary\": \"888\", \"status\": true, \"enddate\": \"present\", \"position\": \"position\", \"startdate\": \"1993-10-08\", \"employment\": \"\", \"arrangements\": \"On-site\"}]}',NULL,NULL,NULL,NULL),(23,999,'Juan','Dela ','Cruz',NULL,'1993-10-08','{\"lists\": [{\"office\": \"DA RF07\", \"salary\": \"1111\", \"status\": true, \"enddate\": \"present\", \"position\": \"Tester\", \"startdate\": \"1990-01-31\", \"employment\": \"Permanent\", \"arrangements\": \"On-site\"}]}',NULL,NULL,'juandela','$2b$08$KWyvsypWQ61yEBbVt1qCqet.IGnZ3G/rQFEeWWeGaDBruYgtKYzDC');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
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
