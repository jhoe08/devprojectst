-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: procurementtracker
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `procurementtracker`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `procurementtracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `procurementtracker`;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` mediumtext NOT NULL,
  `priority` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'Conduct delivery and distribution of interventions','special','outgoing','2025-01-21 09:01:48','2025-01-21 12:59:26','justtest');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents_activity`
--

DROP TABLE IF EXISTS `documents_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refid` int NOT NULL,
  `message` longtext NOT NULL,
  `reciever` varchar(245) DEFAULT NULL,
  `timetocomply` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents_activity`
--

LOCK TABLES `documents_activity` WRITE;
/*!40000 ALTER TABLE `documents_activity` DISABLE KEYS */;
INSERT INTO `documents_activity` VALUES (1,1,'<div class=\"wrapper\" style=\"overflow: hidden; width: 794px;\">\n        <div class=\"header row\" style=\"margin-bottom: -120px;\">\n            <img src=\"https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/border.png\" style=\"width: 100%;\">\n        </div>\n        <div class=\"main\" style=\"padding: 0 40px;\">\n            <div class=\"row reciever\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">For: </strong>\n                </div>\n                <div class=\"col-5\" style=\"flex: 0 0 auto; width: 41.66666667%;\">wagwag.joegie@gmail.com</div>\n                <div class=\"col-5\" style=\"flex: 0 0 auto; width: 41.66666667%;\">wagwag.joegie@gmail.com</div>\n            </div>\n            <div class=\"row sender\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">From: </strong>\n                </div>\n                <div class=\"col-10\" style=\"flex: 0 0 auto; width: 83.33333333%;\">Regional Executive Director</div>\n            </div>\n            <div class=\"row subject\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">Subject: </strong>\n                </div>\n                <div class=\"col-10\" style=\"flex: 0 0 auto; width: 83.33333333%;\">Conduct delivery and distribution of interventions</div>\n            </div>\n            <div class=\"row timetocomply\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">Time to Comply: </strong>\n                </div>\n                <div class=\"col-10\" style=\"flex: 0 0 auto; width: 83.33333333%;\">January 28, 2025 8:00:00</div>\n            </div>\n            <div class=\"message\" style=\"margin-bottom: 20px;\">\n                <div style=\"width: 100%;\">Kindly confirm receipt of this communication and provide any updates.</div>\n            </div>\n            <div class=\"additional\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">Additional Message: </strong>\n                </div>\n                <div style=\"flex: 0 0 auto; width: 83.33333333%; margin: 0; font-family: inherit;\">In the exigency of the service, you are directed to transport and deliver the in-organic fertilizers and assorted vegetables of SAAD interventions in Batuan, Dagohoy, and Anda, Bohol on January 28-29, 2025</div>\n            </div>\n        </div>\n        <div class=\"footer\" style=\"display: flex;\">\n            <div class=\"col-4 mr-4\" style=\"flex: 0 0 auto;width: 33.33333333%;display: flex;justify-content: space-around;align-items: center;\">\n                <img src=\"https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/bagong-pilipinas.png\" width=\"100vw\">\n                <img src=\"https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/da-logo.png\" width=\"100vw\">\n            </div>\n            <div class=\"col-8\" style=\"flex: 0 0 auto; width: 66.66666667%;\">\n                <h3 style=\"margin: 0 2px;\">OFFICE OF THE REGIONAL EXECUTIVE DIRECTOR</h3>\n                <h1 style=\"margin: 0 2px; font-weight: 100;\">Department of Agriculture</h1>\n                <h3 style=\"margin: 0 2px;\">Regional Field Office No. VII</h3>\n                <p style=\"margin: 0 2px;\">DA-RFO 7 Complex, Highway Maguikay, Mandaue City 6014, Cebu</p>\n                <p style=\"margin: 0 2px;\">Tel. No. (032) 268-5187; Email: redsoffice7@gmail.com</p>\n            </div>\n        </div>\n    </div>','wagwag.joegie@gmail.com','2025-01-28 08:00:00','justtest','2025-01-21 08:55:19'),(2,1,'Recieved.',NULL,NULL,'justtest','2025-01-21T03:29:50.487Z'),(3,1,'<div class=\"wrapper\" style=\"overflow: hidden; width: 794px;\">\n        <div class=\"header row\" style=\"margin-bottom: -120px;\">\n            <img src=\"https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/border.png\" style=\"width: 100%;\">\n        </div>\n        <div class=\"main\" style=\"padding: 0 40px;\">\n            <div class=\"row reciever\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">For: </strong>\n                </div>\n                <div class=\"col-10\" style=\"flex: 0 0 auto; width: 83.33333333%;\">game.mrjhon8@gmail.com</div>\n            </div>\n            <div class=\"row sender\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">From: </strong>\n                </div>\n                <div class=\"col-10\" style=\"flex: 0 0 auto; width: 83.33333333%;\">Regional Executive Director</div>\n            </div>\n            <div class=\"row subject\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">Subject: </strong>\n                </div>\n                <div class=\"col-10\" style=\"flex: 0 0 auto; width: 83.33333333%;\">Conduct delivery and distribution of interventions</div>\n            </div>\n            <div class=\"row timetocomply\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">Time to Comply: </strong>\n                </div>\n                <div class=\"col-10\" style=\"flex: 0 0 auto; width: 83.33333333%;\">January 16, 2025 0:01:00</div>\n            </div>\n            <div class=\"additional\" style=\"display: flex; margin-bottom: 20px;\">\n                <div class=\"col-2 mr-4 hidden\" style=\"flex: 0 0 auto; width: 16.66666667%;\">\n                    <strong style=\"font-weight: 600; text-transform: uppercase;\">Additional Message: </strong>\n                </div>\n                <div style=\"flex: 0 0 auto; width: 100%; margin: 0; font-family: inherit;\">asdwasdwasd</div>\n            </div>\n            <div class=\"message\" style=\"margin-bottom: 20px;\">\n                <div style=\"width: 100%;\">Kindly confirm receipt of this communication and provide any updates.</div>\n            </div>\n        </div>\n        <div class=\"footer\" style=\"display: flex;\">\n            <div class=\"col-4 mr-4\" style=\"flex: 0 0 auto;width: 33.33333333%;display: flex;justify-content: space-around;align-items: center;\">\n                <img src=\"https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/bagong-pilipinas.png\" width=\"100vw\">\n                <img src=\"https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/da-logo.png\" width=\"100vw\">\n            </div>\n            <div class=\"col-8\" style=\"flex: 0 0 auto; width: 66.66666667%;\">\n                <h3 style=\"margin: 0 2px;\">OFFICE OF THE REGIONAL EXECUTIVE DIRECTOR</h3>\n                <h1 style=\"margin: 0 2px; font-weight: 100;\">Department of Agriculture</h1>\n                <h3 style=\"margin: 0 2px;\">Regional Field Office No. VII</h3>\n                <p style=\"margin: 0 2px;\">DA-RFO 7 Complex, Highway Maguikay, Mandaue City 6014, Cebu</p>\n                <p style=\"margin: 0 2px;\">Tel. No. (032) 268-5187; Email: redsoffice7@gmail.com</p>\n            </div>\n        </div>\n    </div>','game.mrjhon8@gmail.com','2025-01-16 00:01:00','justtest','2025-01-21 12:59:26');
/*!40000 ALTER TABLE `documents_activity` ENABLE KEYS */;
UNLOCK TABLES;

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
  `roles` varchar(255) DEFAULT NULL,
  `components` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employeeid_UNIQUE` (`employeeid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,984,'Joegie','Wagwag','Paquibot',NULL,'1993-10-08','{\"lists\": [{\"office\": \"DA RFO7\", \"salary\": \"25232.61\", \"status\": true, \"enddate\": \"present\", \"section\": \"SDS\", \"division\": \"ICTD\", \"position\": \"Data Controller IV\", \"startdate\": \"2024-05-01\", \"employment\": \"Contract of Service (COS)\", \"arrangements\": \"On-site\"}]}','{\"email\": \"\", \"mobile\": \"\"}','{\"gender\": \"n/a\", \"civilstatus\": \"single\"}','justtest','$2b$08$n.5Nb4Nyq92fwZAOH6iOge5naX.jbi9XEzZDkWkn8x3NCa6ojzV8q','[\"SuperAdmin\"]','[\"Transactions\", \"Employees\",\"Documents\"]'),(24,71001,'Admin','PMED','Sa','','1999-10-10','{\"lists\": [{\"office\": \"DA RFO7\", \"salary\": \"17000\", \"status\": true, \"enddate\": \"present\", \"section\": \"PMED\", \"division\": \"PMED\", \"position\": \"admin aide\", \"startdate\": \"2024-10-02\", \"employment\": \"Contract of Service (COS)\", \"arrangements\": \"On-site\"}]}','{\"email\": \"pmed_admin@gmail.com\", \"mobile\": \"\"}','{\"gender\": \"other\'s\", \"civilstatus\": \"single\"}','pmed_admin','$2b$08$fbCRbcq3WGDa34i8.F5ay.lnqJFM0Ne5hxEceinjc.wJryaEIPka.','[]','[\"Documents\",\"Transactions\"]');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_accounts`
--

DROP TABLE IF EXISTS `guest_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_accounts` (
  `guest_token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  `status` varchar(50) NOT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`guest_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_accounts`
