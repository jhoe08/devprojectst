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
INSERT INTO `guest_accounts` VALUES ('04072183-786d-4d33-a541-7a2f1adc94f4','2025-10-29 02:01:03','2025-10-29 03:01:03','active','{\"ip\": \"172.16.1.43\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2025-10-29 10:01:03\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0\"}'),('04ac9727-c917-4aa6-b624-cea29d3f2206','2025-10-29 02:01:55','2025-10-29 02:46:37','used','{\"ip\": \"172.16.1.26\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0\", \"logout_time\": \"2025-10-29 10:46:37\"}'),('1e465929-5dc7-461e-8660-de1806b6878f','2025-10-27 06:08:44','2025-10-27 08:03:49','used','{\"ip\": \"127.0.0.1\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-27 16:03:49\"}'),('25f7bdc0-d0bd-466e-8b4b-9649d3d1f412','2026-03-26 00:52:54','2026-03-26 01:52:54','active','{\"ip\": \"172.19.51.121\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2026-03-26 08:52:54\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0\"}'),('3066482b-0c59-46e5-b153-7c8ec7d26a6d','2025-10-29 05:29:11','2025-10-29 06:29:11','active','{\"ip\": \"172.16.0.235\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2025-10-29 13:29:11\", \"user_agent\": \"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36\"}'),('3e4c6892-526b-4a4b-94a6-75b4cd4f9b58','2026-03-26 00:56:37','2026-03-26 01:56:37','active','{\"ip\": \"172.19.152.62\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2026-03-26 08:56:37\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36\"}'),('407596bf-67e8-408f-b001-273716d649f5','2025-10-29 02:02:23','2025-10-29 02:03:06','used','{\"ip\": \"172.16.1.66\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-29 10:03:06\"}'),('4e92005c-ef6b-4028-9199-fdb660cee012','2025-10-29 01:59:21','2025-10-29 01:59:51','used','{\"ip\": \"172.16.1.66\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-29 09:59:51\"}'),('5541e642-3d0d-489f-9d3b-4b3dec8bb42d','2025-10-29 02:01:20','2025-10-29 02:01:40','used','{\"ip\": \"172.16.1.66\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-29 10:01:40\"}'),('927a6144-c956-46bf-a510-b3de22d5df62','2025-10-29 02:47:37','2025-10-29 02:47:53','used','{\"ip\": \"172.16.0.167\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-29 10:47:53\"}'),('b1050ef7-43b8-4267-b78e-fda974962026','2026-03-26 00:56:07','2026-03-26 01:56:07','active','{\"ip\": \"172.19.233.71\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2026-03-26 08:56:07\", \"user_agent\": \"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36\"}'),('c2d76bed-c00c-4aab-a7f4-5241359ac92e','2026-03-26 01:05:48','2026-03-26 02:05:48','active','{\"ip\": \"172.19.89.237\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2026-03-26 09:05:48\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0\"}'),('ddfbda6c-dcba-4f8e-803a-b4d92e959419','2026-03-26 00:53:04','2026-03-26 01:53:04','active','{\"ip\": \"172.19.89.237\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2026-03-26 08:53:04\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0\"}'),('ed39f305-43a2-4a29-9854-49a054d44f44','2025-10-29 02:47:24','2025-10-29 02:47:31','used','{\"ip\": \"172.16.0.167\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-29 10:47:31\"}'),('eda7ee2a-e3a0-4347-9bda-840e73250180','2025-10-29 00:19:24','2025-10-29 00:22:54','used','{\"ip\": \"127.0.0.1\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-29 08:22:54\"}'),('eff99f28-80be-4812-9e56-a55d24a95989','2025-10-01 06:12:20','2025-10-01 06:22:15','used','{\"ip\": \"127.0.0.1\", \"remarks\": \"Guest manually logged out\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\", \"logout_time\": \"2025-10-01 14:22:15\"}'),('f95541a4-7de1-4cea-b16d-6943cdb0f017','2025-12-12 07:33:05','2025-12-12 08:33:05','active','{\"ip\": \"127.0.0.1\", \"origin\": \"guest_account_link\", \"remarks\": \"Auto-login via token\", \"login_time\": \"2025-12-12 15:33:05\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36\"}');
/*!40000 ALTER TABLE `guest_accounts` ENABLE KEYS */;
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
