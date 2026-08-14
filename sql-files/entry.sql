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

CREATE TABLE `board` (
  `board_number` int NOT NULL AUTO_INCREMENT COMMENT '게시물 번호',
  `title` text NOT NULL COMMENT '게시물 제목',
  `content` text NOT NULL COMMENT '게시물 내용',
  `write_datetime` datetime DEFAULT NULL COMMENT '게시물 작성 날짜',
  `favorite_count` int NOT NULL DEFAULT '0' COMMENT '게시물 좋아요 수',
  `comment_count` int NOT NULL DEFAULT '0' COMMENT '게시물 댓글 수',
  `view_count` int NOT NULL DEFAULT '0' COMMENT '게시물 조회 수',
  `writer_email` varchar(50) NOT NULL COMMENT '게시물 작성자 이메일',
  PRIMARY KEY (`board_number`),
  KEY `FK_user_TO_board` (`writer_email`),
  CONSTRAINT `FK_user_TO_board` FOREIGN KEY (`writer_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='게시물 테이블';


CREATE TABLE `comment` (
  `comment_number` int NOT NULL AUTO_INCREMENT COMMENT '댓글 번호',
  `content` text NOT NULL COMMENT '댓글 내용',
  `write_datetime` datetime NOT NULL COMMENT '작성 날짜 및 시간',
  `user_email` varchar(50) NOT NULL COMMENT '사용자 이메일',
  `board_number` int NOT NULL COMMENT '게시물 번호',
  PRIMARY KEY (`comment_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='댓글 테이블';

CREATE TABLE `favorite` (
  `user_email` varchar(50) NOT NULL COMMENT '사용자 이메일',
  `board_number` int NOT NULL COMMENT '게시물 번호',
  PRIMARY KEY (`user_email`,`board_number`),
  KEY `FK_board_TO_favorite` (`board_number`),
  CONSTRAINT `FK_board_TO_favorite` FOREIGN KEY (`board_number`) REFERENCES `board` (`board_number`),
  CONSTRAINT `FK_user_TO_favorite` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='좋아요 테이블';

CREATE TABLE `image` (
  `board_number` int NOT NULL COMMENT '게시물 번호',
  `image` text NOT NULL COMMENT '게시물 이미지 URL',
  `sequence` int NOT NULL AUTO_INCREMENT COMMENT '이미지 번호',
  PRIMARY KEY (`sequence`),
  KEY `FK_board_TO_image` (`board_number`),
  CONSTRAINT `FK_board_TO_image` FOREIGN KEY (`board_number`) REFERENCES `board` (`board_number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='게시물 이미지 테이블';

CREATE TABLE `search_log` (
  `sequence` int NOT NULL AUTO_INCREMENT COMMENT '시퀀스',
  `search_word` text NOT NULL COMMENT '검색어',
  `relation_word` text COMMENT '관련 검색어',
  `relation` tinyint(1) NOT NULL COMMENT '관련 검색어 여부',
  PRIMARY KEY (`sequence`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='검색 기록 테이블';

/*!40101 SET character_set_client = @saved_cs_client */;

/*!50001 DROP VIEW IF EXISTS `board_list_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `board_list_view` AS select `b`.`board_number` AS `board_number`,`b`.`title` AS `title`,`b`.`content` AS `content`,`i`.`image` AS `title_image`,`b`.`view_count` AS `view_count`,`b`.`favorite_count` AS `favorite_count`,`b`.`comment_count` AS `comment_count`,`b`.`write_datetime` AS `write_datetime`,`u`.`email` AS `writer_email`,`u`.`nickname` AS `writer_nickname`,`u`.`profile_image` AS `writer_profile_image` from ((`board` `b` join `user` `u` on((`b`.`writer_email` = `u`.`email`))) left join (select `image`.`board_number` AS `board_number`,any_value(`image`.`image`) AS `image` from `image` group by `image`.`board_number`) `i` on((`b`.`board_number` = `i`.`board_number`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

/***********************************************************************************/


INSERT INTO `user` VALUES 
('email@email.com','P!ssw0rd','nickname','01012346789','서울특별시 강북구','롯데백화점',NULL,0),
('example@example.com','$2a$10$ikkkACp3m.D6qbw3WwTeXO2KjU2TdJyOC98XCvgJf2m39/jFMfDsW','user123','01056781234','123 Street, City','Apt 101',NULL,1),
('example@naver.com','$2a$10$y//FXM5gbG9EK49THC1TNOy2E24own6MWwxox1L6WHzw5keCMsfk.','potato','01012345678','any street','apt 101',NULL,1),
('user1@example.com','$2a$10$abc123xyzABC123xyzABC12OpQrsTUvWXyzABCD1234567890ab','sweet','01011112222','Seoul, Jongno-gu','Building 1, Room 302','https://example.com/profile1.jpg',1),
('test.user@gmail.com','$2a$10$qweRTYuiopQWERtyuiop12LMNoPQRstuVWXyzabcdEFGH567890','tester','01022223333','Busan, Haeundae-gu','Ocean View 1203',NULL,0),
('hello@kakao.com','$2a$10$zxcVBNasdfZXCvbNasdf12JKLmNOPqrsTUVwxyZABCD56789012','hello123','01033334444','Incheon, Nam-gu','Happy Town 502','https://example.com/profile2.png',1),
('sample@domain.com','$2a$10$mnOPQRstuvMNOpqrSTuv12ABCDefGHIjkLMnoPQRstu567890','sample','01044445555','Daejeon, Seo-gu','Sample Road 77, 2F',NULL,1),
('jane.doe@example.com','$2a$10$lkJHGFdsawLKjhgfDSAw12ZXCVbnmQWErtYUiopASDF567890','Jane','01055556666','Daegu, Suseong-gu','Green Ville 801','https://example.com/profile3.jpg',0),
('john.smith@naver.com','$2a$10$poiUYTrEwqPOiuYTRewQ12MNBVcxzLKJhgFDsaPOIU567890','John Smith','01066667777','Gwangju, Buk-gu','Blue Garden 301',NULL,1),
('catlover@pets.com','$2a$10$asdFGHjkLqWErtyUIopA12ZXCVbnmLKJHgFDSaQWER567890','NyangDuck','01077778888','Ulsan, Jung-gu','Pet Street 15, 3F','https://example.com/catlover.jpg',1),
('codeguy@example.com','$2a$10$rfVBNmklopRFvbnMKLoP12QWERTyuiOPasDFGhJKL567890','codeGuy','01088889999','Any City, Any-gu','No Address Detail',NULL,0);

INSERT INTO `board` VALUES 
(2,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,1,'email@email.com'),
(3,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,2,'email@email.com'),
(4,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,2,'email@email.com'),
(5,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,0,'email@email.com'),
(6,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,2,'email@email.com'),
(7,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,0,'email@email.com'),
(8,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,0,'email@email.com'),
(9,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,0,'email@email.com'),
(10,'제목입니다.','내용입니다.','2023-08-20 20:54:00',1,3,27,'email@email.com'),
(11,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,0,'email@email.com'),
(12,'제목입니다.','내용입니다.','2023-08-20 20:54:00',0,0,0,'email@email.com'),
(16,'asdf','asdf','2024-06-25 17:50:09',0,0,5,'example@example.com');

INSERT INTO `comment` VALUES 
(3,'감사합니다.','2024-07-03 17:16:58','example@example.com',10),
(4,'두 번째 댓글입니다.','2024-09-03 19:06:45','example@example.com',10),
(5,'3번째 입니다.','2024-09-03 19:08:13','example@example.com',10);

INSERT INTO `favorite` VALUES ('example@example.com',10);
