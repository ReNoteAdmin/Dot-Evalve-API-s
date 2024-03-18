-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: justevalve.mysql.database.azure.com    Database: justevalve_master
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `adminId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(20) NOT NULL,
  `profile` varchar(30) NOT NULL,
  `mobileNumber` varchar(15) NOT NULL,
  `roleId` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`adminId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `archives`
--

DROP TABLE IF EXISTS `archives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archives` (
  `archivesId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL DEFAULT '0',
  `recordId` int NOT NULL DEFAULT '0',
  `recordType` tinyint NOT NULL DEFAULT '0' COMMENT '0 = Instutute\r\n1 = student \r\n2 = teacher\r\n3 = class\r\n4 = division\r\n',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0=archive\r\n1= unarchive',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`archivesId`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `campus`
--

DROP TABLE IF EXISTS `campus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campus` (
  `campusId` int NOT NULL AUTO_INCREMENT,
  `zoneId` int NOT NULL DEFAULT '0',
  `instituteId` int NOT NULL DEFAULT '0',
  `campusName` varchar(255) DEFAULT NULL,
  `campusCode` varchar(50) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`campusId`),
  KEY `zoneId` (`zoneId`,`instituteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `state_id` mediumint unsigned NOT NULL,
  `state_code` varchar(255) NOT NULL,
  `country_id` mediumint unsigned NOT NULL,
  `country_code` char(2) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '2014-01-01 01:01:01',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `flag` tinyint(1) NOT NULL DEFAULT '1',
  `wikiDataId` varchar(255) DEFAULT NULL COMMENT 'Rapid API GeoDB Cities',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153352 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `cityId` int NOT NULL AUTO_INCREMENT,
  `stateId` int NOT NULL,
  `countryId` int NOT NULL,
  `cityName` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `upadated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`cityId`)
) ENGINE=InnoDB AUTO_INCREMENT=48316 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `classId` int NOT NULL AUTO_INCREMENT,
  `className` varchar(255) DEFAULT NULL,
  `divisionId` int NOT NULL DEFAULT '0',
  `divisionType` tinyint DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `instituteId` int NOT NULL DEFAULT '0',
  `classCode` varchar(50) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  `createdBy` int NOT NULL DEFAULT '0',
  `deletedBy` tinyint NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '1 = inactive\r\n0 = active',
  PRIMARY KEY (`classId`),
  KEY `divisionId` (`divisionId`,`divisionType`,`instituteId`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `iso3` char(3) DEFAULT NULL,
  `numeric_code` char(3) DEFAULT NULL,
  `iso2` char(2) DEFAULT NULL,
  `phonecode` varchar(255) DEFAULT NULL,
  `capital` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `currency_name` varchar(255) DEFAULT NULL,
  `currency_symbol` varchar(255) DEFAULT NULL,
  `tld` varchar(255) DEFAULT NULL,
  `native` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `subregion` varchar(255) DEFAULT NULL,
  `timezones` text,
  `translations` text,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `emoji` varchar(191) DEFAULT NULL,
  `emojiU` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `flag` tinyint(1) NOT NULL DEFAULT '1',
  `wikiDataId` varchar(255) DEFAULT NULL COMMENT 'Rapid API GeoDB Cities',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `countryId` int NOT NULL AUTO_INCREMENT,
  `countryName` varchar(100) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `upadated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`countryId`)
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `credithistory`
--

