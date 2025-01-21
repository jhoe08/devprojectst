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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-21 13:24:20
