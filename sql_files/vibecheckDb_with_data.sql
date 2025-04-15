CREATE DATABASE  IF NOT EXISTS `vibecheck` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vibecheck`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: vibecheck
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `admin` tinyint(1) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,0,'ChrisChan','$2b$10$JXuFJVoWpUEd4uLd59y/EOusODfJR3Ho2usCFPQZiJENGUNNz3m.a','sonichu4life@limewire.com');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `character_traits`
--

DROP TABLE IF EXISTS `character_traits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `character_traits` (
  `characterid` int NOT NULL,
  `trait_id` int NOT NULL,
  PRIMARY KEY (`characterid`,`trait_id`),
  KEY `trait_id` (`trait_id`),
  CONSTRAINT `character_traits_ibfk_1` FOREIGN KEY (`characterid`) REFERENCES `characters` (`characterid`),
  CONSTRAINT `character_traits_ibfk_2` FOREIGN KEY (`trait_id`) REFERENCES `traits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `character_traits`
--

LOCK TABLES `character_traits` WRITE;
/*!40000 ALTER TABLE `character_traits` DISABLE KEYS */;
INSERT INTO `character_traits` VALUES (7,1),(14,1),(1,2),(4,2),(10,2),(13,2),(16,2),(2,3),(6,3),(9,3),(12,3),(16,3),(18,3),(8,4),(11,4),(17,4),(1,5),(16,5),(18,5),(19,5),(3,6),(7,6),(9,6),(12,6),(8,7),(10,7),(14,7),(19,7),(3,8),(6,8),(3,9),(5,9),(15,9),(20,9),(1,10),(7,10),(11,10),(12,10),(2,11),(17,11),(18,12),(19,12),(20,12),(8,13),(11,13),(13,13),(17,13),(4,14),(13,14),(15,14),(15,15),(20,15),(2,16),(5,16),(6,16),(10,16),(4,17),(2,18),(5,18),(9,18),(14,18);
/*!40000 ALTER TABLE `character_traits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `characters` (
  `characterid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `difficulty` int DEFAULT NULL,
  `characterimage` longblob,
  PRIMARY KEY (`characterid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,'Athenodoros Mattathias',1,NULL),(2,'Ulysses Rubio',1,NULL),(3,'Louella Jarvis',1,NULL),(4,'Anita Wiggins',1,NULL),(5,'Amelia Mclean',1,NULL),(6,'Patrica Riley',1,NULL),(7,'Aline Herrera',1,NULL),(8,'Garth Harris',2,NULL),(9,'Royal Henderson',2,NULL),(10,'Randi Rosales',2,NULL),(11,'Darrell Powers',2,NULL),(12,'Elwood Fuller',2,NULL),(13,'Connie Banks',2,NULL),(14,'Melody Copeland',3,NULL),(15,'Julie Roberson',3,NULL),(16,'Andy Russell',3,NULL),(17,'Augustine Hubbard',3,NULL),(18,'Herbert Nelson',3,NULL),(19,'Jacinto Ramos',3,NULL),(20,'Dr. Horn',3,NULL);
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `gameid` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `topscore` int DEFAULT NULL,
  `topmoney` int DEFAULT NULL,
  `dateachived` date DEFAULT NULL,
  PRIMARY KEY (`gameid`),
  KEY `userid` (`userid`),
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `accounts` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,1,0,0,NULL),(2,1,0,0,NULL),(3,1,0,0,NULL),(4,2,0,0,NULL),(5,3,0,0,NULL),(6,1,0,0,NULL);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
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
INSERT INTO `sessions` VALUES ('1IBXro8v50IOzMV6CeiAQATFxSMU8Fbt',1744760304,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"User not found.\"}'),('1uX7_KoAy8JKX1gNAAj38Zrt8x1xR5ji',1744762739,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('2R6DjovHvxLzFFLmoeNfdJK0eYwTYqd9',1744760677,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":2,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('2SxAoKOKkWnFKcCnIksp-QHZQ_Gc7xYn',1744764219,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('2hO-o7AKhR7Rr1YN-ZbtacnbvV2P5ial',1744757103,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('4k-5QOvdMUwS_GT2lbP0FIcbidILyyrH',1744759750,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"User not found.\"}'),('58lsNG3TepvX9L8CHewwLaKxWqbp84OQ',1744762449,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('5lgfooGypvgmEntJYIaLe_YcftaaivMg',1744762170,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('92lklf_MT2HZZB0C-vOMAO-4PqpMIev7',1744759918,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"User not found.\"}'),('D5cSfNOSZASqqUgCsIT6Z0q3l6yUKNzB',1744763216,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('D9DJlb47S8cJkAuKcwNFQqyfEsvIdqOX',1744762752,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('DeiE_Lir_UkSsLHKV7CIzxU9AvRi42k-',1744759852,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"User not found.\"}'),('DxeKDDyc3fNsB934VTsJJLoYfYcth1js',1744762593,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('E6KMZK4jGTqMNNphoUbQ9n1z9KwQ9GCV',1744764757,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('FEJUnSMpJt6Qv4I4G2reBYo9wDpw5sJP',1744760719,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":2,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('FgyDKGS3-NmttpxMWwC-hLbkSVPnYvqs',1744761139,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('I808fAVt0AnqDgn6CIGI8ysPXAbqmJzg',1744763148,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('KCGwDeF1ZLQduVF80GV5KCGGJ9bcMVzZ',1744764451,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('Ru2cnMs_W1yV7vJg5WnDzqjaW1NHk-JV',1744760919,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":2,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('SCA1AbH0S5QpRrEExEmJdxjPB9K4pKmK',1744757103,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"Account with that email already exists.\"}'),('SjMIx-lXKXuPXe0_HmuhKsEdZmJ8uRat',1744761497,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('_ElOqMiVoe3dBTZbtTWXwCcqqbyFT2C1',1744760678,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":2,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('bOeCPtU73CWTQaecY6GxRhHij5NYu_RK',1744761291,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('cLUDIdJNZ3YLoQfAFfMn4GYCX6v29oAA',1744762593,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}'),('etlYYoQ_nWCYOHN1wzIJufWJXMUpmAhU',1744760146,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"User not found.\"}'),('gzi60n511s4fGSGS0Q4sjQbQsc65d4Dp',1744762102,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('hdVPyxCGKlMseBiidbPP6Kt4-zib81Wf',1744759930,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"User not found.\"}'),('m42Dybhm_Zkyh0uNFx9ph9wO2hW2oFS4',1744760332,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":true,\"alertMessage\":\"User not found.\"}'),('mWSxFO2gp-wJW-QHAaZRlYFHegpM4hNj',1744763299,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('n3ySrJgmEs_oViZvQIecrPRyS7bHgxiC',1744760966,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":2,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('nVy23g9sU8r6M2zs4B43oLNAqQMISr8w',1744762586,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('oHmbb0dlw1Qt7UICaUWmfLcXiVhJrYbD',1744761245,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('qcKUlriTt70TEIo-sF6yWTnpGPnnts7q',1744764696,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('s0b-Zz6HeC2FkFKkCgoLHGdjmMZZfr5t',1744760469,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":2,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('w9gYRH2b5rw8r3-ClU0QCX-vGVfnwZFd',1744762924,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('xM2NR7fw32qrnT4rI8TBs6529dd2ntin',1744762694,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('yr1psbq0RqKtUDvXi5Tz_ovgY6reWWmj',1744761140,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('zTMUtJPTLUtQfoRnIIawbS-WwZRVuHnb',1744761477,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":3,\"username\":\"ChrisChan\",\"isAdmin\":false}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traits`
--

DROP TABLE IF EXISTS `traits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trait_name` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `goodtrait` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traits`
--

LOCK TABLES `traits` WRITE;
/*!40000 ALTER TABLE `traits` DISABLE KEYS */;
INSERT INTO `traits` VALUES (1,'Food',0),(2,'Food',1),(3,'Small Gift',0),(4,'Small Gift',1),(5,'Compliments',0),(6,'Compliments',1),(7,'Invite Out',0),(8,'Invite Out',1),(9,'Help at Work',0),(10,'Help at Work',1),(11,'Large Gift',0),(12,'Large Gift',1),(13,'Getting Drive',0),(14,'Getting Drive',1),(15,'Help with Groceries',0),(16,'Help with Groceries',1),(17,'Surprise',0),(18,'Surprise',1);
/*!40000 ALTER TABLE `traits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unlocked_characters`
--

DROP TABLE IF EXISTS `unlocked_characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unlocked_characters` (
  `unlock_id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `characterid` int NOT NULL,
  PRIMARY KEY (`unlock_id`),
  KEY `userid` (`userid`),
  KEY `characterid` (`characterid`),
  CONSTRAINT `fk_unlocked_character` FOREIGN KEY (`characterid`) REFERENCES `characters` (`characterid`),
  CONSTRAINT `fk_unlocked_user` FOREIGN KEY (`userid`) REFERENCES `accounts` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unlocked_characters`
--

LOCK TABLES `unlocked_characters` WRITE;
/*!40000 ALTER TABLE `unlocked_characters` DISABLE KEYS */;
INSERT INTO `unlocked_characters` VALUES (1,1,1),(2,1,1),(3,1,2),(4,1,3),(5,1,4),(6,1,5),(7,1,6),(8,1,7),(9,1,8);
/*!40000 ALTER TABLE `unlocked_characters` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-14 19:55:59
