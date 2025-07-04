CREATE DATABASE  IF NOT EXISTS `vibecheck` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vibecheck`;
-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (x86_64)
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,0,'ChrisChan','$2b$10$JXuFJVoWpUEd4uLd59y/EOusODfJR3Ho2usCFPQZiJENGUNNz3m.a','sonichu4life@limewire.com'),(2,0,'mhetler','$2b$10$UvWbrVahA0zTooh5xV/YB.HIQAd3t7OJCPaD6HDDPwyMfsw5YIdsC','mhetler@trinity.edu');
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
-- Table structure for table `Characters`
--

DROP TABLE IF EXISTS `Characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Characters` (
  `characterid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `difficulty` int DEFAULT NULL,
  `characterimage` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`characterid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Characters`
--

LOCK TABLES `Characters` WRITE;
/*!40000 ALTER TABLE `Characters` DISABLE KEYS */;
INSERT INTO `Characters` VALUES (1,'Athenodoros Mattathias',1,'/images/character_images/A_Mattathias.png','Athenodoros loves food and lending a hand at work, but isn\"t a fan of receiving compliments.'),(2,'Ulysses Rubio',1,'/images/character_images/U_Rubio.png','Ulysses is full of surprises and loves helping with groceries, but dislikes small and large gifts.'),(3,'Louella Jarvis',1,'/images/character_images/L_Jarvis.png','Louella enjoys compliments and being invited out, though she\"s not a fan of working too hard.'),(4,'Anita Wiggins',1,'/images/character_images/A_Wiggins.png','Anita is a foodie who loves spontaneous drives, but isn\"t impressed by surprises.'),(5,'Amelia Mclean',1,'/images/character_images/A_Mclean.png','Amelia thrives on surprises and helping others with groceries, though she\"d rather avoid heavy work.'),(6,'Patrica Riley',1,'/images/character_images/P_Riley.png','Patrica loves helping with groceries and being invited out, but doesn\"t appreciate small gifts.'),(7,'Aline Herrera',1,'/images/character_images/A_Herrera.png','Aline finds joy in compliments and work achievements but isn\"t exactly a foodie.'),(8,'Garth Harris',2,'/images/character_images/G_Harris.png','Garth values a thoughtful small gift, though he dislikes being invited out or asked to drive.'),(9,'Royal Henderson',2,'/images/character_images/R_Henderson.png','Royal is someone who enjoys both compliments and surprises but prefers to skip the small gifts.'),(10,'Randi Rosales',2,'/images/character_images/R_Rosales.png','Randi loves good food and helping others, but isn\"t the biggest fan of being invited out.'),(11,'Darrell Powers',2,'/images/character_images/D_Powers.png','Darrell enjoys helping at work and giving small gifts but doesn\"t like getting dragged into long drives.'),(12,'Elwood Fuller',2,'/images/character_images/E_Fuller.png','Elwood enjoys helping out and receiving compliments, but isn\"t thrilled by small gifts.'),(13,'Connie Banks',2,'/images/character_images/C_Banks.png','Connie is a big foodie who has a mixed relationship with driving — sometimes loving it, sometimes not!'),(14,'Melody Copeland',3,'/images/character_images/M_Copeland.png','Melody loves surprises but isn\"t fond of food-centric outings or being invited out.'),(15,'Julie Roberson',3,'/images/character_images/J_Roberson.png','Julie is always up for a drive but avoids hard work and helping out with chores.'),(16,'Andy Russell',3,'/images/character_images/A_Russell.png','Andy is all about good food but doesn’t really like compliments or small gifts.'),(17,'Augustine Hubbard',3,'/images/character_images/A_Hubbard.png','Augustine appreciates a thoughtful small gift but dislikes big gifts and long drives.'),(18,'Herbert Nelson',3,'/images/character_images/H_Nelson.png','Herbert enjoys big, grand gestures (large gifts!) but dislikes small gifts and compliments.'),(19,'Jacinto Ramos',3,'/images/character_images/J_Ramos.png','Jacinto loves large gifts but doesn\"t like being invited out or receiving compliments.'),(20,'Dr. Horn',3,'/images/character_images/Dr_Horn.png','Dr. Horn is all about grand gifts but prefers not to help with chores or workplace activities.');
/*!40000 ALTER TABLE `Characters` ENABLE KEYS */;
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
  PRIMARY KEY (`gameid`),
  KEY `userid` (`userid`),
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `accounts` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (4,2,0,0),(5,3,0,0),(75,1,2000,5000),(76,2,0,0),(78,2,100,100),(79,2,25,0),(80,2,35,15);
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
INSERT INTO `sessions` VALUES ('1EOdudKGSkGi7v58R9V4kNfD1tWrvpKc',1745862659,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('1Wo4wmjThNvg6vCv7uyzY4msR6zxIfVB',1745863617,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('222ifRaf46LG47DWeVqrurHGVZucHOxY',1745857707,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('2trqiXBCLPSGptzjQNSGD-mLD8Fw8os-',1745862827,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('3ElwIOMvx37Fg3r3ClN5hCB_NIRrid75',1745862646,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('3GAjrekyxK5bl6uQFDBC-UqhwaRUjTqr',1745863149,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('3_PctTtluBcOAFfmgiU-AQxptDqlwyJZ',1745862129,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('4KLL7nuNCXSIWr85SIoOjpIycVKbGIvq',1745863357,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('4Z6Viq1Bfxzh6cpqN7yQwATFCxY-RR45',1745862057,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('4wgJUQhLu0j7hkYv45SSUWySRE8fSyue',1745935025,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":2,\"username\":\"mhetler\",\"isAdmin\":false}'),('5N14Lc6Yfbt-QzIjZ9q-nntU0Ab9AC1V',1745859421,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('7F-snZjhdmFVilwomsqSx19eQtMsm0oS',1745859554,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('8Nc2rWdZNr94dzOnRMf7dthusMqH7SQX',1745864321,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('AN3PAj0yVBrkdGWtEnMqY_zvUK9V5jK0',1745860259,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('AQdW1dRIYiOgGdCJt0HvhsXcaXwb0vyx',1745863776,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('BFJ64jD0z__p-Ei8i-BcZY8Ppz3XUnPc',1745859559,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('Co5-d6sVQPE3lXN4PEFlE_5LNaLeBIRo',1745857847,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('DBeFlLzc256mcKm21-1ktXELSr2w_Xj2',1745861988,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('DVIHi-ez-wn6KYNOcLSaeXlXZCGD6zyM',1745860082,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('E7ANpvf72hic4UFBqUmPgGV8nTugBkPM',1745862332,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('FnnkFNr6T6kD0aJz1c6i5cJA9sY1n9WG',1745862562,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('H-RefSVMSn6JmZcG9f3_rWEkJL9roIej',1745860303,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('I48BI49KWF6JX7mUV9BTHz857qU41US9',1745859079,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('I838Mc6U1U1Um1XqeMBIEIuXbLsHCoVH',1745860506,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('IBxLOXldn17zX-M6Jxmk9_QhYnqSLzMb',1745859883,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('IZC3eEaeEHX7dapyYcW0tOgPaVUkeGtH',1745858040,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('Iqnnvuej6owV3I8Wa1qZTSCUkjAynQIF',1745858684,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('JPC_f668Xq6Tf45NQ5t3X_84ewTX0LHV',1745864359,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('K3qX2G-NfrR4jBX1nDKS4Ps8AyAOgc9H',1745864551,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('K5E5P0CTHHScdOiHkfB_W1UB8aC82i6d',1745860119,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('L3BuhnenVQoGXGbfK8USpC7EdhY8Dpgs',1745864455,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('LWIG1Np94-P0ZkcwFPrPnTj91HXhAuKL',1745859351,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('M8wrntQipCd141jHY_-c_SStjRx2evqk',1745860258,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('MEPHWh0eshBVrGTIyeaZFPZ5-PwQBtK1',1745863287,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('NmFpfrR4yc05tqQwVxJa_20cASx69EPF',1745862597,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('OAsly9CxEi5OFmDpQQQ44Jh3w6EYVwmf',1745863103,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('QIMcTjjLj5dWVJvHiPp8AqnRtRFjroAJ',1745859308,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('R4nh1CvAw7YE7ABQWymMICoGiGLaf9RP',1745858927,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('SL7Ebwkn9wJMaeSFilndM1ncYSBNM85n',1745860372,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('Tex3Pzfa1Rc7kOjzRarw43XTrZPuJ-OW',1745860092,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('TkajmQDWHbJoLX_F6BOKmtHZNeu0M9iB',1745863458,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('Uy4wb2-NoJbgrFu52WoKDtK0LltVArHo',1745859573,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false,\"showAlert\":false,\"alertMessage\":\"No alert required!\"}'),('VNCcBoKCC4D0cMfIB8ZoN--79HfE9_k0',1745859891,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('YIva2X9vxilSh7ql5wDEWCySRP-6A0xN',1745862549,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('YmL5jMGQWpic5CMZ7KHAw01Fng7AxsfU',1745864580,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('_06wUNkeFLt6Q52lgSiJTRIFhNBhDtRx',1745857944,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('_mbP5Uzhx2TL6HvTF3xfMhy5S7w_BNpG',1745859296,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('bJjpBXLwlY5LoGvLoylBsnyOQ3_zrz6y',1745857992,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('c50BtSqiHHG-sF_SMZlqPQtxlNr_SpHA',1745863978,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('dAUmqGp8A8saENv9re61Wh5Woeuuo9jJ',1745858669,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('deAhEfxT88isT4i0HGhmWlGwVk48uBe0',1745862783,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('dlUDAbFu9BqDVSrS93FkuY1tiu2IGcNA',1745860148,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('eQ8-tYoOmf4L13hJE1yUi4cgQ_cw60QH',1745860454,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('eVXo7Im_ssBxdzvUeLbFlVaqUWJuQh8F',1745863441,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('gr3OR5gANvbwevbC3y9W2jlYvSC8AiZh',1745862011,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('gzKb1SmTJiGtD2L-8i-SmDs8GJIJZq2f',1745859422,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('hHfsyTehd4omGY46aD5uuWcEark_FngC',1745860353,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('i2GwFeX8HTJY7dnX5CXBLyz_siOez7_m',1745863119,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('iJJ582SFxE_P57SWr5eRn9FYgMsfo3pm',1745857706,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('iRU65KCARpLp-jlg_o4HdbymJu7B5qzI',1745862549,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('isRAEBgErO2hCqSasjD_KsCVM4MHQJwb',1745861986,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('jvDrzYBw9U48j7xaq-DiBKSxmzFyvdkh',1745863274,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('kTs8fNMvC7PeP0ZDQ8mLxC5trJNKRUhd',1745858760,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('lDwJxcJlPeSyHnQ7L917HceMYVivrAhL',1745863910,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('mruvaX8AnyjqeR7vpbNiOXirbLUUZN_U',1745859870,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('pJlCz-3tyhrET_BFOCHDp6Dwh0j71yvH',1745862056,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('q4erN1raK6Y4BuyVbF_iHlwAXVRRPI-q',1745863864,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('qxAbtAgjQvPtrmLaKLgALMWweh11FjM_',1745864558,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('tZpr0WDxEBz1vevha3GUHGVXQ8mLmOFw',1745863510,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('tulvkG2sibrCKcYqyl7weed8GfNL52mz',1745863770,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('u6HpSQUCPSPflatvF2CCwwTk01vqPYlm',1745862756,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('uL22kSfXpB3tVU8N9DxcevjnrSWsJ0SX',1745863149,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('uX6q6IrGWZzFoL8rkS1CDT4zprCFn67h',1745859063,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('vEXPFl8J1kXwUIi7lnQkdFn261mDtRxi',1745862828,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('vdYVSrBLTLDI6ZuCTfhe602yKYOqHRLC',1745859103,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('y69J6q9SekJvrtzs6av2ZPGLV-z75LaL',1745860464,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('yEkc6FDWvB26dMITaJm0ixfuA6Tdblm2',1745862336,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}'),('zaylnVeDWhR-UHkCRYP2oLH9WTXcb4Gy',1745863318,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"showAlert\":false,\"alertMessage\":\"No alert required!\",\"isAuth\":true,\"accountID\":1,\"username\":\"ChrisChan\",\"isAdmin\":false}');
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
  `trait_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
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
  CONSTRAINT `fk_unlocked_user` FOREIGN KEY (`userid`) REFERENCES `accounts` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unlocked_characters`
--

LOCK TABLES `unlocked_characters` WRITE;
/*!40000 ALTER TABLE `unlocked_characters` DISABLE KEYS */;
INSERT INTO `unlocked_characters` VALUES (1,1,11),(2,1,1),(3,1,2),(4,1,3),(5,1,4),(6,1,5),(7,1,6),(8,1,7),(9,1,8),(10,2,1),(11,1,2),(12,2,2),(13,2,3),(14,2,4),(15,2,5);
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

-- Dump completed on 2025-04-28  8:59:07