DROP TABLE IF EXISTS `credithistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credithistory` (
  `credithistoryId` int NOT NULL AUTO_INCREMENT,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `credits` int NOT NULL DEFAULT '0',
  `instituteId` int NOT NULL DEFAULT '0',
  `action` enum('CREDIT','DEBIT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `examId` int NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`credithistoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbbackup`
--

DROP TABLE IF EXISTS `dbbackup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dbbackup` (
  `dbbackupId` int NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fileName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `date` date DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`dbbackupId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `departmentId` int NOT NULL AUTO_INCREMENT,
  `campusId` int NOT NULL DEFAULT '0',
  `instituteId` int NOT NULL DEFAULT '0',
  `departmenName` varchar(255) DEFAULT NULL,
  `departmenCode` varchar(50) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`departmentId`),
  KEY `campusId` (`campusId`,`instituteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `examId` int NOT NULL AUTO_INCREMENT,
  `instituteId` int NOT NULL DEFAULT '0',
  `noOfSets` int NOT NULL DEFAULT '0',
  `rollNumberDigits` int NOT NULL DEFAULT '0',
  `structureCode` text,
  `structureType` varchar(60) DEFAULT NULL COMMENT 'division\r\nclass',
  `structureId` int NOT NULL DEFAULT '0',
  `examName` varchar(50) DEFAULT NULL,
  `examCode` varchar(60) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `pin` varchar(100) DEFAULT NULL,
  `reportMode` enum('SMS','EMAIL','APP') NOT NULL,
  `key` text,
  `sheetImage` varchar(60) DEFAULT NULL,
  `is_preset` tinyint NOT NULL DEFAULT '0',
  `templete` text COMMENT 'This is For Scanning \r\nNo messing!!!!',
  `presetName` varchar(60) DEFAULT NULL,
  `noOfScans` int NOT NULL DEFAULT '0',
  `answerKey` text,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`examId`),
  KEY `instituteId` (`instituteId`),
  KEY `is_preset` (`is_preset`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exampaper`
--

DROP TABLE IF EXISTS `exampaper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exampaper` (
  `exampaperId` int NOT NULL AUTO_INCREMENT,
  `examId` int NOT NULL DEFAULT '0',
  `studentId` int NOT NULL DEFAULT '0',
  `submittedKey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `totalQuestion` int NOT NULL DEFAULT '0',
  `totalMarks` float NOT NULL DEFAULT '0',
  `isPublished` int NOT NULL DEFAULT '0',
  `teacherId` int NOT NULL DEFAULT '0',
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`exampaperId`),
  KEY `examId` (`examId`,`studentId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `examsubject`
--

DROP TABLE IF EXISTS `examsubject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examsubject` (
  `examsubjectId` int NOT NULL AUTO_INCREMENT,
  `examId` int NOT NULL DEFAULT '0',
  `subjectName` varchar(100) DEFAULT NULL,
  `noOfSection` int NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`examsubjectId`),
  KEY `examId` (`examId`)
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `examsubjectsection`
--

DROP TABLE IF EXISTS `examsubjectsection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examsubjectsection` (
  `examsubjectsectionId` int NOT NULL AUTO_INCREMENT,
  `examId` int NOT NULL DEFAULT '0',
  `examsubjectId` int NOT NULL DEFAULT '0',
  `noOfQuestions` int NOT NULL DEFAULT '0',
  `questionType` enum('TrueFalse','3','4','5','6','7','8','9') NOT NULL,
  `isAllowPartialMarks` tinyint NOT NULL DEFAULT '0' COMMENT '0=Allow\r\n1=Not Allow',
  `marksForCorrect` float NOT NULL DEFAULT '0',
  `marksForInCorrect` float NOT NULL DEFAULT '0',
  `isAllowOptionalAttemp` tinyint NOT NULL DEFAULT '0' COMMENT '0=Allow\r\n1=Not Allow',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`examsubjectsectionId`),
  KEY `examId` (`examId`,`examsubjectId`)
) ENGINE=InnoDB AUTO_INCREMENT=545 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `institute`
--

DROP TABLE IF EXISTS `institute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institute` (
  `instituteId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobileNumber` varchar(70) DEFAULT NULL,
  `countryId` int NOT NULL DEFAULT '0',
  `city` varchar(255) DEFAULT NULL,
  `headOfficeName` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `headOfficeMobileNumber` varchar(255) DEFAULT NULL,
  `headOfficeAddress` text,
  `completedSteps` text,
  `instituteCode` varchar(15) DEFAULT NULL,
  `states` text COMMENT 'comma saperated',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  `deleteAt` datetime DEFAULT NULL,
  `deletedByType` tinyint NOT NULL DEFAULT '0' COMMENT '0=admin\r\n1= user\r\n',
  `deletedBy` int NOT NULL DEFAULT '0',
  `createdBy` int NOT NULL DEFAULT '0',
  `isVerified` tinyint NOT NULL DEFAULT '0',
  `otp` varchar(20) DEFAULT NULL,
  `credits` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`instituteId`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000001_division`
--

DROP TABLE IF EXISTS `jeit000001_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000001_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000002_division`
--

DROP TABLE IF EXISTS `jeit000002_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000002_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000003_division`
--

DROP TABLE IF EXISTS `jeit000003_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000003_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000004_division`
--

DROP TABLE IF EXISTS `jeit000004_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000004_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000005_division`
--

DROP TABLE IF EXISTS `jeit000005_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000005_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000007_division`
--

DROP TABLE IF EXISTS `jeit000007_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000007_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000009_division`
--

DROP TABLE IF EXISTS `jeit000009_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000009_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000011_division`
--

DROP TABLE IF EXISTS `jeit000011_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000011_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000012_division`
--

DROP TABLE IF EXISTS `jeit000012_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000012_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000015_division`
--

DROP TABLE IF EXISTS `jeit000015_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000015_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000016_division`
--

DROP TABLE IF EXISTS `jeit000016_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000016_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000017_division`
--

DROP TABLE IF EXISTS `jeit000017_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000017_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000019_division`
--

DROP TABLE IF EXISTS `jeit000019_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000019_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000020_division`
--

DROP TABLE IF EXISTS `jeit000020_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000020_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000021_division`
--

DROP TABLE IF EXISTS `jeit000021_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000021_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000022_division`
--

DROP TABLE IF EXISTS `jeit000022_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000022_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000029_division`
--

DROP TABLE IF EXISTS `jeit000029_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000029_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000030_division`
--

DROP TABLE IF EXISTS `jeit000030_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000030_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000031_division`
--

DROP TABLE IF EXISTS `jeit000031_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000031_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000032_division`
--

DROP TABLE IF EXISTS `jeit000032_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000032_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000036_division`
--

DROP TABLE IF EXISTS `jeit000036_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000036_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000037_division`
--

DROP TABLE IF EXISTS `jeit000037_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000037_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000043_division`
--

DROP TABLE IF EXISTS `jeit000043_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000043_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000046_division`
--

DROP TABLE IF EXISTS `jeit000046_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000046_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000047_division`
--

DROP TABLE IF EXISTS `jeit000047_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000047_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000048_division`
--

DROP TABLE IF EXISTS `jeit000048_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000048_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000049_division`
--

DROP TABLE IF EXISTS `jeit000049_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000049_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000050_division`
--

DROP TABLE IF EXISTS `jeit000050_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000050_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000051_division`
--

DROP TABLE IF EXISTS `jeit000051_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000051_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000052_division`
--

DROP TABLE IF EXISTS `jeit000052_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000052_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000053_division`
--

DROP TABLE IF EXISTS `jeit000053_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000053_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000054_division`
--

DROP TABLE IF EXISTS `jeit000054_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000054_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000055_division`
--

DROP TABLE IF EXISTS `jeit000055_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000055_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000056_division`
--

DROP TABLE IF EXISTS `jeit000056_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000056_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000057_division`
--

DROP TABLE IF EXISTS `jeit000057_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000057_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000058_division`
--

DROP TABLE IF EXISTS `jeit000058_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000058_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000059_division`
--

DROP TABLE IF EXISTS `jeit000059_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000059_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000060_division`
--

DROP TABLE IF EXISTS `jeit000060_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000060_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000061_division`
--

DROP TABLE IF EXISTS `jeit000061_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000061_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000062_division`
--

DROP TABLE IF EXISTS `jeit000062_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000062_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000063_division`
--

DROP TABLE IF EXISTS `jeit000063_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000063_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000064_division`
--

DROP TABLE IF EXISTS `jeit000064_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000064_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000065_division`
--

DROP TABLE IF EXISTS `jeit000065_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000065_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000066_division`
--

DROP TABLE IF EXISTS `jeit000066_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000066_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000068_division`
--

DROP TABLE IF EXISTS `jeit000068_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000068_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000070_division`
--

DROP TABLE IF EXISTS `jeit000070_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000070_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000072_division`
--

DROP TABLE IF EXISTS `jeit000072_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000072_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000073_division`
--

DROP TABLE IF EXISTS `jeit000073_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000073_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000074_division`
--

DROP TABLE IF EXISTS `jeit000074_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000074_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000075_division`
--

DROP TABLE IF EXISTS `jeit000075_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000075_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000078_division`
--

DROP TABLE IF EXISTS `jeit000078_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000078_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000079_division`
--

DROP TABLE IF EXISTS `jeit000079_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000079_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000081_division`
--

DROP TABLE IF EXISTS `jeit000081_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000081_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000082_division`
--

DROP TABLE IF EXISTS `jeit000082_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000082_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000083_division`
--

DROP TABLE IF EXISTS `jeit000083_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000083_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000084_division`
--

DROP TABLE IF EXISTS `jeit000084_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000084_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000085_division`
--

DROP TABLE IF EXISTS `jeit000085_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000085_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000086_division`
--

DROP TABLE IF EXISTS `jeit000086_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000086_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000087_division`
--

DROP TABLE IF EXISTS `jeit000087_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000087_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000088_division`
--

DROP TABLE IF EXISTS `jeit000088_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000088_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000089_division`
--

DROP TABLE IF EXISTS `jeit000089_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000089_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000090_division`
--

DROP TABLE IF EXISTS `jeit000090_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000090_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000091_division`
--

DROP TABLE IF EXISTS `jeit000091_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000091_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000095_division`
--

DROP TABLE IF EXISTS `jeit000095_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000095_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000097_division`
--

DROP TABLE IF EXISTS `jeit000097_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000097_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000098_division`
--

DROP TABLE IF EXISTS `jeit000098_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000098_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000099_division`
--

DROP TABLE IF EXISTS `jeit000099_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000099_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000100_division`
--

DROP TABLE IF EXISTS `jeit000100_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000100_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000101_division`
--

DROP TABLE IF EXISTS `jeit000101_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000101_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000103_division`
--

DROP TABLE IF EXISTS `jeit000103_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000103_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000104_division`
--

DROP TABLE IF EXISTS `jeit000104_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000104_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000105_division`
--

DROP TABLE IF EXISTS `jeit000105_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000105_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000106_division`
--

DROP TABLE IF EXISTS `jeit000106_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000106_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000109_division`
--

DROP TABLE IF EXISTS `jeit000109_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000109_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000110_division`
--

DROP TABLE IF EXISTS `jeit000110_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000110_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000111_division`
--

DROP TABLE IF EXISTS `jeit000111_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000111_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000113_division`
--

DROP TABLE IF EXISTS `jeit000113_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000113_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000114_division`
--

DROP TABLE IF EXISTS `jeit000114_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000114_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000116_division`
--

DROP TABLE IF EXISTS `jeit000116_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000116_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000117_division`
--

DROP TABLE IF EXISTS `jeit000117_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000117_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000118_division`
--

DROP TABLE IF EXISTS `jeit000118_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000118_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000120_division`
--

DROP TABLE IF EXISTS `jeit000120_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000120_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000122_division`
--

DROP TABLE IF EXISTS `jeit000122_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000122_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000123_division`
--

DROP TABLE IF EXISTS `jeit000123_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000123_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000124_division`
--

DROP TABLE IF EXISTS `jeit000124_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000124_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000126_division`
--

DROP TABLE IF EXISTS `jeit000126_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000126_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000127_division`
--

DROP TABLE IF EXISTS `jeit000127_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000127_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000128_division`
--

DROP TABLE IF EXISTS `jeit000128_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000128_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000131_division`
--

DROP TABLE IF EXISTS `jeit000131_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000131_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000132_division`
--

DROP TABLE IF EXISTS `jeit000132_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000132_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000133_division`
--

DROP TABLE IF EXISTS `jeit000133_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000133_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000134_division`
--

DROP TABLE IF EXISTS `jeit000134_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000134_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000135_division`
--

DROP TABLE IF EXISTS `jeit000135_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000135_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000136_division`
--

DROP TABLE IF EXISTS `jeit000136_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000136_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000137_division`
--

DROP TABLE IF EXISTS `jeit000137_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000137_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000138_division`
--

DROP TABLE IF EXISTS `jeit000138_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000138_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000139_division`
--

DROP TABLE IF EXISTS `jeit000139_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000139_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000140_division`
--

DROP TABLE IF EXISTS `jeit000140_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000140_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000141_division`
--

DROP TABLE IF EXISTS `jeit000141_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000141_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000143_division`
--

DROP TABLE IF EXISTS `jeit000143_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000143_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000144_division`
--

DROP TABLE IF EXISTS `jeit000144_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000144_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000145_division`
--

DROP TABLE IF EXISTS `jeit000145_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000145_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000146_division`
--

DROP TABLE IF EXISTS `jeit000146_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000146_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000147_division`
--

DROP TABLE IF EXISTS `jeit000147_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000147_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000148_division`
--

DROP TABLE IF EXISTS `jeit000148_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000148_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000149_division`
--

DROP TABLE IF EXISTS `jeit000149_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000149_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000150_division`
--

DROP TABLE IF EXISTS `jeit000150_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000150_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000151_division`
--

DROP TABLE IF EXISTS `jeit000151_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000151_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000152_division`
--

DROP TABLE IF EXISTS `jeit000152_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000152_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000153_division`
--

DROP TABLE IF EXISTS `jeit000153_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000153_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000154_division`
--

DROP TABLE IF EXISTS `jeit000154_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000154_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000155_division`
--

DROP TABLE IF EXISTS `jeit000155_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000155_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000156_division`
--

DROP TABLE IF EXISTS `jeit000156_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000156_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000157_division`
--

DROP TABLE IF EXISTS `jeit000157_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000157_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000158_division`
--

DROP TABLE IF EXISTS `jeit000158_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000158_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000159_division`
--

DROP TABLE IF EXISTS `jeit000159_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000159_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000160_division`
--

DROP TABLE IF EXISTS `jeit000160_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000160_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000161_division`
--

DROP TABLE IF EXISTS `jeit000161_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000161_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000162_division`
--

DROP TABLE IF EXISTS `jeit000162_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000162_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000163_division`
--

DROP TABLE IF EXISTS `jeit000163_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000163_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000164_division`
--

DROP TABLE IF EXISTS `jeit000164_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000164_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000165_division`
--

DROP TABLE IF EXISTS `jeit000165_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000165_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000166_division`
--

DROP TABLE IF EXISTS `jeit000166_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000166_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000167_division`
--

DROP TABLE IF EXISTS `jeit000167_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000167_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000168_division`
--

DROP TABLE IF EXISTS `jeit000168_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000168_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000169_division`
--

DROP TABLE IF EXISTS `jeit000169_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000169_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000170_division`
--

DROP TABLE IF EXISTS `jeit000170_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000170_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000171_division`
--

DROP TABLE IF EXISTS `jeit000171_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000171_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000172_division`
--

DROP TABLE IF EXISTS `jeit000172_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000172_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000173_division`
--

DROP TABLE IF EXISTS `jeit000173_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000173_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000174_division`
--

DROP TABLE IF EXISTS `jeit000174_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000174_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000175_division`
--

DROP TABLE IF EXISTS `jeit000175_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000175_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000177_division`
--

DROP TABLE IF EXISTS `jeit000177_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000177_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000178_division`
--

DROP TABLE IF EXISTS `jeit000178_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000178_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000180_division`
--

DROP TABLE IF EXISTS `jeit000180_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000180_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000181_division`
--

DROP TABLE IF EXISTS `jeit000181_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000181_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000182_division`
--

DROP TABLE IF EXISTS `jeit000182_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000182_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000183_division`
--

DROP TABLE IF EXISTS `jeit000183_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000183_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000184_division`
--

DROP TABLE IF EXISTS `jeit000184_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000184_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000185_division`
--

DROP TABLE IF EXISTS `jeit000185_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000185_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000186_division`
--

DROP TABLE IF EXISTS `jeit000186_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000186_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000189_division`
--

DROP TABLE IF EXISTS `jeit000189_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000189_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000193_division`
--

DROP TABLE IF EXISTS `jeit000193_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000193_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000199_division`
--

DROP TABLE IF EXISTS `jeit000199_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000199_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000200_division`
--

DROP TABLE IF EXISTS `jeit000200_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000200_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000201_division`
--

DROP TABLE IF EXISTS `jeit000201_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000201_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000202_division`
--

DROP TABLE IF EXISTS `jeit000202_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000202_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000203_division`
--

DROP TABLE IF EXISTS `jeit000203_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000203_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000204_division`
--

DROP TABLE IF EXISTS `jeit000204_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000204_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000205_division`
--

DROP TABLE IF EXISTS `jeit000205_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000205_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000206_division`
--

DROP TABLE IF EXISTS `jeit000206_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000206_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000207_division`
--

DROP TABLE IF EXISTS `jeit000207_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000207_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000208_division`
--

DROP TABLE IF EXISTS `jeit000208_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000208_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000209_division`
--

DROP TABLE IF EXISTS `jeit000209_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000209_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jeit000210_division`
--

DROP TABLE IF EXISTS `jeit000210_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jeit000210_division` (
  `divisionId` int NOT NULL AUTO_INCREMENT,
  `divisionName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionId` int NOT NULL DEFAULT '0',
  `divisionCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `divisionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`divisionId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `menuId` int NOT NULL AUTO_INCREMENT,
  `mainMenuId` int NOT NULL,
  `menuName` varchar(100) NOT NULL,
  `path` varchar(100) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `order` int NOT NULL,
  `add` varchar(4) NOT NULL,
  `edit` varchar(4) NOT NULL,
  `view` varchar(4) NOT NULL,
  `visibility` varchar(4) NOT NULL,
  `delete` varchar(4) NOT NULL,
  `addPath` varchar(100) NOT NULL,
  `deleteMenu` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`menuId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `orderId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL DEFAULT '0',
  `instituteId` int NOT NULL DEFAULT '0',
  `planId` int NOT NULL DEFAULT '0',
  `totalCredit` int NOT NULL DEFAULT '0',
  `quantity` int NOT NULL DEFAULT '0',
  `total` float NOT NULL DEFAULT '0',
  `grandTotal` float NOT NULL DEFAULT '0',
  `discount` float DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `permissionId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`permissionId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan` (
  `planId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `credit` int NOT NULL DEFAULT '0',
  `price` float NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`planId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(30) NOT NULL,
  `encryptId` varchar(30) NOT NULL,
  `menuIdAdd` text NOT NULL,
  `menuIdEdit` text NOT NULL,
  `menuIdDelete` text NOT NULL,
  `menuIdView` text NOT NULL,
  `delete` tinyint NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `stateId` int NOT NULL AUTO_INCREMENT,
  `countryId` int NOT NULL,
  `stateName` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `upadated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`stateId`)
) ENGINE=InnoDB AUTO_INCREMENT=4121 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `country_id` mediumint unsigned NOT NULL,
  `country_code` char(2) NOT NULL,
  `fips_code` varchar(255) DEFAULT NULL,
  `iso2` varchar(255) DEFAULT NULL,
  `type` varchar(191) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `flag` tinyint(1) NOT NULL DEFAULT '1',
  `wikiDataId` varchar(255) DEFAULT NULL COMMENT 'Rapid API GeoDB Cities',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5134 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `studentId` int NOT NULL AUTO_INCREMENT,
  `instituteId` int NOT NULL DEFAULT '0',
  `fullName` varchar(255) DEFAULT NULL,
  `mobileNumber` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `classId` int DEFAULT '0',
  `rollNumber` varchar(60) DEFAULT NULL,
  `studentCode` varchar(50) DEFAULT NULL,
  `isRemoved` tinyint NOT NULL DEFAULT '0',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  `createdBy` int NOT NULL DEFAULT '0',
  `deletedBy` int NOT NULL DEFAULT '0',
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`studentId`),
  KEY `instituteId` (`instituteId`),
  KEY `classId` (`classId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `teacherId` int NOT NULL AUTO_INCREMENT,
  `instituteId` text,
  `fullName` varchar(255) DEFAULT NULL,
  `mobileNumber` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `classes` text COMMENT '[{"type":"class","id":[1]},{"type":"department","id":[2]}]',
  `permissions` text,
  `teacherCode` varchar(50) DEFAULT NULL,
  `isVerified` tinyint NOT NULL DEFAULT '0',
  `otp` varchar(4) DEFAULT NULL,
  `loginType` enum('googleId','facebookId','manual') NOT NULL DEFAULT 'manual',
  `password` varchar(255) DEFAULT NULL,
  `loginOs` varchar(60) DEFAULT NULL,
  `loginOsVersion` varchar(60) DEFAULT NULL,
  `loginDevice` varchar(60) DEFAULT NULL,
  `loginAppVersion` varchar(20) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  `createdBy` int NOT NULL DEFAULT '0',
  `deletedBy` int NOT NULL DEFAULT '0',
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`teacherId`),
  KEY `delete` (`delete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacherdepartment`
--

DROP TABLE IF EXISTS `teacherdepartment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacherdepartment` (
  `teacherdepartmentId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL DEFAULT '0',
  `instituteId` int NOT NULL DEFAULT '0',
  `divisionId` int NOT NULL DEFAULT '0',
  `divisionType` enum('division','class') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`teacherdepartmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userCode` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lastName` varchar(20) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `gender` enum('Female','Male','Other') DEFAULT NULL,
  `height` float DEFAULT '0' COMMENT 'in foot',
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(35) DEFAULT NULL,
  `countryCode` varchar(6) NOT NULL DEFAULT '+91',
  `mobileNumber` varchar(12) DEFAULT NULL,
  `profilePicture` text,
  `interest` text,
  `cacheImage` text,
  `otp` int DEFAULT NULL,
  `otpTime` datetime DEFAULT NULL,
  `google` text,
  `facebook` text,
  `loginType` enum('googleId','facebookId','manual') NOT NULL DEFAULT 'manual',
  `block` tinyint NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint(1) NOT NULL DEFAULT '0',
  `createdBy` varchar(10) NOT NULL DEFAULT 'user',
  `updatedBy` varchar(10) NOT NULL DEFAULT 'user',
  `deleteBy` int DEFAULT NULL,
  `regOs` enum('ANDROID','IOS','ADMIN') NOT NULL,
  `regOsVersion` varchar(15) DEFAULT NULL,
  `regDevice` varchar(30) DEFAULT NULL,
  `loginOs` enum('ANDROID','IOS') NOT NULL,
  `loginOsVersion` varchar(15) DEFAULT NULL,
  `loginDevice` varchar(30) DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `registeredAppVersion` varchar(10) DEFAULT NULL,
  `loginAppVersion` varchar(10) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `referCode` varchar(8) DEFAULT NULL,
  `referedUserId` int DEFAULT '0',
  `referedCode` varchar(6) DEFAULT NULL,
  `isTeacher` tinyint NOT NULL DEFAULT '0' COMMENT '0 = user\r\n1 = teacher\r\n2 = student',
  `classId` int NOT NULL DEFAULT '0',
  `instituteId` int NOT NULL DEFAULT '0',
  `rollNumber` varchar(60) DEFAULT NULL,
  `permissions` text,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=383 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zone`
--

DROP TABLE IF EXISTS `zone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zone` (
  `zoneId` int NOT NULL AUTO_INCREMENT,
  `stateId` int NOT NULL DEFAULT '0',
  `zoneCode` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `instituteId` int NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`zoneId`),
  KEY `stateId` (`stateId`,`instituteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-15 10:51:06