--

LOCK TABLES `guest_accounts` WRITE;
/*!40000 ALTER TABLE `guest_accounts` DISABLE KEYS */;
INSERT INTO `guest_accounts` VALUES ('eff99f28-80be-4812-9e56-a55d24a95989','2025-10-01 06:12:20','2025-10-01 06:22:15','used','{\"ip\": \"127.0.0.1\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-01 14:22:15\"}');
/*!40000 ALTER TABLE `guest_accounts` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'Funds availability has been approved.','2','transactions','2025-10-03 13:10:36','2025-10-03 13:10:36'),(2,'BAC Secretariat has completed the review.','2','transactions','2025-10-06 14:10:56','2025-10-06 14:10:56'),(3,'Quotation form has been successfully prepared.','2','transactions','2025-10-06 14:10:07','2025-10-06 14:10:07'),(4,'Canvassing has been successfully initiated.','2','transactions','2025-10-06 14:10:15','2025-10-06 14:10:15'),(5,'Supplier has been successfully engaged.','2','transactions','2025-10-06 15:10:00','2025-10-06 15:10:00'),(6,'BAC evaluation has been successfully completed.','2','transactions','2025-10-06 15:10:47','2025-10-06 15:10:47'),(7,'Procurement details have been finalized.','2','transactions','2025-10-06 15:10:09','2025-10-06 15:10:09'),(8,'Executive approval has been granted.','2','transactions','2025-10-06 15:10:39','2025-10-06 15:10:39'),(9,'The award has been successfully prepared.','2','transactions','2025-10-07 07:10:19','2025-10-07 07:10:19'),(10,'New remark is added under 1!','1','remarks','2025-10-07 10:10:01','2025-10-07 10:10:01'),(11,'New remark is added under 2!','2','remarks','2025-10-07 10:10:01','2025-10-07 10:10:01'),(12,'New remark is added under 1!','1','remarks','2025-10-07 10:10:41','2025-10-07 10:10:41'),(13,'New remark is added under 2!','2','remarks','2025-10-07 10:10:41','2025-10-07 10:10:41'),(14,'New remark is added under 1!','1','remarks','2025-10-07 13:10:45','2025-10-07 13:10:45'),(15,'New remark is added under 1!','1','remarks','2025-10-07 13:10:36','2025-10-07 13:10:36'),(16,'New remark is added under 1!','1','remarks','2025-10-07 15:10:12','2025-10-07 15:10:12'),(17,'New remark is added under 2!','2','remarks','2025-10-07 15:10:12','2025-10-07 15:10:12'),(18,'The Purchase Order has been successfully prepared.','2','transactions','2025-10-07 15:10:07','2025-10-07 15:10:07'),(19,'New remark is added under 2!','2','remarks','2025-10-07 15:10:49','2025-10-07 15:10:49'),(20,'Final review has been successfully completed.','2','transactions','2025-10-08 09:10:49','2025-10-08 09:10:49'),(21,'Funds allocation has been successfully completed.','2','transactions','2025-10-08 09:10:23','2025-10-08 09:10:23'),(22,'Obligation request has been successfully processed.','2','transactions','2025-10-08 09:10:08','2025-10-08 09:10:08'),(23,'Executive sign-off has been successfully completed.','2','transactions','2025-10-08 09:10:56','2025-10-08 09:10:56'),(24,'Delivery preparation has been successfully completed.','2','transactions','2025-10-08 09:10:52','2025-10-08 09:10:52'),(25,'Delivery approval has been successfully granted.','2','transactions','2025-10-08 09:10:47','2025-10-08 09:10:47'),(26,'Delivery has been successfully confirmed.','2','transactions','2025-10-09 08:10:50','2025-10-09 08:10:50'),(27,'Inspection has been successfully scheduled.','2','transactions','2025-10-09 09:10:55','2025-10-09 09:10:55'),(28,'Inspection has been successfully completed.','2','transactions','2025-10-09 15:10:18','2025-10-09 15:10:18'),(29,'New remark is added under 2!','2','remarks','2025-10-09 15:10:17','2025-10-09 15:10:17'),(30,'End-User has successfully accepted the delivery.','2','transactions','2025-10-10 07:10:47','2025-10-10 07:10:47'),(31,'Documentation has been successfully prepared.','2','transactions','2025-10-10 07:10:58','2025-10-10 07:10:58'),(32,'Final acceptance has been successfully recorded.','2','transactions','2025-10-13 07:10:49','2025-10-13 07:10:49');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remarks`
--

DROP TABLE IF EXISTS `remarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remarks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` tinytext,
  `user` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `refid` varchar(45) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `dueDate` timestamp NULL DEFAULT NULL,
  `assignedto` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=armscii8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remarks`
--

LOCK TABLES `remarks` WRITE;
/*!40000 ALTER TABLE `remarks` DISABLE KEYS */;
INSERT INTO `remarks` VALUES (1,'Out of Office','justtest','success','2','2025-10-03 05:10:45','2025-10-03 05:10:45',NULL),(2,'Out of Office','justtest','success','2','2025-10-03 05:10:36','2025-10-03 05:10:36',NULL),(3,'Out of Office','justtest','success','2','2025-10-06 06:10:20','2025-10-06 06:10:20',NULL),(4,'Out of Office','justtest','success','2','2025-10-06 06:10:56','2025-10-06 06:10:56',NULL),(5,'Out of Office','justtest','success','2','2025-10-06 06:10:07','2025-10-06 06:10:07',NULL),(6,'Out of Office','justtest','success','2','2025-10-06 06:10:15','2025-10-06 06:10:15',NULL),(7,'Out of Office','justtest','success','2','2025-10-06 07:25:00',NULL,NULL),(8,'Out of Office','justtest','success','2','2025-10-06 07:25:47',NULL,NULL),(9,'Out of Office','justtest','success','2','2025-10-06 07:55:09',NULL,NULL),(10,'Out of Office','justtest','success','2','2025-10-06 07:55:39',NULL,NULL),(11,'Out of Office','justtest','success','2','2025-10-06 23:56:19',NULL,NULL),(12,'Received','pmed_admin','primary','[\"1\",\"2\"]',NULL,'2025-10-07 02:10:21','1'),(13,'Received','pmed_admin','primary','[\"1\",\"2\"]',NULL,'2025-10-07 02:10:37','1'),(14,'Received','pmed_admin','primary','[\"1\",\"2\"]',NULL,'2025-10-07 02:10:01','1'),(15,'Received',NULL,'primary','[\"1\",\"2\"]',NULL,'2025-10-07 02:10:41','pmed_admin'),(16,'Weeeee',NULL,'primary','[\"1\"]',NULL,'2025-10-07 05:10:45','pmed_admin'),(17,'asdwwww',NULL,'primary','[\"1\"]',NULL,'2025-10-07 05:10:36','pmed_admin'),(18,'Received lage',NULL,'primary','[\"1\",\"2\"]',NULL,'2025-10-07 07:10:12','pmed_admin'),(19,'Out of Office','pmed_admin','success','2','2025-10-07 07:34:07',NULL,NULL),(20,'Ambot lang',NULL,'primary','[\"2\"]',NULL,'2025-10-07 07:10:49','pmed_admin'),(21,'Out of Office','justtest','success','2','2025-10-08 01:06:49',NULL,NULL),(22,'Out of Office','justtest','success','2','2025-10-08 01:08:23',NULL,NULL),(23,'Out of Office','justtest','success','2','2025-10-08 01:15:08',NULL,NULL),(24,'Completing the attachments',NULL,'success','[\"2\"]',NULL,'2025-10-09 07:10:16','984');
/*!40000 ALTER TABLE `remarks` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `sessions` VALUES ('9vzLmzPS2IldSOT_FMJbdxC9nP7_iblK',1760403868,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"employeeid\":984,\"firstname\":\"Joegie\",\"lastname\":\"Wagwag\",\"middlename\":\"Paquibot\",\"extname\":null,\"birthdate\":\"1993-10-07T16:00:00.000Z\",\"experience\":\"{\\\"lists\\\": [{\\\"office\\\": \\\"DA RFO7\\\", \\\"salary\\\": \\\"25232.61\\\", \\\"status\\\": true, \\\"enddate\\\": \\\"present\\\", \\\"section\\\": \\\"SDS\\\", \\\"division\\\": \\\"ICTD\\\", \\\"position\\\": \\\"Data Controller IV\\\", \\\"startdate\\\": \\\"2024-05-01\\\", \\\"employment\\\": \\\"Contract of Service (COS)\\\", \\\"arrangements\\\": \\\"On-site\\\"}]}\",\"contacts\":\"{\\\"email\\\": \\\"\\\", \\\"mobile\\\": \\\"\\\"}\",\"others\":\"{\\\"gender\\\": \\\"n/a\\\", \\\"civilstatus\\\": \\\"single\\\"}\",\"username\":\"justtest\",\"password\":\"$2b$08$n.5Nb4Nyq92fwZAOH6iOge5naX.jbi9XEzZDkWkn8x3NCa6ojzV8q\",\"roles\":\"[\\\"SuperAdmin\\\"]\",\"components\":\"[\\\"Transactions\\\", \\\"Employees\\\",\\\"Documents\\\"]\"},\"isAuthenticated\":true,\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1c3R0ZXN0IiwiaWF0IjoxNzYwMzEyNjQ3LCJleHAiOjE3NjAzMTYyNDd9.uWVUVv05PavhxKHaSeQMgvJL7dmJNhPp-K40n8cki_4\",\"isGuest\":false}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `transid` VALUES (1,NULL,NULL,'2025-10-03 09:10:35','66666','Food & Accommodation','A. Maribojoc / W. Wrongrammer','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}',NULL,NULL,'[{\"amount\": \"22,222\", \"section\": \"SAAD\", \"division\": \"FOD\"}, {\"amount\": \"11,111\", \"section\": \"RICE\", \"division\": \"FOD\"}, {\"amount\": \"33,333\", \"section\": \"CORN\", \"division\": \"FOD\"}]','BAC 1','Food and Accommodation during the conduct of the SAAD Program 1st Quarter Regional Assessment in Siquijor','{\"message\":\"Created Transaction\"}'),(2,NULL,NULL,'2025-10-03 09:10:58','13666','Food & Accommodation','A. Maribojoc / W. Wrongrammer','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}',NULL,NULL,'[{\"amount\": \"11,111\", \"section\": \"IPPTS\", \"division\": \"ICTD\"}, {\"amount\": \"2,222\", \"section\": \"NUPAP\", \"division\": \"FOD\"}, {\"amount\": \"333\", \"section\": \"SAAD\", \"division\": \"FOD\"}]','BAC 1','Food and Accommodation during the conduct of the SAAD Program 2nd Quarter Regional Assessment in Bohol','{\"message\":\"Created Transaction\"}');
/*!40000 ALTER TABLE `transid` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transid_activity`
--

LOCK TABLES `transid_activity` WRITE;
/*!40000 ALTER TABLE `transid_activity` DISABLE KEYS */;
INSERT INTO `transid_activity` VALUES (1,1,2,'pending',NULL,NULL,NULL,116,NULL,NULL,'2025-10-03 13:04:52'),(2,2,2,'approved','The Purchase Request has been successfully forwarded to the next approver.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-03 13:08:45',116,NULL,NULL,'2025-10-03 13:04:52'),(3,2,3,'approved','Funds availability has been approved.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-03 13:16:36',NULL,NULL,NULL,'2025-10-03 13:08:45'),(4,2,4,'approved','The Annual Procurement Plan has been successfully validated.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 14:24:20',NULL,NULL,NULL,'2025-10-03 13:16:36'),(5,2,5,'approved','BAC Secretariat has completed the review.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 14:29:56',NULL,NULL,NULL,'2025-10-06 14:24:20'),(6,2,6,'approved','Quotation form has been successfully prepared.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 14:42:07',NULL,NULL,NULL,'2025-10-06 14:29:56'),(7,2,7,'approved','Canvassing has been successfully initiated.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 14:45:15',NULL,NULL,NULL,'2025-10-06 14:42:07'),(8,2,8,'approved','Supplier has been successfully engaged.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 15:25:00',NULL,NULL,NULL,'2025-10-06 14:45:15'),(9,2,9,'approved','BAC evaluation has been successfully completed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 15:25:47',NULL,NULL,NULL,'2025-10-06 15:25:00'),(10,2,10,'approved','Procurement details have been finalized.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 15:55:09',NULL,NULL,NULL,'2025-10-06 15:25:47'),(11,2,11,'approved','Executive approval has been granted.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-06 15:55:39',NULL,NULL,NULL,'2025-10-06 15:56:09'),(12,2,12,'approved','The award has been successfully prepared.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-07 07:56:18',NULL,NULL,NULL,'2025-10-06 15:56:39'),(13,2,13,'approved','The Purchase Order has been successfully prepared.','{\"employeeid\":71001,\"name\":\"Admin S PMED\"}','2025-10-07 15:34:07',71001,NULL,NULL,'2025-10-07 07:57:19'),(20,2,14,'approved','Final review has been successfully completed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-08 09:06:49',NULL,NULL,NULL,'2025-10-07 15:35:07'),(21,2,15,'approved','Funds allocation has been successfully completed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-08 09:08:23',NULL,NULL,NULL,'2025-10-08 09:07:49'),(22,2,16,'approved','Obligation request has been successfully processed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-08 09:15:08',NULL,NULL,NULL,'2025-10-08 09:09:23'),(23,2,17,'approved','Executive sign-off has been successfully completed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-08 09:25:56',NULL,NULL,NULL,'2025-10-08 09:16:08'),(24,2,18,'approved','Delivery preparation has been successfully completed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-08 09:26:52',NULL,NULL,NULL,'2025-10-08 09:26:56'),(25,2,19,'approved','Delivery approval has been successfully granted.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-08 09:27:47',NULL,NULL,NULL,'2025-10-08 09:27:52'),(26,2,20,'approved','Delivery has been successfully confirmed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-09 08:52:50',NULL,NULL,NULL,'2025-10-08 09:28:47'),(27,2,21,'approved','Inspection has been successfully scheduled.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-09 09:02:55',NULL,NULL,NULL,'2025-10-09 08:53:50'),(28,2,22,'approved','Inspection has been successfully completed.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-09 15:04:18',NULL,NULL,NULL,'2025-10-09 09:03:55'),(29,2,23,'approved','End-User has successfully accepted the delivery.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-10 07:50:47',NULL,NULL,NULL,'2025-10-09 15:05:18'),(30,2,24,'approved','Documentation has been successfully prepared.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-10 07:50:58',NULL,NULL,NULL,'2025-10-10 07:51:47'),(31,2,25,'approved','Final acceptance has been successfully recorded.','{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}','2025-10-13 07:51:49',NULL,NULL,NULL,'2025-10-10 07:51:58'),(32,2,26,'pending',NULL,'{\"employeeid\":984,\"name\":\"Joegie P Wagwag\"}',NULL,NULL,NULL,NULL,'2025-10-13 07:52:49');
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

-- Dump completed on 2025-10-13  9:04:32
