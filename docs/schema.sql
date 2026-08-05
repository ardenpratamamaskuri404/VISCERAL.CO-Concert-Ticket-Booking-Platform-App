-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: visceral_co
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `photo_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES ('art-01','Slank','Grup band rock legendaris Indonesia asal Jakarta, dibentuk pada tahun 1983. Ikon rock and roll tanah air.','slank-real.jpg','2026-07-31 14:19:09.612'),('art-02','Sheila On 7','Grup musik pop rock kebanggaan Yogyakarta. Lagu-lagunya telah menjadi soundtrack kehidupan masyarakat Indonesia sejak akhir 90-an.','so7.jpg','2026-07-31 14:19:09.612'),('art-03','Dewa 19','Grup musik rock legendaris Indonesia yang dibentuk di Surabaya tahun 1986. Dipimpin oleh Ahmad Dhani.','dewa19.jpg','2026-07-31 14:19:09.612'),('art-04','Tulus','Penyanyi dan penulis lagu asal Bukittinggi yang terkenal dengan suara tenor khasnya dan lagu-lagu romantis.','tulus.jpg','2026-07-31 14:19:09.612'),('art-05','Nadin Amizah','Penyanyi-penulis lagu asal Jakarta, dikenal dengan lagu \"Bertaut\" dan \"Rayuan Perempuan Gila\".','Nadin.jpg','2026-07-31 14:19:09.612'),('art-06','Hindia','Proyek solo Baskara Putra. Pop alternatif dengan lirik puitis dan kritis.','hindia.jpeg','2026-07-31 14:19:09.612'),('art-07','Juicy Luicy','Band pop rock asal Bandung yang viral dengan lagu \"Lantas\" dan \"Tanpa Tergesa\".','Juicy-Luicy.jpg','2026-07-31 14:19:09.612'),('art-08','Coldplay','Band rock asal London, Inggris. Salah satu band terbesar dunia dengan hits \"Yellow\", \"Fix You\", dan \"Viva la Vida\".','coldplay.jpg','2026-07-31 14:19:09.612'),('art-09','Ed Sheeran','Penyanyi-penulis lagu asal Inggris yang telah menjual lebih dari 150 juta rekaman di seluruh dunia.','ed-sheeran.jpg','2026-07-31 14:19:09.612'),('art-10','Bruno Mars','Penyanyi dan produser musik asal Hawaii, AS. Dikenal dengan lagu \"Just the Way You Are\" dan \"Uptown Funk\".','brunomars.jpg','2026-07-31 14:19:09.612'),('art-11','BLACKPINK','Girl group K-pop dari YG Entertainment. Salah satu girl group terbesar di dunia.','blackpink.jpeg','2026-07-31 14:19:09.612'),('art-12','Taylor Swift','Penyanyi-penulis lagu Amerika yang menjadi salah satu artis terlaris sepanjang masa.','Taylor-Swift.jpg','2026-07-31 14:19:09.612'),('art-13','The Weeknd','Penyanyi R&B/pop asal Kanada. Dikenal dengan \"Blinding Lights\" dan \"Starboy\".','the-weekends.jpg','2026-07-31 14:19:09.612'),('art-14','Bernadya','Penyanyi-penulis lagu Indonesia yang sedang naik daun dengan lagu \"Apa Mungkin\" dan \"Untungnya, Hidup Harus Tetap Berjalan\".','bernadya.jpg','2026-07-31 14:19:09.612'),('art-15','Raisa','Penyanyi pop Indonesia asal Jakarta yang dikenal dengan suara merdu dan lagu \"Could It Be\" serta \"Apalah (Arti Menunggu)\".','raisa.jpg','2026-07-31 14:19:09.612'),('art-16','Pamungkas','Penyanyi-penulis lagu Indonesia bernama Rizky Pamungkas, terkenal dengan \"To The Bone\" dan \"One Only\".','Pamungkas.jpg','2026-07-31 14:19:09.612'),('art-17','Mahalini','Penyanyi pop Indonesia yang dikenal lewat lagu \"Sial\" dan \"Bohongi Hati\".','mahalini.jpg','2026-07-31 14:19:09.612'),('art-18','Imagine Dragons','Band rock asal Las Vegas, AS. Dikenal dengan \"Radioactive\", \"Believer\", dan \"Thunder\".','imagine-dragons.jpg','2026-07-31 14:19:09.612'),('art-19','ONE OK ROCK','Band rock asal Jepang yang memiliki fanbase besar di Asia dan dunia.','one-ok-rock.jpg','2026-07-31 14:19:09.612'),('art-20','Billie Eilish','Penyanyi-penulis lagu asal Los Angeles. Artis Gen-Z paling berpengaruh di dunia.','Billie-eillish.jpg','2026-07-31 14:19:09.612'),('d964af34-5ac0-41a2-888f-6267f50fa2ae','Taylor Swift','Penyanyi dan penulis lagu pop Amerika Serikat, memenangkan banyak penghargaan bergengsi.','Taylor-Swift.jpg','2026-07-31 14:49:06.053');
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_fkey` (`user_id`),
  CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES ('08733e5f-8b8d-45bd-8dd5-1a0506bb150e','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83','CREATE_ORDER','df818d26-eaef-4122-bfda-47539c42ce00','{\"orderNumber\": \"VSC-20260803-7399\", \"totalAmount\": \"500000\"}','2026-08-03 09:34:31.069'),('12876c13-c60d-4af8-ad7a-21de6aa24455','usr-admin-1','CHECKIN_TICKET','6457e94d-a513-43ae-818e-22d0eec116ca','{\"ticketCode\": \"QR-VSC-20260731-4365-S-6\"}','2026-08-05 03:40:22.381'),('12a3901f-81ee-42ac-ad99-0b83bdc56c0c','usr-admin-1','CHECKIN_TICKET','83834944-f36c-4449-b855-2a80a720e618','{\"ticketCode\": \"QR-VSC-20260805-2663-S-1\"}','2026-08-05 07:11:47.953'),('1f25f6d3-db37-42d0-9555-38d460228662','usr-admin-1','CHECKIN_TICKET','cd802baf-04ad-48df-973a-8ce36d722ffe','{\"ticketCode\": \"QR-VSC-20260802-8074-S-6\"}','2026-08-02 14:21:06.094'),('2058eb2c-ba3f-430a-b608-7c42f70f60ac','usr-admin-1','CHECKIN_TICKET','38270760-77c1-4b5b-ae03-0f2d61273d81','{\"ticketCode\": \"QR-VSC-20260804-2685-S-5\"}','2026-08-04 09:49:10.702'),('386b01fe-6ff6-4f37-9045-e4236eea905c','8fa25887-c152-4e31-8456-85ef26db9469','CREATE_ORDER','097efe79-34ec-48b6-971e-73714417c8b4','{\"orderNumber\": \"VSC-20260804-1721\", \"totalAmount\": \"1200000\"}','2026-08-04 09:22:35.439'),('3eeca323-33f5-46e2-9f4a-098ef1ca6f52','usr-admin-1','TOGGLE_SALES_CLOSED','evt-09','{\"eventId\": \"evt-09\"}','2026-08-03 07:28:14.848'),('48f1a325-1efd-4309-822a-683478bfeeb5','usr-admin-1','CHECKIN_TICKET','09a855b7-4ffb-4a44-b6ec-4f20e153ebfc','{\"ticketCode\": \"QR-VSC-20260731-9585-S-87\"}','2026-08-01 07:10:46.413'),('4e389a8d-c9d9-4058-9ebf-69d52685aa57','usr-admin-1','CHECKIN_TICKET','41da6ff3-7081-48ba-81c8-b55941e01efc','{\"ticketCode\": \"QR-VSC-20260805-7012-5810\"}','2026-08-05 07:16:06.568'),('56279123-cdfc-4825-9ca3-2d16295743b7','usr-admin-1','UPDATE_ARTIST','art-03','{\"name\": \"Dewa 19\"}','2026-08-03 07:28:31.817'),('5e003fac-89b6-4ac0-ba46-7fdb25f6694b','usr-customer-dandi','CREATE_ORDER','0c322854-a7c0-45ba-bb9f-6f2f2e5962b5','{\"orderNumber\": \"VSC-20260805-9306\", \"totalAmount\": \"3500000\"}','2026-08-05 07:54:18.701'),('62c96a7e-23fb-4f59-b812-9b8443311b66','8fa25887-c152-4e31-8456-85ef26db9469','CREATE_ORDER','5166c681-100e-4aa6-a88e-44a7b4bc83d3','{\"orderNumber\": \"VSC-20260801-5559\", \"totalAmount\": \"550000\"}','2026-08-01 09:30:25.482'),('6d2431e0-b878-46eb-aa27-c29c60c17a57','usr-customer-dandi','CREATE_ORDER','67c4bc68-9352-47eb-a5a3-77984a21445f','{\"orderNumber\": \"VSC-20260804-2519\", \"totalAmount\": \"1800000\"}','2026-08-04 10:04:33.547'),('71f92a76-09b0-40d7-9c17-a1d867e773bb','usr-customer-dandi','CREATE_ORDER','dc9242b3-ed09-4856-b2c1-9557d32eae00','{\"orderNumber\": \"VSC-20260804-8108\", \"totalAmount\": \"1500000\"}','2026-08-04 10:13:46.699'),('7398b3ea-9540-439d-bd1a-a2dafc5ace98','8fa25887-c152-4e31-8456-85ef26db9469','APPROVE_ORDER','8f0cc323-6017-4726-8498-3022a6b526fc','{\"orderId\": \"8f0cc323-6017-4726-8498-3022a6b526fc\"}','2026-08-01 07:41:04.746'),('791769f5-1e1d-4ce4-8302-9024e045406a','usr-admin-1','CHECKIN_TICKET','6b4b1278-c677-4668-9f00-5ed391474e73','{\"ticketCode\": \"QR-VSC-20260805-7012-7197\"}','2026-08-05 07:16:21.427'),('7faf3787-08a0-4ad2-87a8-99003966b7f4','usr-customer-dandi','CREATE_ORDER','0e60d70b-9cd9-4e85-b5c7-fd07d5414bd1','{\"orderNumber\": \"VSC-20260804-3477\", \"totalAmount\": \"1900000\"}','2026-08-04 09:52:38.533'),('80b982e0-a1cc-4c41-bd81-b094ffab6c98','usr-admin-1','CHECKIN_TICKET','ea7f5129-f754-4b33-8062-5c40f45cf4d3','{\"ticketCode\": \"QR-VSC-20260803-2754-S-15\"}','2026-08-03 08:33:29.972'),('85fc4944-2fe4-4eae-b4e1-070e784a974e','8fa25887-c152-4e31-8456-85ef26db9469','CREATE_ORDER','ec88caca-906e-4b53-b112-3de381755b8d','{\"orderNumber\": \"VSC-20260802-8074\", \"totalAmount\": \"1000000\"}','2026-08-02 13:53:39.090'),('930054d0-61f2-4abc-97eb-aba36a2b6a5e','usr-customer-dandi','CREATE_ORDER','36698f9c-b876-42f2-a6b6-e701949d1f96','{\"orderNumber\": \"VSC-20260803-2754\", \"totalAmount\": \"950000\"}','2026-08-03 08:29:58.256'),('9c9c0a72-b5f4-4617-acfc-f8237e20cb5a','58fae8cd-41b9-4a9f-8dc3-93278726df64','CREATE_ORDER','1e9bd4eb-9f3b-4a49-92f2-e18e1321de21','{\"orderNumber\": \"VSC-20260804-6319\", \"totalAmount\": \"2400000\"}','2026-08-04 10:23:39.034'),('a2b995a2-2e8e-4bee-8828-e60ff2c298ff','usr-customer-dandi','CREATE_ORDER','791e3393-4f93-4d1b-bc01-3b06d32b3f41','{\"orderNumber\": \"VSC-20260802-8948\", \"totalAmount\": \"650000\"}','2026-08-02 15:01:22.567'),('ada9009e-d146-4990-9aed-445ea72beb84','usr-admin-1','CHECKIN_TICKET','a20927de-2522-484f-9540-23fa0188b844','{\"ticketCode\": \"QR-VSC-20260731-7554-S-4\"}','2026-08-05 03:37:37.703'),('b97db37e-095e-4d56-9268-bf15deb31b96','usr-admin-1','CHECKIN_TICKET','63b10c2b-ed33-42b5-9fc5-6accb3a54cd9','{\"ticketCode\": \"QR-VSC-20260805-6090-9276\"}','2026-08-05 03:38:07.363'),('bc259c25-ab71-4f35-b733-4963fa979947','usr-admin-1','DELETE_ARTIST','5aa23bda-9783-4309-902b-5d61440910bd','{\"artistId\": \"5aa23bda-9783-4309-902b-5d61440910bd\"}','2026-08-04 07:54:56.789'),('be136032-ff8e-4dae-83d0-9a2d578e38dc','usr-admin-1','CHECKIN_TICKET','9dd02633-83f9-4759-a546-b31cd796b705','{\"ticketCode\": \"QR-VSC-20260731-2482-8071\"}','2026-08-01 07:06:53.132'),('bf6783ba-fe74-47c7-a42b-c400bfcf6afd','usr-admin-1','TOGGLE_SALES_CLOSED','evt-09','{\"eventId\": \"evt-09\"}','2026-08-03 07:28:13.538'),('d0e3218d-d0cf-4525-b006-eaa21de916d6','usr-admin-1','CHECKIN_TICKET','90a0d487-7111-4ffa-8d6b-4e150b4b0150','{\"ticketCode\": \"QR-VSC-20260803-7399-S-7\"}','2026-08-03 09:37:27.747'),('db9575ab-4683-4b30-8bc1-2873f20bbafc','usr-customer-dandi','CREATE_ORDER','83e8b796-3393-4af8-80c5-4eada0629c21','{\"orderNumber\": \"VSC-20260805-3160\", \"totalAmount\": \"5000000\"}','2026-08-05 07:32:22.403'),('e7c4c248-24f4-4c97-b529-550bb895cbf9','usr-customer-dandi','CREATE_ORDER','ef6de377-6792-476c-832b-c6add81ede88','{\"orderNumber\": \"VSC-20260805-3859\", \"totalAmount\": \"2400000\"}','2026-08-05 07:34:59.725'),('f20582ab-a7dc-4a30-9e3a-8cf154abf805','usr-admin-1','CHECKIN_TICKET','8926dcfc-812d-4697-a13d-ac89253644cc','{\"ticketCode\": \"QR-VSC-20260802-8948-S-3\"}','2026-08-02 15:03:03.195'),('f4f365c1-fd9f-412a-b5d2-502db2b08b30','usr-admin-1','CHECKIN_TICKET','2dd968d5-7592-4dd0-8c78-0caa8dc38ebd','{\"ticketCode\": \"QR-VSC-20260804-4893-4593\"}','2026-08-04 08:35:02.616');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `chat_messages_sender_id_fkey` (`sender_id`),
  KEY `chat_messages_receiver_id_fkey` (`receiver_id`),
  CONSTRAINT `chat_messages_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES ('1190ae0b-2927-4da6-8312-5f636f3070ec','usr-admin-1','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83','halo',0,'2026-08-05 03:36:45.649'),('2c6b18ee-affc-471e-b788-a0ea7f4eed4b','8fa25887-c152-4e31-8456-85ef26db9469',NULL,'min saya ada masalah terkait tentang pemesanan tiket',0,'2026-08-02 14:19:52.750'),('658ed55a-d298-44fb-a992-a32eea2a7572','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',NULL,'tes min',0,'2026-08-05 03:36:58.659'),('8fe0a31a-777a-4208-89f1-05f10fa49b66','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',NULL,'oi min',0,'2026-08-05 07:13:49.128'),('a9967124-820c-4717-9b0d-07e6d431b9ee','usr-admin-1','8fa25887-c152-4e31-8456-85ef26db9469','oh ya baik gmn bisa di ceritakan dengan jelas?',0,'2026-08-02 14:21:41.757'),('aa65a83b-278d-4574-bad4-b810adb557f5','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',NULL,'tes',0,'2026-08-05 07:13:29.394'),('b952b52c-239b-47ff-9303-4dba13c4722a','8fa25887-c152-4e31-8456-85ef26db9469',NULL,'tes',0,'2026-08-02 14:19:32.185'),('ce3514ba-25f6-4ff1-976a-28cf4ebdc9eb','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',NULL,'tes',0,'2026-08-03 07:28:20.112'),('da6f2fe0-caff-41ff-a9f9-813e598b6587','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',NULL,'tes',0,'2026-08-02 14:59:21.805'),('fbef3a07-7d74-453c-aaa2-74ec53f775d3','usr-customer-dandi',NULL,'tes',0,'2026-08-04 09:54:11.899');
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_artists`
--

