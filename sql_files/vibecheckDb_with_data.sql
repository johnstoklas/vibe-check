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
INSERT INTO `accounts` VALUES (1,1,'Pr0fessionalBum','$2b$10$ZcZvVo0X1WBncSMwtVrjXOF1cTO4d5BS1uSvwLxWQOQd/WmNafGze','testuser@example.com');
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
INSERT INTO `character_traits` VALUES (7,1),(14,1),(1,2),(4,2),(10,2),(13,2),(16,2),(2,3),(16,3),(6,4),(8,4),(9,4),(11,4),(12,4),(17,4),(18,4),(1,5),(16,5),(19,5),(2,6),(3,6),(7,6),(9,6),(12,6),(18,6),(8,7),(10,7),(14,7),(3,8),(6,8),(19,8),(1,10),(3,10),(5,10),(7,10),(11,10),(12,10),(15,10),(20,10),(17,11),(18,12),(19,12),(20,12),(8,13),(11,13),(13,13),(17,13),(4,14),(15,14),(5,16),(6,16),(10,16),(13,16),(15,16),(20,16),(2,18),(4,18),(5,18),(9,18),(14,18);
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
  PRIMARY KEY (`characterid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,'Athenodoros Mattathias',1),(2,'Ulysses Rubio',1),(3,'Louella Jarvis',1),(4,'Anita Wiggins',1),(5,'Amelia Mclean',1),(6,'Patrica Riley',1),(7,'Aline Herrera',1),(8,'Garth Harris',2),(9,'Royal Henderson',2),(10,'Randi Rosales',2),(11,'Darrell Powers',2),(12,'Elwood Fuller',2),(13,'Connie Banks',2),(14,'Melody Copeland',3),(15,'Julie Roberson',3),(16,'Andy Russell',3),(17,'Augustine Hubbard',3),(18,'Herbert Nelson',3),(19,'Jacinto Ramos',3),(20,'Dr. Horn',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,1,0,0,NULL),(2,1,0,0,NULL),(3,1,0,0,NULL);
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
INSERT INTO `sessions` VALUES ('7mmFpZpqQqqUhob-fA0DXFStwS4rdzGV',1743797749,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":false}'),('ADCdU8jkz0Vqg1LK40KXAW8FoFY4WIIg',1743819254,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}'),('JiUoWvgFIymlt3NADaUafg8uBh7q_Kim',1743819458,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}'),('SyrbXQ2sMs3A8zYKMwgIOxna1R5PlsVx',1743819911,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}'),('V4_DWn9dY3yRnbfxK_k1MYP7gOZsS5jm',1743823615,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}'),('VkQTsJ0Wp_5k70JSaCyaDl_Y3bVyuyo7',1743796672,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":false}'),('c3NQDYFSf0Fc2v0ThruHMwn8inJmgblb',1743819993,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}'),('fz8Zi4J5Zsh5K2DM7AOIqAhaAObNPjca',1743797464,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":false}'),('iypW7wSSXTZC-hEaG8gPuqCWmeXtFews',1743823776,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}'),('lMWcDGO0DPFSB7DjSVdey57tN9vl8dRJ',1743797987,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"Pr0fessionalBum\",\"isAdmin\":true}');
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
  `userid` int NOT NULL,
  `characterid` int NOT NULL,
  PRIMARY KEY (`userid`,`characterid`),
  KEY `characterid` (`characterid`),
  CONSTRAINT `unlocked_characters_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `accounts` (`userid`),
  CONSTRAINT `unlocked_characters_ibfk_2` FOREIGN KEY (`characterid`) REFERENCES `characters` (`characterid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unlocked_characters`
--

LOCK TABLES `unlocked_characters` WRITE;
/*!40000 ALTER TABLE `unlocked_characters` DISABLE KEYS */;
INSERT INTO `unlocked_characters` VALUES (1,1);
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

-- Dump completed on 2025-04-03 22:35:29
