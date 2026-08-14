-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: board
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `email` varchar(50) NOT NULL COMMENT '사용자 이메일',
  `password` varchar(100) NOT NULL COMMENT '사용자 비밀번호',
  `nickname` varchar(20) NOT NULL COMMENT '사용자 닉네임',
  `tel_number` varchar(15) NOT NULL COMMENT '사용자 휴대전화번호',
  `address` text NOT NULL COMMENT '사용자 주소',
  `address_detail` text COMMENT '사용자 상세주소',
  `profile_image` text COMMENT '사용자 프로필 사진 URL',
  `agreed_personal` tinyint(1) NOT NULL COMMENT '개인정보 동의 여부',
  PRIMARY KEY (`email`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `tel_number` (`tel_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('email@email.com','P!ssw0rd','nickname','01012345678','서울특별시 강북구','롯데백화점',NULL,0),
('example@example.com','$2a$10$ikkkACp3m.D6qbw3WwTeXO2KjU2TdJyOC98XCvgJf2m39/jFMfDsW','user123','01056781234','123 Street, City','Apt 101',NULL,1),
('example@naver.com','$2a$10$y//FXM5gbG9EK49THC1TNOy2E24own6MWwxox1L6WHzw5keCMsfk.','감자','01012345678','any street','apt 101',NULL,1),
('user1@example.com','$2a$10$abc123xyzABC123xyzABC12OpQrsTUvWXyzABCD1234567890ab','고구마','01011112222','Seoul, Jongno-gu','Building 1, Room 302','https://example.com/profile1.jpg',1),
('test.user@gmail.com','$2a$10$qweRTYuiopQWERtyuiop12LMNoPQRstuVWXyzabcdEFGH567890','테스터','01022223333','Busan, Haeundae-gu','Ocean View 1203',NULL,0),
('hello@kakao.com','$2a$10$zxcVBNasdfZXCvbNasdf12JKLmNOPqrsTUVwxyZABCD56789012','hello123','01033334444','Incheon, Nam-gu','Happy Town 502','https://example.com/profile2.png',1),
('sample@domain.com','$2a$10$mnOPQRstuvMNOpqrSTuv12ABCDefGHIjkLMnoPQRstu567890','샘플','01044445555','Daejeon, Seo-gu','Sample Road 77, 2F',NULL,1),
('jane.doe@example.com','$2a$10$lkJHGFdsawLKjhgfDSAw12ZXCVbnmQWErtYUiopASDF567890','제인','01055556666','Daegu, Suseong-gu','Green Ville 801','https://example.com/profile3.jpg',0),
('john.smith@naver.com','$2a$10$poiUYTrEwqPOiuYTRewQ12MNBVcxzLKJhgFDsaPOIU567890','존스미스','01066667777','Gwangju, Buk-gu','Blue Garden 301',NULL,1),
('catlover@pets.com','$2a$10$asdFGHjkLqWErtyUIopA12ZXCVbnmLKJHgFDSaQWER567890','냥덕','01077778888','Ulsan, Jung-gu','Pet Street 15, 3F','https://example.com/catlover.jpg',1),
('codeguy@example.com','$2a$10$rfVBNmklopRFvbnMKLoP12QWERTyuiOPasDFGhJKL567890','codeGuy','01088889999','Any City, Any-gu','No Address Detail',NULL,0);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-01 16:11:58