DROP TABLE IF EXISTS `event_artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_artists` (
  `event_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_headliner` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`event_id`,`artist_id`),
  KEY `event_artists_artist_id_fkey` (`artist_id`),
  CONSTRAINT `event_artists_artist_id_fkey` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_artists_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_artists`
--

LOCK TABLES `event_artists` WRITE;
/*!40000 ALTER TABLE `event_artists` DISABLE KEYS */;
INSERT INTO `event_artists` VALUES ('evt-01','art-01',1),('evt-01','art-02',0),('evt-01','art-03',1),('evt-02','art-02',1),('evt-03','art-04',1),('evt-04','art-08',1),('evt-05','art-09',1),('evt-06','art-10',1),('evt-07','art-11',1),('evt-08','art-12',1),('evt-08','d964af34-5ac0-41a2-888f-6267f50fa2ae',1),('evt-09','art-05',1),('evt-10','art-07',1),('evt-11','art-03',1),('evt-12','art-13',1),('evt-13','art-05',1),('evt-13','art-06',1),('evt-14','art-14',1),('evt-15','art-15',1),('evt-16','art-16',1),('evt-17','art-17',1),('evt-18','art-18',1),('evt-19','art-19',1),('evt-20','art-20',1),('evt-21','art-01',1),('evt-22','art-04',0),('evt-22','art-15',0),('evt-23','art-05',0),('evt-23','art-06',0),('evt-23','art-07',0),('evt-23','art-16',0),('evt-24','art-04',1),('evt-24','art-08',1),('evt-25','art-07',0),('evt-25','art-09',1),('evt-25','art-20',1);
/*!40000 ALTER TABLE `event_artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `venue_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` datetime(3) NOT NULL,
  `banner_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `sales_closed` tinyint(1) NOT NULL DEFAULT '0',
  `is_seated` tinyint(1) NOT NULL DEFAULT '1',
  `created_by_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `events_created_by_id_fkey` (`created_by_id`),
  CONSTRAINT `events_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES ('evt-01','VISCERAL FESTIVAL 2026: THE RESONANCE','Konser rock terbesar tahun 2026 menghadirkan kolaborasi panggung liar Slank dan Dewa 19 dengan sound system mutakhir dan tata lampu spektakuler.','Gelora Bung Karno Stadium, Jakarta','2026-10-15 19:00:00.000','festival-visceral.jpg','PUBLISHED',0,0,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.888'),('evt-02','Sheila On 7: Tunggu Aku di Jakarta','Malam nostalgia dan magis bersama Sheila On 7 membawakan lagu-lagu hits sepanjang masa. Persiapkan diri untuk sing-along massal!','Jakarta International Stadium (JIS)','2026-11-08 19:30:00.000','so7.jpeg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.894'),('evt-03','Tulus Tur Manusia 2026','Tur konser nasional Tulus dengan konsep intimate yang intim. Dengarkan \"Monokrom\" dan \"Hati-Hati di Jalan\" secara live.','Istora Senayan, Jakarta','2026-09-20 20:00:00.000','tulus.png','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 16:08:41.595'),('evt-04','Coldplay: Music of the Spheres World Tour Jakarta 2026','Coldplay kembali ke Jakarta! Saksikan pertunjukan visual spektakuler dengan Xylobands dan lagu-lagu ikonik seperti \"Fix You\" dan \"Yellow\".','Gelora Bung Karno Stadium, Jakarta','2026-11-15 19:00:00.000','coldplay.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.904'),('evt-05','Ed Sheeran Mathematics Tour Jakarta','Ed Sheeran live di Jakarta dengan tur Mathematics-nya. Nikmati \"Shape of You\", \"Perfect\", dan \"Bad Habits\" secara langsung.','Jakarta International Stadium (JIS)','2026-12-01 19:30:00.000','ed-sheeran.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.909'),('evt-06','Bruno Mars 24K Magic World Tour Jakarta','Bruno Mars hadir di Jakarta dengan panggung 24K Magic-nya! \"Just the Way You Are\", \"Uptown Funk\", dan banyak lagi.','Gelora Bung Karno Stadium, Jakarta','2026-12-20 20:00:00.000','bruno-mars.jpeg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.913'),('evt-07','BLACKPINK: Born Pink World Tour Jakarta','Girl group terbesar di dunia hadir di Jakarta! Saksikan Lisa, Jennie, Jisoo, dan RosΓö£┬« di panggung Born Pink.','Gelora Bung Karno Stadium, Jakarta','2027-01-18 19:00:00.000','blackpink.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.917'),('evt-08','Taylor Swift The Eras Tour Jakarta 2027','The Eras Tour akhirnya tiba di Jakarta! 3.5 jam pertunjukan epik dari semua era Taylor Swift.','Gelora Bung Karno Stadium, Jakarta','2027-02-14 18:00:00.000','taylor-swift.png','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.922'),('evt-09','Nadin Amizah: Selamat Ulang Tahun Tour','Konser intim Nadin Amizah dengan aransemen baru lagu-lagu hits termasuk \"Bertaut\" dan \"Sorai\".','The Kasablanka Hall, Jakarta','2026-09-05 00:00:00.000','nadin.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-03 07:28:12.192'),('evt-10','Juicy Luicy Live in Concert','Band pop rock viral dari Bandung tampil full set dengan lagu \"Lantas\", \"Tanpa Tergesa\", dan album terbaru.','Tennis Indoor Senayan, Jakarta','2026-10-28 19:30:00.000','juicy-luicy.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.931'),('evt-11','Dewa 19 Reunion Concert 2026','Konser reuni Dewa 19 dengan formasi lengkap! \"Kangen\", \"Cinta Kan Membawamu Kembali\", dan hits legendaris lainnya.','Istora Senayan, Jakarta','2026-11-25 19:00:00.000','dewa19.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.936'),('evt-12','The Weeknd: After Hours Til Dawn Tour Jakarta','The Weeknd membawa tur meganya ke Jakarta. \"Blinding Lights\", \"Starboy\", dan semua hits terbaik.','Jakarta International Stadium (JIS)','2027-03-08 20:00:00.000','the-weekend.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.940'),('evt-13','Hindia x Nadin Amizah: Dua Rasa Satu Panggung','Kolaborasi spesial antara Hindia dan Nadin Amizah dalam satu panggung intim penuh emosi.','The Kasablanka Hall, Jakarta','2026-10-05 20:00:00.000','hindia-nadin.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.944'),('evt-14','Bernadya: Satu Kali Saja Concert Tour','Konser tur perdana Bernadya dengan hits \"Apa Mungkin\" dan \"Untungnya, Hidup Harus Tetap Berjalan\".','Balai Sarbini, Jakarta','2026-09-14 19:30:00.000','bernadya.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.948'),('evt-15','Raisa Live at JIS: Sound of Silence Tour','Raisa tampil dengan band lengkap dan string section di Jakarta International Stadium.','Jakarta International Stadium (JIS)','2026-12-12 19:30:00.000','raisa.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.952'),('evt-16','Pamungkas: Solipsism 2.0 Tour','Pamungkas membawakan repertoar dari album Solipsism dengan aransemen baru dan intimate stage.','Balai Sarbini, Jakarta','2026-10-18 20:00:00.000','pamungkas-konser.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.956'),('evt-17','Mahalini: Bohongi Hati National Tour Jakarta','Mahalini tampil di Jakarta dalam rangkaian National Tour-nya dengan hits \"Sial\" dan \"Bohongi Hati\".','Tennis Indoor Senayan, Jakarta','2026-11-02 19:30:00.000','mahalini.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.960'),('evt-18','Imagine Dragons: Loom World Tour Jakarta','Imagine Dragons hadir di Jakarta! \"Radioactive\", \"Believer\", \"Thunder\" dan semua hits mega mereka.','Gelora Bung Karno Stadium, Jakarta','2027-01-25 19:00:00.000','imagine-dragons.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.964'),('evt-19','ONE OK ROCK Luxury Disease Asia Tour Jakarta','Band rock Jepang fenomenal tampil di Jakarta dengan energi panggung yang meledak-ledak!','Tennis Indoor Senayan, Jakarta','2026-11-30 19:00:00.000','one-ok-rock.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.971'),('evt-20','Billie Eilish: Hit Me Hard and Soft Tour Jakarta','Billie Eilish pertama kali tampil di Jakarta! Saksikan pertunjukan visual memukau dari artis Gen-Z paling berpengaruh.','Jakarta International Stadium (JIS)','2027-02-22 19:30:00.000','billie-eilish-.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.976'),('evt-21','Slank: 43 Tahun Slankers Bersatu','Perayaan 43 tahun Slank dengan penampilan marathon 4 jam penuh dan guest star spesial.','Gelora Bung Karno Stadium, Jakarta','2026-12-26 18:00:00.000','slank-real.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-02 13:51:20.215'),('evt-22','Java Jazz Festival 2027','Festival jazz terbesar di Asia Tenggara dengan lineup artis jazz internasional dan nasional selama 3 hari.','Jakarta International Expo, Kemayoran','2027-03-01 15:00:00.000','java-jazz.jpg','PUBLISHED',0,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.985'),('evt-23','Synchronize Fest 2026','Festival musik indie terbesar Indonesia dengan 100+ band di 6 panggung selama 3 hari penuh.','Gambir Expo, Jakarta','2026-10-04 14:00:00.000','Synchronize-fest.jpg','PUBLISHED',0,0,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.991'),('evt-24','Coldplay x Tulus Special Night','Kolaborasi langka! Coldplay mengundang Tulus sebagai special guest di encore set mereka.','Gelora Bung Karno Stadium, Jakarta','2026-11-16 19:00:00.000','tulus.png','PUBLISHED',1,1,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 16:08:41.614'),('evt-25','We The Fest 2027','Festival musik dan lifestyle terbesar Asia Tenggara. Line-up internasional dan lokal terbaik selama 3 hari.','Gambir Expo, Jakarta','2027-07-18 13:00:00.000','we-thefest.jpg','PUBLISHED',0,0,'usr-admin-1','2026-07-31 14:19:09.622','2026-08-01 15:49:34.995');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_fkey` (`user_id`),
  CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('114204ea-5405-41a1-abc4-860752fcb31c','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260803-2754 telah dibayar senilai Rp 950.000','ORDER',1,'2026-08-03 08:31:19.926'),('11f87a60-c916-4c56-ae0d-5906e565f85a','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260805-7012 telah dibayar senilai Rp 1.600.000','ORDER',0,'2026-08-05 07:15:24.000'),('11ffbaed-4e6d-4eb5-b4d8-31f6ce60df88','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-4893 telah dibayar senilai Rp 1.200.000','ORDER',1,'2026-08-04 08:34:00.648'),('14b19268-9557-45b3-8a31-edbf476d6757','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260805-6090 telah dibayar senilai Rp 2.400.000','ORDER',1,'2026-08-05 03:20:16.572'),('1ce9ea26-39f7-47f3-83fe-cf8e14c7d7db','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-2519 telah dibayar senilai Rp 1.800.000','ORDER',0,'2026-08-04 10:04:55.998'),('21608f5c-00d0-4822-9653-2bd96d12212e','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-6319 telah dibayar senilai Rp 2.400.000','ORDER',0,'2026-08-04 10:23:59.831'),('2796ce29-0be6-4ee9-97e8-b3b9814977cf','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-3722 telah dibayar senilai Rp 20.000.000','ORDER',0,'2026-08-04 09:45:16.970'),('2c7ac40f-936a-4dac-befd-0fb59a4e186f','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-6319 telah dibayar senilai Rp 2.400.000','ORDER',1,'2026-08-04 10:23:59.831'),('2c84b09b-7357-494f-8129-cb414bc8f45e','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-1721 telah dibayar senilai Rp 1.200.000','ORDER',0,'2026-08-04 09:23:14.921'),('355630fc-7832-4d63-b220-a116e9a5c4d7','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-2685 telah dibayar senilai Rp 1.200.000','ORDER',0,'2026-08-04 09:48:19.464'),('367bce6d-2f3d-4f27-9dbe-0985ef7e3921','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-4893 telah dibayar senilai Rp 1.200.000','ORDER',0,'2026-08-04 08:34:00.648'),('3fc5791a-8d38-48fd-9cb8-28f6e3b5e99e','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260805-2663 telah dibayar senilai Rp 2.000.000','ORDER',0,'2026-08-05 07:11:09.392'),('4271cc27-7de4-4589-baf4-1c74526f3d76','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-2685 telah dibayar senilai Rp 1.200.000','ORDER',1,'2026-08-04 09:48:19.464'),('4c246605-c682-4495-ab1c-fc9fe7384e6a','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-1721 telah dibayar senilai Rp 1.200.000','ORDER',1,'2026-08-04 09:23:14.921'),('4fd6e740-1233-440c-a758-56b47b05476c','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260805-3160 telah dibayar senilai Rp 5.000.000','ORDER',0,'2026-08-05 07:32:58.798'),('60819968-c8c9-43c5-b4d7-70a6c794ca5a','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260805-3859 telah dibayar senilai Rp 2.400.000','ORDER',0,'2026-08-05 07:35:21.070'),('6676d48e-f11e-42e8-9599-c5d91aab4ed8','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260802-8948 telah dibayar senilai Rp 650.000','ORDER',1,'2026-08-02 15:02:03.813'),('6b451ce9-d908-47bb-8292-b4c7f9c2969d','usr-superadmin-1','Request Refund Baru','User undefined meminta refund untuk Order VSC-20260731-4365','REFUND',1,'2026-08-02 14:53:33.998'),('710002fc-51a4-4001-845b-7e566d134190','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-8108 telah dibayar senilai Rp 1.500.000','ORDER',1,'2026-08-04 10:14:11.695'),('74297346-7a90-4617-b0e0-a6c86c7d0457','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260805-3160 telah dibayar senilai Rp 5.000.000','ORDER',0,'2026-08-05 07:32:58.798'),('78d35169-96c4-4f10-ad13-95f8549deba7','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-2128 telah dibayar senilai Rp 400.000','ORDER',0,'2026-08-04 09:26:40.644'),('797a9307-ec5e-4b92-9085-24dbbd20aea5','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260805-9306 telah dibayar senilai Rp 3.500.000','ORDER',0,'2026-08-05 07:56:52.762'),('7a5ebe36-01b5-416f-a8ae-925e101bf521','usr-superadmin-1','Request Refund Baru','User undefined meminta refund untuk Order VSC-20260731-5396','REFUND',1,'2026-08-02 14:54:44.404'),('7c7795cc-2719-4033-bf83-fc41b0e17a66','usr-admin-1','Request Refund Baru','User undefined meminta refund untuk Order VSC-20260731-5396','REFUND',1,'2026-08-02 14:54:44.404'),('7d6b938f-dff3-40dc-971b-d3e7917be119','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260803-7399 telah dibayar senilai Rp 500.000','ORDER',1,'2026-08-03 09:35:29.091'),('81925af5-5161-4c52-a70d-d94faae50805','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260805-9306 telah dibayar senilai Rp 3.500.000','ORDER',0,'2026-08-05 07:56:52.762'),('85019095-ce38-45ac-a691-660d457a7cec','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-2128 telah dibayar senilai Rp 400.000','ORDER',1,'2026-08-04 09:26:40.644'),('8a5c078d-1528-40fd-adad-c0d2bf493f20','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260805-7012 telah dibayar senilai Rp 1.600.000','ORDER',0,'2026-08-05 07:15:24.000'),('8cfa60e0-3bb0-4612-9dd3-32166bed7515','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-8108 telah dibayar senilai Rp 1.500.000','ORDER',0,'2026-08-04 10:14:11.695'),('990f483c-131a-4fbf-8ab1-6147e26f62eb','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-2163 telah dibayar senilai Rp 2.000.000','ORDER',1,'2026-08-04 09:43:28.056'),('9f606951-c9ea-4005-b188-ad5bab9b028b','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260805-6090 telah dibayar senilai Rp 2.400.000','ORDER',0,'2026-08-05 03:20:16.572'),('a7e76080-5455-4c01-a8c9-fea8a669e3e7','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260802-8948 telah dibayar senilai Rp 650.000','ORDER',1,'2026-08-02 15:02:03.813'),('af7e75ed-b50a-45c9-8f4f-b265977a211f','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260802-8074 telah dibayar senilai Rp 1.000.000','ORDER',1,'2026-08-02 13:54:24.737'),('b1452fe7-dbcc-497d-ad46-24fdac7e9920','usr-admin-1','Request Refund Baru','User undefined meminta refund untuk Order VSC-20260731-4365','REFUND',1,'2026-08-02 14:53:33.998'),('b7c47de1-a0ee-4885-aa96-3e56731777cd','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260803-7399 telah dibayar senilai Rp 500.000','ORDER',1,'2026-08-03 09:35:29.091'),('bb24c622-3555-421a-b6bd-204db14b1160','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260801-5559 telah dibayar senilai Rp 550.000','ORDER',1,'2026-08-01 09:48:03.605'),('c814420f-6322-4aae-8f20-85b80d5766f9','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-3477 telah dibayar senilai Rp 1.900.000','ORDER',0,'2026-08-04 09:53:11.649'),('d1aba414-7603-4c52-88a8-6691a6dec5aa','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260803-2754 telah dibayar senilai Rp 950.000','ORDER',1,'2026-08-03 08:31:19.926'),('d4b0a790-d29e-488e-8889-79dc999c9a6a','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-2163 telah dibayar senilai Rp 2.000.000','ORDER',0,'2026-08-04 09:43:28.056'),('dad0b4d0-488d-457b-b400-6379531feed4','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260805-2663 telah dibayar senilai Rp 2.000.000','ORDER',1,'2026-08-05 07:11:09.392'),('db1e6b0f-a771-4d34-8e91-f82bcd6bac0a','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-3722 telah dibayar senilai Rp 20.000.000','ORDER',1,'2026-08-04 09:45:16.970'),('df73068f-5c9e-4c7d-87d7-87d41e362e3b','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-3477 telah dibayar senilai Rp 1.900.000','ORDER',1,'2026-08-04 09:53:11.649'),('eb559d1d-438e-4dd5-b0e0-e7cb95730ec5','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-2519 telah dibayar senilai Rp 1.800.000','ORDER',1,'2026-08-04 10:04:55.998'),('ef600d73-59a1-4acb-984b-d2119ad636db','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260802-8074 telah dibayar senilai Rp 1.000.000','ORDER',1,'2026-08-02 13:54:24.737'),('effa1038-5251-4139-81ef-a020e5e84845','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260805-3859 telah dibayar senilai Rp 2.400.000','ORDER',0,'2026-08-05 07:35:21.070'),('f0ac6fcf-177f-45a8-a9d4-0e597d20527d','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260801-5559 telah dibayar senilai Rp 550.000','ORDER',1,'2026-08-01 09:48:03.605'),('f2035ad8-68d7-4ee9-bbab-97c3a088a172','usr-admin-1','Pesanan Lunas','Pesanan VSC-20260804-8373 telah dibayar senilai Rp 2.400.000','ORDER',1,'2026-08-04 08:24:50.615'),('fed6f8ca-65e7-4079-9cd2-1fa0f04e6844','usr-superadmin-1','Pesanan Lunas','Pesanan VSC-20260804-8373 telah dibayar senilai Rp 2.400.000','ORDER',0,'2026-08-04 08:24:50.615');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','PAID','CANCELLED','EXPIRED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `payment_proof` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` enum('MANUAL_TRANSFER','DOKU_VA','DOKU_QRIS','DOKU_EWALLET') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MANUAL_TRANSFER',
  `doku_reference_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_channel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_key` (`order_number`),
  UNIQUE KEY `orders_doku_reference_id_key` (`doku_reference_id`),
  KEY `orders_customer_id_fkey` (`customer_id`),
  CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('000a4406-5d5f-4272-9504-cc322f8c976e','VSC-20260731-8149','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1800000.00,'PAID',NULL,'DOKU_EWALLET','2436616261','DOKU_CHECKOUT','2026-07-31 12:42:58.802','2026-07-31 12:27:58.804','2026-07-31 12:28:23.595'),('097efe79-34ec-48b6-971e-73714417c8b4','VSC-20260804-1721','8fa25887-c152-4e31-8456-85ef26db9469',1200000.00,'PAID',NULL,'DOKU_EWALLET','EMONEY_SHOPEE_PAY2225260804162235301107164121776796549182','DOKU_CHECKOUT','2026-08-04 09:27:34.969','2026-08-04 09:22:34.971','2026-08-04 09:23:14.891'),('0c322854-a7c0-45ba-bb9f-6f2f2e5962b5','VSC-20260805-9306','usr-customer-dandi',3500000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260805145417955107164121776023163730','DOKU_CHECKOUT','2026-08-05 07:59:18.179','2026-08-05 07:54:18.181','2026-08-05 07:56:52.741'),('0e60d70b-9cd9-4e85-b5c7-fd07d5414bd1','VSC-20260804-3477','usr-customer-dandi',1900000.00,'PAID',NULL,'DOKU_QRIS','EMONEY_SHOPEE_PAY2225260804165238162107164121776809577650','DOKU_CHECKOUT','2026-08-04 09:57:38.080','2026-08-04 09:52:38.082','2026-08-04 09:53:11.618'),('1e9bd4eb-9f3b-4a49-92f2-e18e1321de21','VSC-20260804-6319','58fae8cd-41b9-4a9f-8dc3-93278726df64',2400000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804172338411107164121776822497172','DOKU_CHECKOUT','2026-08-04 10:28:38.233','2026-08-04 10:23:38.237','2026-08-04 10:23:59.799'),('28ecfe2c-cbd7-4a83-8a52-67cbb8a52921','VSC-20260731-7606','usr-customer-dandi',950000.00,'PAID',NULL,'DOKU_VA',NULL,'DOKU_VA','2026-07-31 08:20:08.460','2026-07-31 08:05:08.462','2026-07-31 08:07:22.233'),('2c3ae94d-fef8-4ae5-8b94-3d611b0d5d1a','VSC-20260731-9661','usr-customer-dandi',2500000.00,'PAID',NULL,'MANUAL_TRANSFER',NULL,NULL,'2026-07-31 07:47:09.937','2026-07-31 07:32:09.940','2026-07-31 07:34:04.048'),('36698f9c-b876-42f2-a6b6-e701949d1f96','VSC-20260803-2754','usr-customer-dandi',950000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-08-03 08:34:57.767','2026-08-03 08:29:57.769','2026-08-03 08:31:19.841'),('383bbb04-143c-43ad-8f0b-d5eeca5a5c6a','VSC-20260805-7012','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1600000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260805141452656107164121776012295436','DOKU_CHECKOUT','2026-08-05 07:19:49.893','2026-08-05 07:14:49.895','2026-08-05 07:15:23.980'),('44849e5f-5dcb-4365-a522-86e3753de2e8','VSC-20260731-7554','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1000000.00,'PAID',NULL,'DOKU_EWALLET',NULL,'SHOPEEPAY','2026-07-31 14:17:22.973','2026-07-31 14:12:22.975','2026-07-31 14:25:30.472'),('5166c681-100e-4aa6-a88e-44a7b4bc83d3','VSC-20260801-5559','8fa25887-c152-4e31-8456-85ef26db9469',550000.00,'PAID',NULL,'DOKU_EWALLET',NULL,'SHOPEEPAY','2026-08-01 09:35:23.661','2026-08-01 09:30:23.662','2026-08-01 09:42:52.683'),('59c33344-a51f-455c-ae32-87c6734abb98','VSC-20260731-6406','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1000000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-07-31 09:38:21.411','2026-07-31 09:23:21.413','2026-07-31 09:23:28.433'),('67c4bc68-9352-47eb-a5a3-77984a21445f','VSC-20260804-2519','usr-customer-dandi',1800000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804170433060107164121776816487415','DOKU_CHECKOUT','2026-08-04 10:09:32.965','2026-08-04 10:04:32.966','2026-08-04 10:04:55.957'),('697f49f6-06f8-4e32-9f5a-771ad0ade49c','VSC-20260804-2163','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',2000000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804164251566107164121776803239176','DOKU_CHECKOUT','2026-08-04 09:47:49.920','2026-08-04 09:42:49.921','2026-08-04 09:43:28.008'),('788e86e2-f740-4626-a267-960670ae4dc0','VSC-20260804-4893','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1200000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804153343065107164121776764793127','DOKU_CHECKOUT','2026-08-04 08:05:46.065','2026-08-04 08:00:46.078','2026-08-04 08:34:00.616'),('791e3393-4f93-4d1b-bc01-3b06d32b3f41','VSC-20260802-8948','usr-customer-dandi',650000.00,'PAID',NULL,'DOKU_EWALLET',NULL,'SHOPEEPAY','2026-08-02 15:06:21.594','2026-08-02 15:01:21.595','2026-08-02 15:02:03.718'),('828f92b0-868b-4357-a437-6eef06a8e4c8','VSC-20260731-3041','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',3500000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-07-31 08:34:54.954','2026-07-31 08:19:54.956','2026-07-31 08:20:02.312'),('836f1f65-22d3-49d1-9014-dbf17e54bd3a','VSC-20260804-7490','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1200000.00,'PAID',NULL,'DOKU_VA','SIMULATED_DOKU_ID','SIMULATION','2026-08-04 05:01:58.922','2026-08-04 04:56:58.923','2026-08-04 08:25:28.418'),('83e8b796-3393-4af8-80c5-4eada0629c21','VSC-20260805-3160','usr-customer-dandi',5000000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260805143221417107164121776016478126','DOKU_CHECKOUT','2026-08-05 07:37:21.632','2026-08-05 07:32:21.633','2026-08-05 07:32:58.773'),('888acfba-e050-4fa6-a8e2-cdcfe9acf44a','VSC-20260731-2482','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',4000000.00,'PAID',NULL,'DOKU_EWALLET','EMONEY_SHOPEE_PAY2225260731212145737107164121776036398050','DOKU_CHECKOUT','2026-07-31 14:26:45.155','2026-07-31 14:21:45.157','2026-07-31 14:22:15.347'),('88f6524a-4e33-4810-943f-d87d06639364','VSC-20260731-7410','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1200000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-07-31 12:37:29.991','2026-07-31 12:22:29.993','2026-07-31 12:27:40.775'),('8f0cc323-6017-4726-8498-3022a6b526fc','VSC-20260801-2677','8fa25887-c152-4e31-8456-85ef26db9469',1900000.00,'PAID',NULL,'DOKU_EWALLET',NULL,'SHOPEEPAY','2026-08-01 07:44:20.811','2026-08-01 07:39:20.815','2026-08-01 07:41:04.637'),('9ad4d325-e890-4171-a2d5-e2335b0cd2ad','VSC-20260731-4058','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',400000.00,'PAID',NULL,'DOKU_EWALLET','EMONEY_SHOPEE_PAY2225260731205122013107164121776033572971','DOKU_CHECKOUT','2026-07-31 13:56:25.425','2026-07-31 13:51:25.428','2026-07-31 13:52:08.776'),('a93df11f-8492-4efd-b426-45bbec4d9046','VSC-20260731-3276','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',950000.00,'PAID',NULL,'DOKU_EWALLET',NULL,'OVO','2026-07-31 14:14:21.538','2026-07-31 14:09:21.540','2026-07-31 14:12:01.222'),('af6e393d-e210-4360-ba69-886615c9dd60','VSC-20260731-4039','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1800000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-07-31 08:40:32.113','2026-07-31 08:25:32.116','2026-07-31 08:25:35.830'),('b59d040f-0991-4f33-b8ad-f98044c933a7','VSC-20260805-2663','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',2000000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260805141034013107164121776011145108','DOKU_CHECKOUT','2026-08-05 07:15:32.207','2026-08-05 07:10:32.210','2026-08-05 07:11:09.343'),('b8626039-2359-4678-8be5-6f899dc6f404','VSC-20260804-8373','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',2400000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804152434465107164121776762402238','DOKU_CHECKOUT','2026-08-04 05:00:04.816','2026-08-04 04:55:04.817','2026-08-04 08:24:50.499'),('b899659d-e61b-4d6c-85ff-a0e5540dbf57','VSC-20260731-2547','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',950000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-07-31 12:18:33.821','2026-07-31 12:03:33.823','2026-07-31 12:04:15.603'),('bb1f3741-f291-4c4b-94ba-3d0d95572ba8','VSC-20260804-2685','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1200000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804164800239107164121776803853903','DOKU_CHECKOUT','2026-08-04 09:52:58.462','2026-08-04 09:47:58.463','2026-08-04 09:48:19.438'),('d1d43ab5-9978-4e6c-9225-a06115c47aa3','VSC-20260804-2128','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',400000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804162615171107164121776798731960','DOKU_CHECKOUT','2026-08-04 09:31:03.228','2026-08-04 09:26:03.230','2026-08-04 09:26:40.624'),('d2a55457-5f74-402d-8580-01062911540f','VSC-20260731-9529','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',5000000.00,'PAID',NULL,'DOKU_VA',NULL,'BCA_VA','2026-07-31 14:02:12.265','2026-07-31 13:57:12.267','2026-07-31 14:08:43.172'),('d6f9213d-260b-481e-b462-4c8daf5fcbd5','VSC-20260731-5396','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',5000000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-07-31 09:47:15.896','2026-07-31 09:32:15.898','2026-07-31 09:58:00.410'),('dc9242b3-ed09-4856-b2c1-9557d32eae00','VSC-20260804-8108','usr-customer-dandi',1500000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260804171346101107164121776821549349','DOKU_CHECKOUT','2026-08-04 10:18:45.023','2026-08-04 10:13:45.025','2026-08-04 10:14:11.663'),('df18163d-833f-4458-9509-31adc319a0cc','VSC-20260805-6090','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',2400000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260805101951500107164121776937817583','DOKU_CHECKOUT','2026-08-05 03:24:48.520','2026-08-05 03:19:48.532','2026-08-05 03:20:16.494'),('df818d26-eaef-4122-bfda-47539c42ce00','VSC-20260803-7399','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',500000.00,'PAID',NULL,'DOKU_EWALLET',NULL,'SHOPEEPAY','2026-08-03 09:39:30.044','2026-08-03 09:34:30.047','2026-08-03 09:35:29.008'),('ec88caca-906e-4b53-b112-3de381755b8d','VSC-20260802-8074','8fa25887-c152-4e31-8456-85ef26db9469',1000000.00,'PAID',NULL,'DOKU_EWALLET',NULL,'SHOPEEPAY','2026-08-02 13:58:38.303','2026-08-02 13:53:38.307','2026-08-02 13:54:24.645'),('ef6de377-6792-476c-832b-c6add81ede88','VSC-20260805-3859','usr-customer-dandi',2400000.00,'PAID',NULL,'DOKU_VA','EMONEY_SHOPEE_PAY2225260805143458874107164121776017229580','DOKU_CHECKOUT','2026-08-05 07:39:58.859','2026-08-05 07:34:58.861','2026-08-05 07:35:21.043'),('f1a13a35-3b55-4c0f-a14e-c8a3d2ea7415','VSC-20260731-9585','usr-customer-dandi',1800000.00,'PAID',NULL,'DOKU_VA',NULL,'DOKU_VA','2026-07-31 08:21:35.836','2026-07-31 08:06:35.838','2026-07-31 08:07:01.668'),('f307d0c7-b88a-4783-843e-5ba742e6fb7b','VSC-20260731-4365','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',2500000.00,'PAID',NULL,'DOKU_VA',NULL,'BCA_VA','2026-07-31 10:10:53.249','2026-07-31 09:55:53.251','2026-07-31 09:57:43.825'),('f8514397-494a-4ff3-b19e-f7861019b637','VSC-20260731-8316','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',1200000.00,'PAID',NULL,'DOKU_VA',NULL,'MANDIRI_VA','2026-07-31 10:19:17.902','2026-07-31 10:04:17.904','2026-07-31 12:03:55.432'),('fd40782a-c7c5-43bb-92cb-1d71a990fc3a','VSC-20260804-3722','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83',20000000.00,'PAID',NULL,'DOKU_VA','3ce76b4d3444d38804a27d61f7e2d62a','DOKU_CHECKOUT','2026-08-04 08:42:48.859','2026-08-04 08:37:48.861','2026-08-04 09:45:16.918');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refunds`
--

DROP TABLE IF EXISTS `refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refunds` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('REQUESTED','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REQUESTED',
  `processed_by` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `refunds_order_id_key` (`order_id`),
  CONSTRAINT `refunds_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refunds`
--

LOCK TABLES `refunds` WRITE;
/*!40000 ALTER TABLE `refunds` DISABLE KEYS */;
INSERT INTO `refunds` VALUES ('30b33bcd-be0b-418d-9137-f2095cad570d','f307d0c7-b88a-4783-843e-5ba742e6fb7b','pacar saya kurang suka nonton konser band ini tolong di tindak lanjutin','REQUESTED',NULL,'2026-08-02 14:53:33.957','2026-08-02 14:53:33.957'),('4060ef71-3e15-414d-8c20-8372f5c4909c','d6f9213d-260b-481e-b462-4c8daf5fcbd5','tes','REQUESTED',NULL,'2026-08-02 14:54:44.379','2026-08-02 14:54:44.379');
/*!40000 ALTER TABLE `refunds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('AVAILABLE','LOCKED','SOLD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `locked_until` datetime(3) DEFAULT NULL,
  `locked_by_user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seats_category_id_seat_number_key` (`category_id`,`seat_number`),
  CONSTRAINT `seats_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ticket_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES ('03f90232-6010-4bb4-a694-4647e98450dd','tc-10-1','S-7','SOLD','2026-07-31 09:38:21.403','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('0b2eb20e-206e-4c92-b50f-9aca28726ddc','tc-06-2','S-59','SOLD','2026-08-04 08:42:48.850','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('10150adb-b4bf-47b7-900f-0f14d4e35851','tc-06-2','S-58','SOLD','2026-08-04 08:42:48.810','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('102a1067-45ee-4e26-a674-ab783783246d','tc-13-1','S-1','SOLD','2026-07-31 14:02:12.189','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('10ab159b-6543-4230-92d0-73ee9b68e550','tc-09-3','S-6','SOLD','2026-07-31 14:17:22.963','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('1ae9e9a5-beb8-4c08-926e-51042962a1e1','tc-19-1','S-1','SOLD','2026-07-31 09:47:15.889','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('1c69386d-b43d-4d52-93ae-cbbafdca1994','tc-19-1','S-6','SOLD','2026-07-31 10:10:53.242','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('26521cc0-e4d8-4872-8ab9-48c0189ed2a2','tc-14-3','S-5','SOLD','2026-07-31 13:56:25.414','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('2a744f73-d880-41a2-9dbb-7552a5d5cd2b','tc-02-2','S-2','SOLD','2026-08-04 10:09:32.958','usr-customer-dandi'),('2ef6555b-42ba-4ab4-b870-3178c3ce5a02','tc-14-1','S-15','SOLD','2026-08-03 08:34:57.759','usr-customer-dandi'),('30ee5518-489b-4827-ab73-58aa60329c46','tc-15-1','S-1','SOLD','2026-08-04 09:47:49.913','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('36b783ff-ab94-4b52-a668-533efa92e0a9','tc-19-1','S-8','SOLD','2026-07-31 07:47:09.923','usr-customer-dandi'),('376b861f-e95b-4ff7-9351-e4736e170ae5','tc-22-2','S-87','SOLD','2026-07-31 08:21:35.830','usr-customer-dandi'),('3b7fbb7d-8115-4b49-8eb8-8ff8ba130e20','tc-14-1','S-1','SOLD','2026-08-01 07:44:20.774','8fa25887-c152-4e31-8456-85ef26db9469'),('3dffcee4-0cd1-4e6e-aec2-006c0094f147','tc-13-1','S-3','SOLD','2026-07-31 14:02:12.223','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('4228a1ed-300a-493f-a112-99224a2e4704','tc-14-1','S-5','SOLD','2026-08-04 09:57:38.058','usr-customer-dandi'),('46af552b-a537-4ada-9ccb-256afbad6b1d','tc-14-1','S-8','SOLD','2026-07-31 14:14:21.527','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('48c84669-b784-4308-ae97-a982d00b8189','tc-03-3','S-8','SOLD','2026-08-04 10:18:45.017','usr-customer-dandi'),('4d9e8b20-0797-4b23-aaa4-9cbd39477268','tc-09-3','S-4','SOLD','2026-07-31 14:17:22.939','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('4e629bce-6750-49ac-86e5-4d6054bc34de','tc-03-1','S-2','SOLD','2026-07-31 08:40:32.105','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('522028c3-7749-473e-b2d6-f9eb41f73fee','tc-14-1','S-9','SOLD','2026-07-31 08:20:08.453','usr-customer-dandi'),('588a40c9-ffad-4db1-8f6c-5b4ec2f6b925','tc-14-3','S-6','SOLD','2026-08-04 09:31:03.220','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('5c5baf2f-51b4-48d3-a367-27d9ef6c40d3','tc-03-1','S-6','SOLD','2026-07-31 12:42:58.795','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('67479e1f-fe38-47c1-a9ae-6a2889c6b66c','tc-10-2','S-3','SOLD','2026-08-02 15:06:21.579','usr-customer-dandi'),('717d8a83-fbb3-4f11-aa7a-0cd219afbd0b','tc-09-3','S-7','SOLD','2026-08-03 09:39:30.031','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('78c829d5-9650-48a7-965f-6638ff1a9e33','tc-14-1','S-10','SOLD','2026-07-31 12:18:33.811','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('792856e9-5dfd-4a0e-b631-c7f0beb39d3c','tc-06-2','S-60','SOLD','2026-08-04 08:42:48.829','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('8407b8b4-39f6-41c5-9b0b-cd40877b9554','tc-03-2','S-5','SOLD','2026-08-04 09:27:34.954','8fa25887-c152-4e31-8456-85ef26db9469'),('8433f531-dd14-4813-a3af-7f10169e3bd0','tc-02-2','S-1','SOLD','2026-08-04 10:09:32.940','usr-customer-dandi'),('88f2ea34-f129-4c3a-baa2-48681a8427d8','tc-12-1','S-4','SOLD','2026-08-05 07:37:21.623','usr-customer-dandi'),('9a92c5cc-d688-49a4-b622-6577f2e920be','tc-03-3','S-7','SOLD','2026-08-04 10:18:45.000','usr-customer-dandi'),('9ccd22d4-649b-4762-86eb-18b2cf886c5d','tc-14-1','S-6','SOLD','2026-08-04 09:57:38.074','usr-customer-dandi'),('a704087d-5066-4452-a79e-6aad584bb44a','tc-19-1','S-9','SOLD','2026-07-31 09:47:15.870','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('aae709c7-bc14-444c-808d-e34980a6db1a','tc-03-2','S-66','SOLD','2026-07-31 12:37:29.982','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('ad8c4616-55b2-40e8-9adc-6269bbfa6b8e','tc-14-1','S-2','SOLD','2026-08-01 07:44:20.801','8fa25887-c152-4e31-8456-85ef26db9469'),('b32dae1d-7223-442f-981d-ce05e79f35b2','tc-13-2','S-59','SOLD','2026-08-01 09:35:23.651','8fa25887-c152-4e31-8456-85ef26db9469'),('b6542869-eefe-4953-9d6b-67a130febf64','tc-09-1','S-2','SOLD','2026-08-04 05:00:04.795','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('b97d2652-fd1f-40d5-91d7-1e68af775013','tc-06-2','S-57','SOLD','2026-08-04 08:42:48.789','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('bc063b0b-5632-424d-b352-b74cd7534544','tc-09-1','S-5','SOLD','2026-08-04 09:52:58.455','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('bda152c7-484f-47d5-bc1a-e3677c48dd4f','tc-13-1','S-2','SOLD','2026-07-31 14:02:12.207','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('c1c359f4-cde6-49ac-9344-88cc65dc5430','tc-06-3','S-68','SOLD','2026-07-31 08:34:54.945','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('c1ecea03-0d66-47f9-96d9-a19212371c78','tc-09-1','S-3','SOLD','2026-08-04 05:00:04.810','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('d260f97c-de83-4ab4-9a6d-9f573d86bf27','tc-13-1','S-4','SOLD','2026-07-31 14:02:12.256','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('e19da523-463e-4ee0-8970-f9e7863062d0','tc-08-4','S-1','SOLD','2026-08-05 07:15:32.198','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('e1e7c3d2-ce09-4e1d-90d8-1ce702b19a98','tc-13-1','S-5','SOLD','2026-07-31 14:02:12.239','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('e2d5c14d-3ba3-4ce0-912e-fcfae193717d','tc-09-1','VIP-A01','SOLD','2026-07-31 10:19:17.896','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83'),('e9c8157b-b102-4fe5-a22f-8ab885c272e8','tc-09-1','S-1','LOCKED','2026-08-04 04:56:19.648',NULL),('f19730f8-15f2-4723-af4c-7897db456ea0','tc-13-1','S-6','SOLD','2026-08-02 13:58:38.289','8fa25887-c152-4e31-8456-85ef26db9469'),('f6f58d2b-1ef4-4e3a-ad66-d394ec0f2292','tc-09-1','S-4','SOLD','2026-08-04 05:01:58.915','ad5a9c82-8b54-4aed-bfb2-28b3098b2f83');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_categories`
--

DROP TABLE IF EXISTS `ticket_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_categories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `total_seats` int NOT NULL,
  `sales_start_date` datetime(3) DEFAULT NULL,
  `sales_end_date` datetime(3) DEFAULT NULL,
  `early_bird_price` decimal(12,2) DEFAULT NULL,
  `early_bird_start_date` datetime(3) DEFAULT NULL,
  `early_bird_end_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ticket_categories_event_id_fkey` (`event_id`),
  CONSTRAINT `ticket_categories_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_categories`
--

LOCK TABLES `ticket_categories` WRITE;
/*!40000 ALTER TABLE `ticket_categories` DISABLE KEYS */;
INSERT INTO `ticket_categories` VALUES ('tc-01-1','evt-01','VIP VISCERAL EMERALD',2500000.00,50,NULL,NULL,2000000.00,'2026-07-26 14:19:09.000','2026-08-05 14:19:09.000','2026-07-31 14:19:09.642'),('tc-01-2','evt-01','CAT 1 FRONT STAGE',1500000.00,100,NULL,NULL,1200000.00,'2026-07-26 14:19:09.000','2026-08-05 14:19:09.000','2026-07-31 14:19:09.642'),('tc-01-3','evt-01','CAT 2 TRIBUNE A',850000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.642'),('tc-01-4','evt-01','FESTIVAL (GA)',500000.00,500,NULL,NULL,350000.00,'2026-07-26 14:19:09.000','2026-08-05 14:19:09.000','2026-07-31 14:19:09.642'),('tc-02-1','evt-02','VIP',1500000.00,80,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.651'),('tc-02-2','evt-02','CAT 1',900000.00,150,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.651'),('tc-02-3','evt-02','CAT 2',600000.00,300,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.651'),('tc-03-1','evt-03','VIP',1800000.00,60,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.655'),('tc-03-2','evt-03','CAT 1',1200000.00,120,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.655'),('tc-03-3','evt-03','CAT 2',750000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.655'),('tc-04-1','evt-04','SUPER VIP INFINITY',5500000.00,30,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.659'),('tc-04-2','evt-04','CAT 1 (FLOOR)',3800000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.659'),('tc-04-3','evt-04','CAT 2',2500000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.659'),('tc-04-4','evt-04','CAT 3',1500000.00,400,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.659'),('tc-04-5','evt-04','FESTIVAL (GA)',800000.00,800,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.659'),('tc-05-1','evt-05','VIP DIAMOND',4500000.00,40,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.663'),('tc-05-2','evt-05','CAT 1',3000000.00,120,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.663'),('tc-05-3','evt-05','CAT 2',2000000.00,250,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.663'),('tc-05-4','evt-05','FESTIVAL (GA)',1000000.00,600,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.663'),('tc-06-1','evt-06','VVIP GOLDEN',8500000.00,20,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.668'),('tc-06-2','evt-06','VIP',5000000.00,60,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.668'),('tc-06-3','evt-06','CAT 1',3500000.00,150,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.668'),('tc-06-4','evt-06','CAT 2',2000000.00,300,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.668'),('tc-06-5','evt-06','FESTIVAL (GA)',1200000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.668'),('tc-07-1','evt-07','BLINK VIP SOUNDCHECK',6500000.00,25,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.672'),('tc-07-2','evt-07','VIP',4500000.00,80,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.672'),('tc-07-3','evt-07','CAT 1',3000000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.672'),('tc-07-4','evt-07','CAT 2',1800000.00,400,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.672'),('tc-07-5','evt-07','FESTIVAL (GA)',1000000.00,700,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.672'),('tc-08-1','evt-08','LOVER VIP (FLOOR PIT)',9800000.00,15,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.677'),('tc-08-2','evt-08','CAT 1',5500000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.677'),('tc-08-3','evt-08','CAT 2',3500000.00,250,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.677'),('tc-08-4','evt-08','CAT 3',2000000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.677'),('tc-08-5','evt-08','FESTIVAL (GA)',1200000.00,900,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.677'),('tc-09-1','evt-09','VIP',1200000.00,50,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.681'),('tc-09-2','evt-09','PRESALE',750000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.681'),('tc-09-3','evt-09','GENERAL',500000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.681'),('tc-10-1','evt-10','VIP',1000000.00,60,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.685'),('tc-10-2','evt-10','CAT 1',650000.00,120,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.685'),('tc-10-3','evt-10','GENERAL',400000.00,250,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.685'),('tc-11-1','evt-11','VIP',2000000.00,50,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.690'),('tc-11-2','evt-11','CAT 1',1200000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.690'),('tc-11-3','evt-11','CAT 2',750000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.690'),('tc-12-1','evt-12','VIP DIAMOND',5000000.00,40,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.694'),('tc-12-2','evt-12','CAT 1',3500000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.694'),('tc-12-3','evt-12','CAT 2',2000000.00,250,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.694'),('tc-12-4','evt-12','FESTIVAL (GA)',1200000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.694'),('tc-13-1','evt-13','VIP',1000000.00,40,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.699'),('tc-13-2','evt-13','GENERAL',550000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.699'),('tc-14-1','evt-14','VIP',950000.00,50,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.702'),('tc-14-2','evt-14','PRESALE',600000.00,120,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.702'),('tc-14-3','evt-14','GENERAL',400000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.702'),('tc-15-1','evt-15','VIP',2000000.00,50,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.706'),('tc-15-2','evt-15','CAT 1',1200000.00,150,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.706'),('tc-15-3','evt-15','GENERAL',700000.00,300,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.706'),('tc-16-1','evt-16','VIP',1200000.00,40,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.711'),('tc-16-2','evt-16','PRESALE',750000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.711'),('tc-16-3','evt-16','GENERAL',500000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.711'),('tc-17-1','evt-17','VIP',1000000.00,60,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.716'),('tc-17-2','evt-17','CAT 1',650000.00,120,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.716'),('tc-17-3','evt-17','GENERAL',400000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.716'),('tc-18-1','evt-18','VIP DIAMOND',4500000.00,40,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.721'),('tc-18-2','evt-18','CAT 1',3000000.00,120,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.721'),('tc-18-3','evt-18','CAT 2',1800000.00,250,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.721'),('tc-18-4','evt-18','FESTIVAL (GA)',1000000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.721'),('tc-19-1','evt-19','VIP STANDING',2500000.00,50,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.727'),('tc-19-2','evt-19','CAT 1',1500000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.727'),('tc-19-3','evt-19','GENERAL',850000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.727'),('tc-20-1','evt-20','VIP PIT',5500000.00,30,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.731'),('tc-20-2','evt-20','CAT 1',3500000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.731'),('tc-20-3','evt-20','CAT 2',2000000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.731'),('tc-20-4','evt-20','FESTIVAL (GA)',1200000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.731'),('tc-21-1','evt-21','VIP',2000000.00,50,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.736'),('tc-21-2','evt-21','CAT 1',1200000.00,150,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.736'),('tc-21-3','evt-21','FESTIVAL (GA)',500000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.736'),('tc-22-1','evt-22','DAILY PASS',750000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.741'),('tc-22-2','evt-22','3-DAY PASS',1800000.00,300,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.741'),('tc-23-1','evt-23','DAILY PASS',350000.00,600,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.746'),('tc-23-2','evt-23','3-DAY PASS',900000.00,400,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.746'),('tc-24-1','evt-24','VIP',6000000.00,30,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.751'),('tc-24-2','evt-24','CAT 1',4000000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.751'),('tc-24-3','evt-24','CAT 2',2500000.00,200,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.751'),('tc-25-1','evt-25','EARLY BIRD 3-DAY',1200000.00,300,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.756'),('tc-25-2','evt-25','REGULAR 3-DAY',1800000.00,500,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.756'),('tc-25-3','evt-25','VIP 3-DAY',3500000.00,100,NULL,NULL,NULL,NULL,NULL,'2026-07-31 14:19:09.756');
/*!40000 ALTER TABLE `ticket_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','CHECKED_IN','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `checked_in_at` datetime(3) DEFAULT NULL,
  `checked_in_by_admin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tickets_ticket_code_key` (`ticket_code`),
  UNIQUE KEY `tickets_seat_id_key` (`seat_id`),
  KEY `tickets_order_id_fkey` (`order_id`),
  KEY `tickets_category_id_fkey` (`category_id`),
  KEY `tickets_checked_in_by_admin_fkey` (`checked_in_by_admin`),
  CONSTRAINT `tickets_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ticket_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `tickets_checked_in_by_admin_fkey` FOREIGN KEY (`checked_in_by_admin`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tickets_seat_id_fkey` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES ('0085c023-a3dc-4d0c-8c77-c7739d510c41','097efe79-34ec-48b6-971e-73714417c8b4','tc-03-2','8407b8b4-39f6-41c5-9b0b-cd40877b9554','QR-VSC-20260804-1721-S-5','CHECKED_IN','2026-08-05 03:41:47.930','usr-admin-1','2026-08-04 09:22:34.971'),('09a855b7-4ffb-4a44-b6ec-4f20e153ebfc','f1a13a35-3b55-4c0f-a14e-c8a3d2ea7415','tc-22-2','376b861f-e95b-4ff7-9351-e4736e170ae5','QR-VSC-20260731-9585-S-87','CHECKED_IN',NULL,NULL,'2026-07-31 08:06:35.838'),('0a3e168e-2d77-45dd-b8b4-e156aa76b145','67c4bc68-9352-47eb-a5a3-77984a21445f','tc-02-2','8433f531-dd14-4813-a3af-7f10169e3bd0','QR-VSC-20260804-2519-S-1','CHECKED_IN','2026-08-04 10:15:05.126','usr-admin-1','2026-08-04 10:04:32.966'),('1d477148-1a1d-4124-863e-5083ef436845','44849e5f-5dcb-4365-a522-86e3753de2e8','tc-09-3','10ab159b-6543-4230-92d0-73ee9b68e550','QR-VSC-20260731-7554-S-6','ACTIVE',NULL,NULL,'2026-07-31 14:12:22.975'),('1fddffcd-ea3e-4a6e-b962-6277df8e738f','83e8b796-3393-4af8-80c5-4eada0629c21','tc-12-1','88f2ea34-f129-4c3a-baa2-48681a8427d8','QR-VSC-20260805-3160-S-4','CHECKED_IN','2026-08-05 07:34:30.387','usr-admin-1','2026-08-05 07:32:21.633'),('2dd968d5-7592-4dd0-8c78-0caa8dc38ebd','788e86e2-f740-4626-a267-960670ae4dc0','tc-20-4',NULL,'QR-VSC-20260804-4893-4593','CHECKED_IN','2026-08-04 08:35:02.514','usr-admin-1','2026-08-04 08:00:46.078'),('2e9a555b-435d-4e88-9be9-361c52a04fb4','59c33344-a51f-455c-ae32-87c6734abb98','tc-10-1','03f90232-6010-4bb4-a694-4647e98450dd','QR-VSC-20260731-6406-S-7','ACTIVE',NULL,NULL,'2026-07-31 09:23:21.413'),('31998b76-c26d-40a6-81a9-76657f7953ec','0c322854-a7c0-45ba-bb9f-6f2f2e5962b5','tc-25-3',NULL,'QR-VSC-20260805-9306-7983','CHECKED_IN','2026-08-05 07:57:23.196','usr-admin-1','2026-08-05 07:54:18.181'),('35c62376-6bf2-4fc9-a4c2-f9ab8443a252','0e60d70b-9cd9-4e85-b5c7-fd07d5414bd1','tc-14-1','9ccd22d4-649b-4762-86eb-18b2cf886c5d','QR-VSC-20260804-3477-S-6','CHECKED_IN','2026-08-04 09:53:32.256','usr-admin-1','2026-08-04 09:52:38.082'),('38270760-77c1-4b5b-ae03-0f2d61273d81','bb1f3741-f291-4c4b-94ba-3d0d95572ba8','tc-09-1','bc063b0b-5632-424d-b352-b74cd7534544','QR-VSC-20260804-2685-S-5','CHECKED_IN','2026-08-04 09:49:10.618','usr-admin-1','2026-08-04 09:47:58.463'),('3cdbbff6-0989-4b2b-9615-fb356b208217','fd40782a-c7c5-43bb-92cb-1d71a990fc3a','tc-06-2','b97d2652-fd1f-40d5-91d7-1e68af775013','QR-VSC-20260804-3722-S-57','ACTIVE',NULL,NULL,'2026-08-04 08:37:48.861'),('3f8875b5-28c5-4137-a7ab-794973594a29','8f0cc323-6017-4726-8498-3022a6b526fc','tc-14-1','3b7fbb7d-8115-4b49-8eb8-8ff8ba130e20','QR-VSC-20260801-2677-S-1','CHECKED_IN','2026-08-05 03:43:57.497','usr-admin-1','2026-08-01 07:39:20.815'),('41da6ff3-7081-48ba-81c8-b55941e01efc','383bbb04-143c-43ad-8f0b-d5eeca5a5c6a','tc-04-5',NULL,'QR-VSC-20260805-7012-5810','CHECKED_IN','2026-08-05 07:16:06.488','usr-admin-1','2026-08-05 07:14:49.895'),('4293c1de-da65-4559-86d1-5d225c196cdf','ef6de377-6792-476c-832b-c6add81ede88','tc-01-2',NULL,'QR-VSC-20260805-3859-5827','CHECKED_IN','2026-08-05 07:38:22.963','usr-admin-1','2026-08-05 07:34:58.861'),('4633fe05-d15b-4dd6-a400-2b1fc566b35f','a93df11f-8492-4efd-b426-45bbec4d9046','tc-14-1','46af552b-a537-4ada-9ccb-256afbad6b1d','QR-VSC-20260731-3276-S-8','ACTIVE',NULL,NULL,'2026-07-31 14:09:21.540'),('47663cb5-64e3-4376-b819-fb0169123afe','d6f9213d-260b-481e-b462-4c8daf5fcbd5','tc-19-1','a704087d-5066-4452-a79e-6aad584bb44a','QR-VSC-20260731-5396-S-9','ACTIVE',NULL,NULL,'2026-07-31 09:32:15.898'),('49e2b6dd-5a11-43c0-9827-1871e616a130','9ad4d325-e890-4171-a2d5-e2335b0cd2ad','tc-14-3','26521cc0-e4d8-4872-8ab9-48c0189ed2a2','QR-VSC-20260731-4058-S-5','ACTIVE',NULL,NULL,'2026-07-31 13:51:25.428'),('4ab965a2-a50b-4aba-8c4d-4e77cb212af5','2c3ae94d-fef8-4ae5-8b94-3d611b0d5d1a','tc-19-1','36b783ff-ab94-4b52-a668-533efa92e0a9','QR-VSC-20260731-9661-S-8','CHECKED_IN','2026-08-04 09:51:16.507','usr-admin-1','2026-07-31 07:32:09.940'),('4cabdcb9-988d-4182-aac4-3351c035facf','d1d43ab5-9978-4e6c-9225-a06115c47aa3','tc-14-3','588a40c9-ffad-4db1-8f6c-5b4ec2f6b925','QR-VSC-20260804-2128-S-6','ACTIVE',NULL,NULL,'2026-08-04 09:26:03.230'),('4fbbac54-649b-48a3-aafb-be68a76a4ac6','828f92b0-868b-4357-a437-6eef06a8e4c8','tc-06-3','c1c359f4-cde6-49ac-9344-88cc65dc5430','QR-VSC-20260731-3041-S-68','ACTIVE',NULL,NULL,'2026-07-31 08:19:54.956'),('50fad9ae-9a3c-4c20-a52d-853ef1886da4','ef6de377-6792-476c-832b-c6add81ede88','tc-01-2',NULL,'QR-VSC-20260805-3859-9257','CHECKED_IN','2026-08-05 07:36:27.034','usr-admin-1','2026-08-05 07:34:58.861'),('583016ad-5f87-442f-9820-ce5ff6b50d07','d2a55457-5f74-402d-8580-01062911540f','tc-13-1','3dffcee4-0cd1-4e6e-aec2-006c0094f147','QR-VSC-20260731-9529-S-3','ACTIVE',NULL,NULL,'2026-07-31 13:57:12.267'),('5ba68797-0f00-4ce7-86ae-8fc2c330eadd','d2a55457-5f74-402d-8580-01062911540f','tc-13-1','bda152c7-484f-47d5-bc1a-e3677c48dd4f','QR-VSC-20260731-9529-S-2','ACTIVE',NULL,NULL,'2026-07-31 13:57:12.267'),('63b10c2b-ed33-42b5-9fc5-6accb3a54cd9','df18163d-833f-4458-9509-31adc319a0cc','tc-12-4',NULL,'QR-VSC-20260805-6090-9276','CHECKED_IN','2026-08-05 03:38:07.260','usr-admin-1','2026-08-05 03:19:48.532'),('6457e94d-a513-43ae-818e-22d0eec116ca','f307d0c7-b88a-4783-843e-5ba742e6fb7b','tc-19-1','1c69386d-b43d-4d52-93ae-cbbafdca1994','QR-VSC-20260731-4365-S-6','CHECKED_IN','2026-08-05 03:40:22.039','usr-admin-1','2026-07-31 09:55:53.251'),('67389ca3-c9c6-4b25-8624-aff96718ff24','d2a55457-5f74-402d-8580-01062911540f','tc-13-1','e1e7c3d2-ce09-4e1d-90d8-1ce702b19a98','QR-VSC-20260731-9529-S-5','ACTIVE',NULL,NULL,'2026-07-31 13:57:12.267'),('69678d85-5e06-4769-b402-8eb4ecf9deaf','d2a55457-5f74-402d-8580-01062911540f','tc-13-1','102a1067-45ee-4e26-a674-ab783783246d','QR-VSC-20260731-9529-S-1','ACTIVE',NULL,NULL,'2026-07-31 13:57:12.267'),('6b4b1278-c677-4668-9f00-5ed391474e73','383bbb04-143c-43ad-8f0b-d5eeca5a5c6a','tc-04-5',NULL,'QR-VSC-20260805-7012-7197','CHECKED_IN','2026-08-05 07:16:21.286','usr-admin-1','2026-08-05 07:14:49.895'),('6b808c5e-ae1a-4f65-a8d2-9da821e6f14c','836f1f65-22d3-49d1-9014-dbf17e54bd3a','tc-09-1','f6f58d2b-1ef4-4e3a-ad66-d394ec0f2292','QR-VSC-20260804-7490-S-4','ACTIVE',NULL,NULL,'2026-08-04 04:56:58.923'),('7088c5e2-26e4-4975-b486-bd10c6eb9fb2','67c4bc68-9352-47eb-a5a3-77984a21445f','tc-02-2','2a744f73-d880-41a2-9dbb-7552a5d5cd2b','QR-VSC-20260804-2519-S-2','CHECKED_IN','2026-08-05 07:58:11.758','usr-admin-1','2026-08-04 10:04:32.966'),('72e9d82c-0d0f-4847-9a90-f45b33dd7294','f8514397-494a-4ff3-b19e-f7861019b637','tc-09-1','e2d5c14d-3ba3-4ce0-912e-fcfae193717d','QR-VSC-20260731-8316-VIP-A01','ACTIVE',NULL,NULL,'2026-07-31 10:04:17.904'),('732e8844-c499-476d-ab61-d8600a6f345d','fd40782a-c7c5-43bb-92cb-1d71a990fc3a','tc-06-2','792856e9-5dfd-4a0e-b631-c7f0beb39d3c','QR-VSC-20260804-3722-S-60','ACTIVE',NULL,NULL,'2026-08-04 08:37:48.861'),('83834944-f36c-4449-b855-2a80a720e618','b59d040f-0991-4f33-b8ad-f98044c933a7','tc-08-4','e19da523-463e-4ee0-8970-f9e7863062d0','QR-VSC-20260805-2663-S-1','CHECKED_IN','2026-08-05 07:11:47.858','usr-admin-1','2026-08-05 07:10:32.210'),('8675011d-0103-4592-a151-352e07f7169d','af6e393d-e210-4360-ba69-886615c9dd60','tc-03-1','4e629bce-6750-49ac-86e5-4d6054bc34de','QR-VSC-20260731-4039-S-2','ACTIVE',NULL,NULL,'2026-07-31 08:25:32.116'),('882d751f-fb1f-4d2f-a89a-49ab28a9a6d2','0e60d70b-9cd9-4e85-b5c7-fd07d5414bd1','tc-14-1','4228a1ed-300a-493f-a112-99224a2e4704','QR-VSC-20260804-3477-S-5','CHECKED_IN','2026-08-05 07:58:41.196','usr-admin-1','2026-08-04 09:52:38.082'),('8840adb2-b895-46eb-ad79-789cec9245eb','d2a55457-5f74-402d-8580-01062911540f','tc-13-1','d260f97c-de83-4ab4-9a6d-9f573d86bf27','QR-VSC-20260731-9529-S-4','ACTIVE',NULL,NULL,'2026-07-31 13:57:12.267'),('8926dcfc-812d-4697-a13d-ac89253644cc','791e3393-4f93-4d1b-bc01-3b06d32b3f41','tc-10-2','67479e1f-fe38-47c1-a9ae-6a2889c6b66c','QR-VSC-20260802-8948-S-3','CHECKED_IN',NULL,NULL,'2026-08-02 15:01:21.595'),('90a0d487-7111-4ffa-8d6b-4e150b4b0150','df818d26-eaef-4122-bfda-47539c42ce00','tc-09-3','717d8a83-fbb3-4f11-aa7a-0cd219afbd0b','QR-VSC-20260803-7399-S-7','CHECKED_IN',NULL,NULL,'2026-08-03 09:34:30.047'),('9c99961c-fdf3-4224-8020-f0a66402b1aa','d6f9213d-260b-481e-b462-4c8daf5fcbd5','tc-19-1','1ae9e9a5-beb8-4c08-926e-51042962a1e1','QR-VSC-20260731-5396-S-1','ACTIVE',NULL,NULL,'2026-07-31 09:32:15.898'),('9dd02633-83f9-4759-a546-b31cd796b705','888acfba-e050-4fa6-a8e2-cdcfe9acf44a','tc-01-1',NULL,'QR-VSC-20260731-2482-8071','CHECKED_IN',NULL,NULL,'2026-07-31 14:21:45.157'),('a20927de-2522-484f-9540-23fa0188b844','44849e5f-5dcb-4365-a522-86e3753de2e8','tc-09-3','4d9e8b20-0797-4b23-aaa4-9cbd39477268','QR-VSC-20260731-7554-S-4','CHECKED_IN','2026-08-05 03:37:37.263','usr-admin-1','2026-07-31 14:12:22.975'),('a268aff4-63e6-4eb6-85a2-ab38b80aa7cb','697f49f6-06f8-4e32-9f5a-771ad0ade49c','tc-15-1','30ee5518-489b-4827-ab73-58aa60329c46','QR-VSC-20260804-2163-S-1','ACTIVE',NULL,NULL,'2026-08-04 09:42:49.921'),('a56e5e7b-8d29-4601-901d-610a094d549f','fd40782a-c7c5-43bb-92cb-1d71a990fc3a','tc-06-2','10150adb-b4bf-47b7-900f-0f14d4e35851','QR-VSC-20260804-3722-S-58','ACTIVE',NULL,NULL,'2026-08-04 08:37:48.861'),('b338e97f-5c5c-4abb-bfd6-51b7ed41a9ca','8f0cc323-6017-4726-8498-3022a6b526fc','tc-14-1','ad8c4616-55b2-40e8-9adc-6269bbfa6b8e','QR-VSC-20260801-2677-S-2','CHECKED_IN','2026-08-05 03:45:20.298','usr-admin-1','2026-08-01 07:39:20.815'),('b62fdd45-35e7-46cc-8099-11397cb835e7','df18163d-833f-4458-9509-31adc319a0cc','tc-12-4',NULL,'QR-VSC-20260805-6090-3701','CHECKED_IN','2026-08-05 03:49:12.496','usr-admin-1','2026-08-05 03:19:48.532'),('bbcbae7a-2a76-487a-aaae-363b807b8fe7','dc9242b3-ed09-4856-b2c1-9557d32eae00','tc-03-3','48c84669-b784-4308-ae97-a982d00b8189','QR-VSC-20260804-8108-S-8','CHECKED_IN','2026-08-04 10:15:35.978','usr-admin-1','2026-08-04 10:13:45.025'),('bd66aa45-2b40-4b3e-94d7-ce3e29d6b07c','000a4406-5d5f-4272-9504-cc322f8c976e','tc-03-1','5c5baf2f-51b4-48d3-a367-27d9ef6c40d3','QR-VSC-20260731-8149-S-6','ACTIVE',NULL,NULL,'2026-07-31 12:27:58.804'),('c51159c7-6106-4519-8cad-0f156b7ceed7','5166c681-100e-4aa6-a88e-44a7b4bc83d3','tc-13-2','b32dae1d-7223-442f-981d-ce05e79f35b2','QR-VSC-20260801-5559-S-59','CHECKED_IN','2026-08-05 03:41:34.112','usr-admin-1','2026-08-01 09:30:23.662'),('c6bfbd25-3cc6-49c7-a645-abdde2be9c0b','b8626039-2359-4678-8be5-6f899dc6f404','tc-09-1','b6542869-eefe-4953-9d6b-67a130febf64','QR-VSC-20260804-8373-S-2','ACTIVE',NULL,NULL,'2026-08-04 04:55:04.817'),('c6e38c55-ccba-4d26-bf90-6e4f54b5f290','1e9bd4eb-9f3b-4a49-92f2-e18e1321de21','tc-20-4',NULL,'QR-VSC-20260804-6319-9907','CHECKED_IN','2026-08-04 10:24:36.011','usr-admin-1','2026-08-04 10:23:38.237'),('cd802baf-04ad-48df-973a-8ce36d722ffe','ec88caca-906e-4b53-b112-3de381755b8d','tc-13-1','f19730f8-15f2-4723-af4c-7897db456ea0','QR-VSC-20260802-8074-S-6','CHECKED_IN',NULL,NULL,'2026-08-02 13:53:38.307'),('d91db5ee-6cf7-4774-80cc-268ac96eb387','1e9bd4eb-9f3b-4a49-92f2-e18e1321de21','tc-20-4',NULL,'QR-VSC-20260804-6319-2188','CHECKED_IN','2026-08-04 10:24:44.534','usr-admin-1','2026-08-04 10:23:38.237'),('dbc82be7-0fd3-48e8-85d7-9dde066bb5db','88f6524a-4e33-4810-943f-d87d06639364','tc-03-2','aae709c7-bc14-444c-808d-e34980a6db1a','QR-VSC-20260731-7410-S-66','ACTIVE',NULL,NULL,'2026-07-31 12:22:29.993'),('ea29d18e-5af7-4f9c-958b-1867af33ccbb','dc9242b3-ed09-4856-b2c1-9557d32eae00','tc-03-3','9a92c5cc-d688-49a4-b622-6577f2e920be','QR-VSC-20260804-8108-S-7','CHECKED_IN','2026-08-04 10:15:23.617','usr-admin-1','2026-08-04 10:13:45.025'),('ea7f5129-f754-4b33-8062-5c40f45cf4d3','36698f9c-b876-42f2-a6b6-e701949d1f96','tc-14-1','2ef6555b-42ba-4ab4-b870-3178c3ce5a02','QR-VSC-20260803-2754-S-15','CHECKED_IN',NULL,NULL,'2026-08-03 08:29:57.769'),('f313dbd5-5631-4f25-bfa8-0b7242466434','b899659d-e61b-4d6c-85ff-a0e5540dbf57','tc-14-1','78c829d5-9650-48a7-965f-6638ff1a9e33','QR-VSC-20260731-2547-S-10','ACTIVE',NULL,NULL,'2026-07-31 12:03:33.823'),('f3804b95-6240-4296-b0ba-e08a8f96834c','fd40782a-c7c5-43bb-92cb-1d71a990fc3a','tc-06-2','0b2eb20e-206e-4c92-b50f-9aca28726ddc','QR-VSC-20260804-3722-S-59','ACTIVE',NULL,NULL,'2026-08-04 08:37:48.861'),('f70d7c45-a4e5-471f-8f6d-e2f2fd14447f','888acfba-e050-4fa6-a8e2-cdcfe9acf44a','tc-01-1',NULL,'QR-VSC-20260731-2482-3758','ACTIVE',NULL,NULL,'2026-07-31 14:21:45.157'),('fa002737-b7af-40ee-875e-d0dcce646c52','28ecfe2c-cbd7-4a83-8a52-67cbb8a52921','tc-14-1','522028c3-7749-473e-b2d6-f9eb41f73fee','QR-VSC-20260731-7606-S-9','CHECKED_IN','2026-08-04 03:47:28.124','usr-admin-1','2026-07-31 08:05:08.462'),('ffd73231-bee5-46cd-bc21-c1b14be8b77c','b8626039-2359-4678-8be5-6f899dc6f404','tc-09-1','c1ecea03-0d66-47f9-96d9-a19212371c78','QR-VSC-20260804-8373-S-3','ACTIVE',NULL,NULL,'2026-08-04 04:55:04.817');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_verified` tinyint(1) NOT NULL DEFAULT '0',
  `otp_code_hash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_expires_at` datetime(3) DEFAULT NULL,
  `role` enum('SUPERADMIN','ADMIN','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('58fae8cd-41b9-4a9f-8dc3-93278726df64','bumi@gmail.com','$2b$10$t7KZIw5.aV3fEKcO30drPOkImK82vTO2sEtYh5Og9NCCyQ9pzFyNC','Bhumi','6212345678910',NULL,0,NULL,NULL,'CUSTOMER','2026-08-04 10:16:56.074','2026-08-04 10:16:56.074'),('8fa25887-c152-4e31-8456-85ef26db9469','arden@gmail.com','$2b$10$m7vX7JWn/sgF1RJzcVbnCOC0pC6vdhWFzFlHC/MDxDImu.s1nLVBO','Arden Pratama','6212345678910','user-8fa25887-c152-4e31-8456-85ef26db9469-1785680096099.jpg',0,NULL,NULL,'CUSTOMER','2026-08-01 07:37:59.595','2026-08-02 14:14:56.116'),('ad5a9c82-8b54-4aed-bfb2-28b3098b2f83','arkan@gmail.com','$2b$10$poWGJIFjTrA7TOj/usW1peDW98RDA9Ao3OlsO1seMAmNe3SXXMMeq','Arkan','62123456789','user-ad5a9c82-8b54-4aed-bfb2-28b3098b2f83-1785567928969.jpg',0,NULL,NULL,'CUSTOMER','2026-07-31 08:18:35.562','2026-08-01 07:05:28.979'),('cust-anon','anon@visceral.co','nopass','Pengunjung (Anonim)','-',NULL,0,NULL,NULL,'CUSTOMER','2026-07-31 14:28:13.510','2026-07-31 14:28:13.510'),('usr-admin-1','admin@visceral.co','$2b$10$SZLyt.iNZYvOyMWO1jsDW.OCUBumZbH.wZ6MESFyJo7enJcARWHG.','Admin Ops Jakarta','+628122233344','user-usr-admin-1-1785812312082.jpg',0,NULL,NULL,'ADMIN','2026-07-31 14:19:09.595','2026-08-04 02:58:32.089'),('usr-customer-dandi','dandi@visceral.co','$2b$10$hIwK2T866OMcabeAxg1KhODt3gC7NkMbEheouzwRkFgP7f0jH0oxq','Dandi ','','user-usr-customer-dandi-1785916355967.jpeg',0,NULL,NULL,'CUSTOMER','2026-07-31 14:19:09.595','2026-08-05 07:52:35.974'),('usr-superadmin-1','superadmin@visceral.co','$2b$10$.67i1RWm9LHN08Lcdgn01O1hLMfHypyQmoCCDjEcL8dcqzmxRmPy.','Superadmin Visceral','+628111222333','user-usr-superadmin-1-1785514165403.png',0,NULL,NULL,'SUPERADMIN','2026-07-31 14:19:09.595','2026-07-31 16:09:25.423');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-05 15:00:57

-- ==========================================
-- CONTOH QUERY SELECT (UNTUK TESTING/DEMO)
-- ==========================================

-- 1. Lihat semua User (Admin & Customer)
SELECT * FROM `User`;

-- 2. Lihat semua Event Konser beserta statusnya
SELECT id, title, eventDate, isPublished FROM `Event`;

-- 3. Lihat semua Kategori Tiket untuk event tertentu
SELECT eventId, name, price, capacity, available FROM `TicketCategory`;

-- 4. Lihat riwayat Pemesanan (Order) dan status pembayarannya
SELECT orderId, userId, eventId, totalAmount, status FROM `Order`;

-- 5. Lihat tiket yang sudah terbit beserta status check-in (Scanner)
SELECT ticketCode, status, orderId, categoryId, seatId, checkedInAt FROM `Ticket`;

-- 6. Lihat data Kursi (Seat Map) yang sudah di-booking atau tersedia
SELECT seatNumber, status, categoryId FROM `Seat`;

-- 7. Lihat riwayat Chat antara User dan Admin
SELECT senderId, receiverId, message, createdAt FROM `Chat`;

-- 8. Lihat daftar Log Audit (Riwayat Aktivitas Admin/Scanner)
SELECT adminId, action, targetId, details, createdAt FROM `AuditLog`;
