/*
SQLyog Community v13.2.0 (64 bit)
MySQL - 10.4.22-MariaDB : Database - gcoffee_pos
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`gcoffee_pos` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `gcoffee_pos`;

/*Table structure for table `activity_logs` */

DROP TABLE IF EXISTS `activity_logs`;

CREATE TABLE `activity_logs` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `activity_logs` */

insert  into `activity_logs`(`id`,`user_id`,`action`,`note`,`created_at`) values 
('0060effd-3f77-48c8-96ca-e575688a5fb1','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479139936','2026-03-03 02:18:59'),
('010d7ba3-7028-4b1a-8425-0659c2a3fc3d','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 23:59:40'),
('01734b45-0168-43ef-a4fa-67b0deb983ba','e06b6521-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out. Duration: 1 mins, Earned: Rp 150.','2026-03-03 23:59:35'),
('03141605-2c43-44bf-b5dc-3f127e773b31','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479813572','2026-03-03 02:30:13'),
('06876411-195d-4a0a-a86d-f38d3646e006','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479109048','2026-03-03 02:18:29'),
('069f6fcb-3891-4e55-83d4-514894fb9d13','e78057ba-0bdd-11f1-8cab-08979871e6ef','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 20:49:27'),
('0751178e-047e-4b9f-a302-647b59e5c878','e78057ba-0bdd-11f1-8cab-08979871e6ef','LOGOUT','User clocked out.','2026-03-03 11:25:30'),
('07b4b617-37a8-42e0-a352-059ae9331200','e06b62e5-05f6-11f1-9a18-507b9db621bd','LOGIN','User Andi logged in.','2026-03-03 03:24:51'),
('0e4a9518-a250-4144-adb4-afb97c5f6813','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PENDING sale: INV-1772512537182','2026-03-03 11:35:37'),
('13e3b5f3-eaf5-407b-a68b-7df7dac31ac5','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479220237','2026-03-03 02:20:20'),
('16912909-0840-44d3-94bc-753edaf9cb23','e06b6521-05f6-11f1-9a18-507b9db621bd','LOGIN_OFF_SCHEDULE','Staff Tamy logged in without schedule (Permission Granted).','2026-03-04 00:33:49'),
('1823957e-8698-430a-a92e-d8a04436f784','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PENDING sale: INV-1772553048410','2026-03-03 22:50:48'),
('199187ce-5a12-4286-93fa-426316fe354e','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out.','2026-03-03 00:27:53'),
('1e410131-9f40-44d1-bcb9-1ba7acf7dfa0','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 00:54:39'),
('2471180e-c9fc-4972-8e10-46e8ee900321','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772478818440','2026-03-03 02:13:38'),
('29908f8d-3800-4117-989d-624e8c2751ef','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: EXC-1772518883968','2026-03-03 13:21:23'),
('2be5f615-d45d-4e9e-953c-badfc94bf619','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: EXC-1772552838066','2026-03-03 22:47:18'),
('2d4e836a-1e91-4304-bd81-8fb5d256a4a2','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','Owner/Admin Atjas logged in.','2026-03-04 00:25:12'),
('2e59a34e-9849-482c-afb6-5295213a82f8','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772478791637','2026-03-03 02:13:11'),
('2f9a1a8f-61f6-4784-a11a-2d90cff82557','e06b6490-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 23:12:07'),
('36ac779e-dc38-4b55-919b-5b9a7dce514d','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479158756','2026-03-03 02:19:18'),
('374ca9b3-4095-4071-8123-60ac715fac9a','e06b62e5-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 250/min','2026-03-03 13:47:10'),
('438d3cd3-0b8e-4245-af2d-fd860095be90','e06b6521-05f6-11f1-9a18-507b9db621bd','LOGIN','User Tamy logged in.','2026-03-03 23:58:45'),
('460f678b-b2c0-47c4-a4c8-d1f3f0715e01','e06b6490-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 125/min','2026-03-03 14:03:10'),
('46c1071e-6232-482f-8a0c-6f618527ea7e',NULL,'REPRINT_SALE','Reprinted receipt for INV-1772512537182','2026-03-03 11:36:06'),
('4c9fd80a-d514-43ba-9e51-6da2caab9991','e06b62e5-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 250/min','2026-03-03 13:50:18'),
('4ca79f34-2620-4037-b2ca-990dd7215b1e','e06b6490-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 23:11:46'),
('4d92150b-bd69-4a7c-87de-f4f175514b87','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 03:25:18'),
('4f56fd3a-6a3d-4ce8-b5a7-0d370325859c','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: EXC-1772518846562','2026-03-03 13:20:46'),
('537a1334-d40e-4d49-8b4e-479b855931cd','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 22:50:15'),
('55682d87-cdd1-4386-a430-e1a1c6e0fb06','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479688393','2026-03-03 02:28:08'),
('55877351-5cf9-4cd0-8a63-607febe1eae3','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','Owner/Admin Atjas logged in.','2026-03-04 00:10:12'),
('584e9806-2907-456b-b650-f527d529994b','e06b6521-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 20:52:41'),
('659bc544-f525-4c12-9ff6-bfedd1b8dfef','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772473302582','2026-03-03 00:41:42'),
('693419a4-bd2f-4c51-83b4-ecc46fac99d0','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 00:27:40'),
('6a274d67-caeb-4aae-8eec-024c300bd2cf','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479118902','2026-03-03 02:18:38'),
('6b0bf2e3-1edb-491c-9cb7-e2e50430d9a5','e06b6521-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out. Duration: 1 mins, Earned: Rp 150.','2026-03-04 00:34:17'),
('6eb11b2c-b0e3-42eb-9355-659f6f6c6b14','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PENDING sale: INV-1772473313323','2026-03-03 00:41:53'),
('6f058992-7efd-462c-b17e-46058f4a35b8',NULL,'COMPLETE_SALE','Completed payment for sale: a0406d10-52e1-4f8c-bd01-2ce04d13e12a with CASH','2026-03-03 13:21:06'),
('7561a2a6-178c-4287-ac81-156e97d215d1','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','Owner/Admin Atjas logged in.','2026-03-04 00:21:14'),
('75654db6-434b-4640-947a-7bf8b9fb71fc','e06b6490-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 23:11:28'),
('75ba491e-ea72-4e94-98d3-cf89802f1489','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479338122','2026-03-03 02:22:18'),
('7633b6f6-4140-4469-9a35-7a0660c2b2fc','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772478843952','2026-03-03 02:14:03'),
('7aa46684-858b-4373-aeab-a5087a436f6b','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out. Duration: 8 mins, Earned: Rp 2000.','2026-03-04 00:19:39'),
('7c7c299a-8657-4503-a508-8e82fe52daf8','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','Owner/Admin Atjas logged in.','2026-03-04 00:24:58'),
('7cd77441-c5a9-454f-9a60-10d33b4ddea4','e06b63f6-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 20:51:21'),
('852a4467-3227-4b52-b4cf-3a931050cd47','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 00:28:39'),
('870bd6e9-17b9-4a19-ad25-daeb49415a88','e06b62e5-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out.','2026-03-03 03:25:12'),
('901e3560-cdde-4808-af00-7d5ab6b9501d','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479034660','2026-03-03 02:17:14'),
('93cdb6d3-9450-48d0-96f3-ec83ea0fb230','e06b62e5-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out. Duration: 1 mins, Earned: Rp 250.','2026-03-03 22:50:06'),
('99ad13ec-eaee-4e9a-9cd1-d9f875908980','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479605553','2026-03-03 02:26:45'),
('9cdc9f26-9e20-4afb-bb7c-ddda1958a37f','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: EXC-1772518746174','2026-03-03 13:19:06'),
('9d4b86fa-6e1c-4965-9c8b-29e1f09ed744','e06b6490-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 14:04:50'),
('9d9a85b1-849d-4d92-811b-8309fcc7edbe','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772518780830','2026-03-03 13:19:40'),
('a7692321-5c93-43ca-bdaa-5f25fdfcee46','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479277981','2026-03-03 02:21:17'),
('a9753676-ba0c-4b24-b840-269c967d9b9f','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','Owner/Admin Atjas logged in.','2026-03-04 00:36:15'),
('adfed621-ffdb-43f1-81da-868ac3be8fb0','e06b63f6-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out. Duration: 1 mins, Earned: Rp 150.','2026-03-04 00:21:06'),
('b024bd30-a275-4680-b34a-b5d8319c80d5','e06b6521-05f6-11f1-9a18-507b9db621bd','LOGIN_OFF_SCHEDULE','Staff Tamy logged in off-schedule (Browsing only).','2026-03-04 00:38:40'),
('b9f1c788-4d32-4382-8868-183ef6b081fa','e06b6521-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 125/min','2026-03-03 20:52:30'),
('c10fc04e-ee0b-42a5-90e0-30c5a67312ed','e06b6490-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 250/min','2026-03-03 13:47:30'),
('c276eedf-245d-44ac-9725-37cb49f6df30','e06b542b-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 250/min','2026-03-03 13:50:24'),
('d00b0734-876e-4659-9c5c-8d273488f0ba','e06b62e5-05f6-11f1-9a18-507b9db621bd','LOGIN','User Andi logged in.','2026-03-03 00:28:06'),
('d48f5cae-4640-4359-a8e0-fef919b052d2','e06b63f6-05f6-11f1-9a18-507b9db621bd','LOGIN_OFF_SCHEDULE','Staff Cipa logged in without schedule (Permission Granted).','2026-03-04 00:20:46'),
('d62224f4-c4ce-476d-a738-d1535d58d26b','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','Owner/Admin Atjas logged in.','2026-03-04 00:19:58'),
('d75d7af6-36e0-4036-9aec-0d0aad5604cf','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','Owner/Admin Atjas logged in.','2026-03-04 00:12:02'),
('d92636be-dd83-4310-b471-94116ed38a3a','e06b62e5-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out.','2026-03-03 00:28:36'),
('da6ce14a-8a6a-4343-8196-aee56bdb2a48','e06b63f6-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 23:42:32'),
('dc07107f-1b1e-4d7a-845a-1651415f3e1f','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 21:14:49'),
('dfe69f6a-9729-460e-85de-c3e549254a20','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479046047','2026-03-03 02:17:26'),
('e070cc12-6ac6-4886-8c78-e333a1a3c69c','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 11:25:36'),
('ecea779c-14e2-4318-beb5-a92a02080a86','e06b6521-05f6-11f1-9a18-507b9db621bd','UPDATE_RATE','Salary rate updated to Rp 150/min','2026-03-03 22:03:50'),
('efe7aec8-a87c-44f0-9569-5730a36f276e','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out.','2026-03-03 03:24:41'),
('f11cda21-ada2-48cd-bcd1-6a03e1d2069a','e06b62e5-05f6-11f1-9a18-507b9db621bd','LOGIN','User Andi logged in.','2026-03-03 22:49:50'),
('f57a5ef2-d77e-4333-a67d-28ad1d4808e6','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: INV-1772479482343','2026-03-03 02:24:42'),
('f5bff414-0dc3-4fe4-930a-94667528c553','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGIN','User Atjas logged in.','2026-03-03 03:04:48'),
('f7d8808c-791d-4787-bdde-3e64d7d6db6c','e06b542b-05f6-11f1-9a18-507b9db621bd','LOGOUT','User clocked out. Duration: 1 mins, Earned: Rp 250.','2026-03-04 00:11:00'),
('fcf1b2c2-7aaf-42a3-9034-ce3a522d530b','e06b542b-05f6-11f1-9a18-507b9db621bd','CREATE_SALE','Created PAID sale: EXC-1772552809516','2026-03-03 22:46:49');

/*Table structure for table `attendance` */

DROP TABLE IF EXISTS `attendance`;

CREATE TABLE `attendance` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `clock_in` timestamp NOT NULL DEFAULT current_timestamp(),
  `clock_out` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `salary_earned` decimal(10,2) DEFAULT 0.00,
  `duration_minutes` int(11) DEFAULT 0,
  `overtime_reward` decimal(10,2) DEFAULT 0.00,
  `late_penalty` decimal(10,2) DEFAULT 0.00,
  `is_paid` tinyint(1) DEFAULT 0,
  `status` varchar(20) DEFAULT 'DONE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `attendance` */

insert  into `attendance`(`id`,`user_id`,`clock_in`,`clock_out`,`created_at`,`salary_earned`,`duration_minutes`,`overtime_reward`,`late_penalty`,`is_paid`,`status`) values 
('09fd9546-21d4-491f-b10b-8c7efedaf76f','e06b6490-05f6-11f1-9a18-507b9db621bd','2026-03-05 16:30:00','2026-03-05 23:59:00','2026-03-03 21:09:05',67350.00,449,0.00,0.00,0,'PLANNED'),
('0d989ee1-a82d-4df4-9e36-3da5981c31ef','e78057ba-0bdd-11f1-8cab-08979871e6ef','2026-03-03 16:30:00','2026-03-04 00:39:00','2026-03-03 20:47:37',73350.00,489,0.00,0.00,0,'DONE'),
('14d2de0f-4583-4da6-ac77-b407c73a1e10','e78057ba-0bdd-11f1-8cab-08979871e6ef','2026-02-20 21:20:47','2026-03-03 11:25:30','2026-02-20 21:20:47',0.00,0,0.00,0.00,0,'DONE'),
('41901fe2-c389-4286-aab1-2a2863bcf07f','e06b63f6-05f6-11f1-9a18-507b9db621bd','2026-03-06 16:30:00','2026-03-06 23:59:00','2026-03-03 20:51:01',67350.00,449,0.00,0.00,0,'PLANNED'),
('737d8c31-7bba-40a9-b851-00f75ec7d35a','e78057ba-0bdd-11f1-8cab-08979871e6ef','2026-03-07 16:30:00','2026-03-08 02:00:00','2026-03-03 21:09:59',85500.00,570,0.00,0.00,0,'PLANNED'),
('7f4e9739-64c0-4dec-893e-d4c9e5c0c8ac','e06b542b-05f6-11f1-9a18-507b9db621bd','2026-02-18 02:46:19','2026-02-18 02:47:07','2026-02-18 02:46:19',0.00,0,0.00,0.00,0,'DONE'),
('b27fd4a7-808e-44fe-a28f-b9b91e9c4185','e06b6521-05f6-11f1-9a18-507b9db621bd','2026-03-04 16:30:00','2026-03-04 23:59:00','2026-03-03 21:04:29',67350.00,449,NULL,0.00,0,'PLANNED'),
('c34b0eb7-7f4e-4be1-b54a-a67bcaf77b35','e78057ba-0bdd-11f1-8cab-08979871e6ef','2026-02-18 02:47:28','2026-02-20 21:20:33','2026-02-18 02:47:28',0.00,0,0.00,0.00,0,'DONE'),
('c423f134-e318-4cb3-a796-429b3dfbeaa2','e06b6490-05f6-11f1-9a18-507b9db621bd','2026-03-02 16:30:00','2026-03-02 23:59:00','2026-03-03 14:01:20',67350.00,449,0.00,0.00,0,'DONE'),
('e507ac4b-bcc3-47c3-b87a-92ff05f79477','e06b63f6-05f6-11f1-9a18-507b9db621bd','2026-03-08 16:30:00','2026-03-08 23:59:00','2026-03-03 21:22:38',67350.00,449,0.00,0.00,0,'PLANNED');

/*Table structure for table `bms_devices` */

DROP TABLE IF EXISTS `bms_devices`;

CREATE TABLE `bms_devices` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `current_value` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `bms_devices` */

insert  into `bms_devices`(`id`,`name`,`type`,`category`,`unit`,`current_value`,`is_active`,`created_at`,`last_update`) values 
('b51edf9f-0367-11f1-94d2-507b9db621bd','KWH Meter Utama','SENSOR','ELECTRIC','Watts','1117',0,'2026-02-06 21:25:38','2026-02-10 04:30:15'),
('b51f0d2c-0367-11f1-94d2-507b9db621bd','Suhu Area Bar','SENSOR','HVAC','Celsius','28.2',1,'2026-02-06 21:25:38','2026-02-10 04:30:15'),
('b51f0ea4-0367-11f1-94d2-507b9db621bd','Level Toren Air','SENSOR','WATER','%','74',0,'2026-02-06 21:25:38','2026-02-10 04:30:15'),
('b51f0f21-0367-11f1-94d2-507b9db621bd','Lampu Area Indoor','ACTUATOR','LIGHTING','ON/OFF','OFF',1,'2026-02-06 21:25:38','2026-02-10 15:46:20'),
('b51f0f8c-0367-11f1-94d2-507b9db621bd','Lampu Area Outdoor','ACTUATOR','LIGHTING','ON/OFF','OFF',1,'2026-02-06 21:25:38','2026-02-09 22:22:08');

/*Table structure for table `bms_logs` */

DROP TABLE IF EXISTS `bms_logs`;

CREATE TABLE `bms_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(36) DEFAULT NULL,
  `value` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `bms_logs_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `bms_devices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8200 DEFAULT CHARSET=utf8mb4;

/*Data for the table `bms_logs` */

/*Table structure for table `expenses` */

DROP TABLE IF EXISTS `expenses`;

CREATE TABLE `expenses` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `type` enum('BAHAN_BAKU','LAINNYA','GAJI') NOT NULL,
  `item_id` varchar(36) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `qty` decimal(10,2) DEFAULT 0.00,
  `amount` decimal(10,2) DEFAULT 0.00,
  `note` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `is_edited` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `expenses` */

/*Table structure for table `product_recipes` */

DROP TABLE IF EXISTS `product_recipes`;

CREATE TABLE `product_recipes` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `material_id` varchar(36) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `product_recipes` */

insert  into `product_recipes`(`id`,`product_id`,`material_id`,`quantity`,`created_at`) values 
('0074aa84-c6f4-4d0c-93e5-c161a7ff3dbf','c3c607c0-c180-40cd-8cdd-6e29d93dab32','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('00bf6ca0-e45b-41dd-acc9-999060115914','c59a3a1d-1496-4b19-9502-4b0ec7847468','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('0160caf4-e30c-4ac7-bc8c-fc103417d341','7157f68f-7eef-4fe7-95f3-0dcf9865a25a','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('03cff441-5b8c-4c40-8719-61404d162bda','b8d5e7c9-15b0-4753-886d-308719ecf758','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('04268468-9525-44c9-9f75-6fa9bb9b9a75','18db6fe8-b5f3-48d9-afe4-c8063748cb22','ff0262ad-7c92-42e2-8f75-5df94ba13320',23.00,'2026-02-18 01:41:01'),
('08d1629d-eede-4c77-bfc3-7e2a864992d4','b431300d-1fdf-4603-bd2e-6f2729f27d09','d52b4710-be7e-4b48-bdd0-7a69c9c02c42',25.00,'2026-02-18 01:41:01'),
('0a6d9045-dd2e-4b06-9986-0bba8e6fa914','0d2c947d-aa24-4963-8936-12857b302ac8','d52b4710-be7e-4b48-bdd0-7a69c9c02c42',25.00,'2026-02-18 01:41:01'),
('0a9c58c1-6b0d-41ec-aaba-d012c92f47ca','1b4956c6-a387-49e0-9848-2776637e7798','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('0cfda030-abb2-41d8-8ca3-048e6c118fe6','371edcce-3288-48d0-9d4a-7b5a2d2d505c','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('0e55582c-47fc-447a-a6d5-08e51dacc667','fdfaea5f-db57-4cee-a23b-9af7e288c9ab','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('0ed7dc78-d5fa-4bc3-89a1-4664dcbf3ad4','e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('0f0d12a2-81b1-4337-9745-918aa84f2f0b','e7884f47-8610-4230-9236-e9f92117654e','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('13683b7d-e3a9-4cf9-aae1-0c8ea6645e23','539f1d58-8fa9-4c6e-8981-b14726dc4c8e','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('13cedf3b-42fa-4d3f-b4e1-96b2c388b540','b716e3c0-3f42-4362-b850-4e0dd50ac621','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('14751d69-03ec-4679-bdfd-b891f6d08ad9','af01ff02-e3fa-4cfe-8d74-dd0825154689','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('14ac1487-21df-4beb-9977-bb3cead4d764','49658ab1-cb59-4ba4-befc-5ede5df581a6','7306a061-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('165526d8-a371-4672-9be1-6ca928f98f70','b431300d-1fdf-4603-bd2e-6f2729f27d09','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('16bd02e5-31b6-4416-895d-5304212b9f08','e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('1711762e-163f-4040-88e1-a0b1c327db72','0d2c947d-aa24-4963-8936-12857b302ac8','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('17cdff4e-9869-4335-b201-bee659bb32d4','66790402-d047-462c-be40-e3ebd3fe8663','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('18192f82-c81f-45dd-8aef-686f78004750','eda015a0-7989-4373-8269-0ec907d93de2','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('186ea0ee-0a1d-4bea-ae94-89e53b182ce2','aeb8ad2b-5f19-401e-9f4f-15c7f84f9896','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('1ac56a4d-010f-4ad2-be5a-f71fee864d79','7544398d-4389-4349-8fa4-78733df4507e','7306e13b-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('1b90dbc0-5451-4a5d-b049-5fe51ef16a72','701940af-137d-40b5-aeb4-7579c0b4ec87','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('1ba208de-1ae5-4a82-81a7-e2f925bd9b30','dafb7951-d6c5-44bd-8e9f-b74aecf49c85','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('1d5b73f9-c083-4728-ac53-84a106f708f2','86b55866-5335-48e5-b416-a83dce5e8dff','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('1e12130a-5d25-4a28-a4bc-6058259fae2c','af8a8ef7-ca26-405e-a817-4253e601a308','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('1f0097bc-9cad-46fd-b7aa-1352633367ac','b716e3c0-3f42-4362-b850-4e0dd50ac621','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('20f58880-ca2c-4951-a8cf-7b78c2a61ec3','66790402-d047-462c-be40-e3ebd3fe8663','7306a061-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('220be08f-1a3a-4d4a-9dea-ce6e99194b91','c3c607c0-c180-40cd-8cdd-6e29d93dab32','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('228dd7e9-7249-4cc9-a1d1-dac01b6a5f22','f41c7c02-8151-4728-a436-d84a83bf8d8c','ff0262ad-7c92-42e2-8f75-5df94ba13320',23.00,'2026-02-18 01:41:01'),
('22fd7f21-6150-4789-ba44-6b97f1439b98','299c0233-89bb-4cb1-a74a-9e158615caf2','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00,'2026-02-18 01:41:01'),
('231ebdfd-15e1-4bab-8f00-561114fe7fcd','8dd052cd-4ee4-4577-a6b5-7f0b6e604714','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('236c84a8-05ec-4007-b1c5-3711db22e02b','980e0a85-9ac7-4ddf-9c32-790329fdc557','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('261f1c07-ce84-4095-81dd-d195f96bd5f3','b716e3c0-3f42-4362-b850-4e0dd50ac621','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('2b2a089e-f87b-4046-a9f0-856fdd3e2692','51b7bd4b-cbe5-4699-989e-826e5096c8fc','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('2c4e830a-f62e-47e9-a867-f8f153129d9d','7544398d-4389-4349-8fa4-78733df4507e','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('2e83a9df-5f7a-4721-8459-7700d94f2884','eefb20cf-2b98-4437-85e5-1d0d8810824b','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('2fd17848-c75d-48a2-9e97-dfa1e5a7ba03','ee01eb78-ecf0-4cf8-9959-7dbf6f4cbd81','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('307c64d9-64b8-41c6-83bd-65cd318f2a51','0f1e3a5b-ff17-49f9-997e-4dfa032c3bba','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('332163cf-56da-4764-aee8-b82bf78f2339','980e0a85-9ac7-4ddf-9c32-790329fdc557','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('34d163f4-dd18-41aa-b99e-ab1b424011c2','7031bb99-ef17-4bf2-b9a7-aac07572c398','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00,'2026-02-18 01:41:01'),
('38c96731-4711-431d-b1c6-ffe83e7e7e71','fdfaea5f-db57-4cee-a23b-9af7e288c9ab','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('3b536188-e854-4d71-a6fc-9d5699418416','7544398d-4389-4349-8fa4-78733df4507e','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('3e3c4ee9-5e01-47c9-934b-f064ce6a133e','c3c607c0-c180-40cd-8cdd-6e29d93dab32','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('3f5303a5-8b56-4ba3-808f-a84e05475803','701940af-137d-40b5-aeb4-7579c0b4ec87','7306e09a-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('44e785e7-9dde-4940-83d4-24205ea2e667','7031bb99-ef17-4bf2-b9a7-aac07572c398','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',18.00,'2026-02-18 01:41:01'),
('4670adc9-5660-447a-896d-1d7465562753','4e9a77bc-f41d-4896-9686-afe0a037bdb0','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('49b08be7-54a0-4e08-9a2b-659bb240b7f8','aeb8ad2b-5f19-401e-9f4f-15c7f84f9896','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('4c0252ef-63d9-45d9-81f2-4eb1b373984a','c59a3a1d-1496-4b19-9502-4b0ec7847468','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('4e2831cd-b071-43b9-8411-fad8906a4d1b','51b7bd4b-cbe5-4699-989e-826e5096c8fc','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('4e792d8b-dea1-44b3-846a-22ff29c7bd84','49658ab1-cb59-4ba4-befc-5ede5df581a6','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('4f313dd8-fd95-447f-b875-e0f8ef9537df','ce288881-4422-4332-ac36-21c288f201e9','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('50178360-014c-4653-b71a-a1e9b6051375','e7884f47-8610-4230-9236-e9f92117654e','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('526bfdd6-c144-42d1-9cc2-9c550fcd8b3e','e6cf5716-d64f-497c-b7a6-950cd346678f','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('52c0b875-4f76-44d4-bab3-8a893e9f0104','4bf82d21-cb0f-436a-9d5b-13065bd0af42','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('53452607-7a55-480a-9f25-1adb9b666eea','c59a3a1d-1496-4b19-9502-4b0ec7847468','7306e245-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('546cd601-642f-4b1c-9144-ecb2b7fb8338','49658ab1-cb59-4ba4-befc-5ede5df581a6','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('56563f95-b8f8-4589-9704-c229665e2053','fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','ee2b930f-de5f-4bb2-af86-45c7d3e39ba4',20.00,'2026-02-18 01:41:01'),
('56eea648-75ad-4184-8267-0e907d4ab7b0','7157f68f-7eef-4fe7-95f3-0dcf9865a25a','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('573c3716-a0d3-48d8-88c9-cd93da741974','701940af-137d-40b5-aeb4-7579c0b4ec87','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('57dfef3a-78c9-4157-8110-11b89117a695','539f1d58-8fa9-4c6e-8981-b14726dc4c8e','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00,'2026-02-18 01:41:01'),
('5bbabad1-32f7-4634-b955-8dd18d6bda63','fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('5c360c73-06f8-4796-b9d7-ac80fcdaf773','69495623-4a4b-486e-ba3f-726b8a6c0a62','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('5ee629de-6a55-49be-a027-f6bbb69b0ac1','af8a8ef7-ca26-405e-a817-4253e601a308','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('5f7eb1d9-45aa-45d1-8b29-ed3c183ba7d6','f51c2588-7a47-4209-a196-14957452e165','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('60ef4874-f22e-4547-88b2-3faa9b0e0361','fc594ec5-07e6-45d1-b642-114ab175379e','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('61b5b0fe-a685-4dfc-89b1-ab9a081b0b5d','536fd762-9e30-458d-b231-7a3eb41c3120','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('63d77d44-d3ec-488c-8c0d-43cbb9883f9d','24d7a3c6-b650-423c-aed2-bc626d2379d3','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('63e2ac56-ae21-44bc-b701-9c7d892d0817','536fd762-9e30-458d-b231-7a3eb41c3120','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('63e9c433-05de-473e-ac21-ec61015c75d8','e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('640e120f-3f59-4c3b-9d99-2ffc1c07a3fe','fdfaea5f-db57-4cee-a23b-9af7e288c9ab','fd183f89-035e-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('68127065-afe4-4c7c-8fc0-f8c062f3ea1d','9ea47c76-6bf2-43ce-9ca8-2a6a5a101f03','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('68f4cbe1-659f-4a80-9bfe-c775258e3970','980e0a85-9ac7-4ddf-9c32-790329fdc557','a5724b15-1ae9-4837-b76f-e625c211a96f',25.00,'2026-02-18 01:41:01'),
('6abe0c2b-8cab-4911-a782-a83d45c22db6','0f1e3a5b-ff17-49f9-997e-4dfa032c3bba','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('6c39abc0-4f4e-45c3-85d1-bc274adc8be8','66790402-d047-462c-be40-e3ebd3fe8663','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('6cb6da2d-2a37-4029-ae50-3c1dc9783dcf','c343acf5-231f-406d-8611-d5e5b8fee4ac','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('6d100acd-9765-452f-a36f-4328550809f4','9ea47c76-6bf2-43ce-9ca8-2a6a5a101f03','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('6ec3845a-c640-41f4-9636-669445b4af35','dafb7951-d6c5-44bd-8e9f-b74aecf49c85','7306e09a-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('704866d1-b016-4299-bd1d-07849a692542','e6cf5716-d64f-497c-b7a6-950cd346678f','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('718b7d3e-278f-44c0-b0a9-5e2146e100d7','eda015a0-7989-4373-8269-0ec907d93de2','7306e1ce-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('71aae231-5ee4-4d64-9053-aacee6a439fa','8dd052cd-4ee4-4577-a6b5-7f0b6e604714','fd183f89-035e-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('728d7020-685f-4f8d-b98e-787ae03ceb94','eefb20cf-2b98-4437-85e5-1d0d8810824b','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('73ff5f11-cdec-4902-8c5f-6c41a2a3fafa','b8d5e7c9-15b0-4753-886d-308719ecf758','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('7448c9e2-3d29-4ba4-a964-4fcd87a649fc','86b55866-5335-48e5-b416-a83dce5e8dff','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('748ea319-421b-40c4-a683-2366ab43b457','af01ff02-e3fa-4cfe-8d74-dd0825154689','7306a061-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('75144c6b-db25-4696-81c2-a0f234617843','7157f68f-7eef-4fe7-95f3-0dcf9865a25a','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('76535161-5660-449c-8d0d-9743f388e149','eda015a0-7989-4373-8269-0ec907d93de2','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('7661ea91-c6ef-4b3d-9e8c-70fd7e06ef12','9ea47c76-6bf2-43ce-9ca8-2a6a5a101f03','7306e245-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('76f98230-6daa-4d17-b9bd-5ce38fe14018','8dd052cd-4ee4-4577-a6b5-7f0b6e604714','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('77d5b7f3-83da-46b3-87c0-185e17b4b73f','ee01eb78-ecf0-4cf8-9959-7dbf6f4cbd81','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('78317f60-f404-4529-a476-1d52d7bbd890','7544398d-4389-4349-8fa4-78733df4507e','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('79a691c7-d3cc-4b82-b6ee-06fa925fbfde','4e9a77bc-f41d-4896-9686-afe0a037bdb0','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('7a7f8ce8-aa06-4adf-b203-c587d484a4f0','69495623-4a4b-486e-ba3f-726b8a6c0a62','d52b4710-be7e-4b48-bdd0-7a69c9c02c42',25.00,'2026-02-18 01:41:01'),
('7a9f7300-a713-4eaf-99dc-dc3c9a605db4','51b7bd4b-cbe5-4699-989e-826e5096c8fc','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('7b78e5ef-57ed-4d4b-94c4-953b7eb2ca02','4bf82d21-cb0f-436a-9d5b-13065bd0af42','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('7e2f8b51-1710-49ba-b22c-2285580a27bc','c3c607c0-c180-40cd-8cdd-6e29d93dab32','7306e13b-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('7f90e342-edc8-4c11-8cbb-7884228436ac','dafb7951-d6c5-44bd-8e9f-b74aecf49c85','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('80b4541d-73cc-4560-bdc0-f0d491e02e34','4bf82d21-cb0f-436a-9d5b-13065bd0af42','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('813d00cc-3a3f-4ea5-96ca-e17d066b80d6','9ea47c76-6bf2-43ce-9ca8-2a6a5a101f03','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('81689570-2472-4b84-ae6a-2413301fca5c','ce288881-4422-4332-ac36-21c288f201e9','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',18.00,'2026-02-18 01:41:01'),
('8173a63a-fbf0-4f8b-8c3f-b24a83c5f22a','7031bb99-ef17-4bf2-b9a7-aac07572c398','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('82452481-9a42-4437-8787-ec108884e777','299c0233-89bb-4cb1-a74a-9e158615caf2','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('862ce93e-4628-49cb-8a74-2b157b6e8ac3','af01ff02-e3fa-4cfe-8d74-dd0825154689','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('877348a5-211c-4110-af32-1495b3ce0dff','fdfaea5f-db57-4cee-a23b-9af7e288c9ab','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('87fbcfd2-9b49-4eeb-9a35-38fc310d1b99','ee01eb78-ecf0-4cf8-9959-7dbf6f4cbd81','0c139446-dae8-4173-b865-68f0254e22f6',10.00,'2026-02-18 01:41:01'),
('897424ef-5fd8-4c13-b4c5-d161b285621f','60a1c563-5d02-4ab0-aad7-caf09de3a783','7306e245-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('89aa4a3c-7727-4182-aa54-59dd56dfbba0','ee01eb78-ecf0-4cf8-9959-7dbf6f4cbd81','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00,'2026-02-18 01:41:01'),
('8a00f589-ed27-4a5d-8a90-97c8aa82644a','eda015a0-7989-4373-8269-0ec907d93de2','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('8a91d9ac-5065-4dc7-ac15-bd5080535a29','b8d5e7c9-15b0-4753-886d-308719ecf758','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('8a9e5af0-763a-4652-a281-658ad19a1d32','371edcce-3288-48d0-9d4a-7b5a2d2d505c','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('8bca1a9d-dcb5-426c-af29-d6549c43c347','47952bf9-0842-4f60-8fbc-ace32caec81e','7306e09a-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('8ce00997-ec2c-472c-83d7-df77bbfe863e','fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('8cf02554-45fd-4830-a90e-1678a6092c45','536fd762-9e30-458d-b231-7a3eb41c3120','7306e1ce-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('8ec6859d-430b-4511-99f1-6d636badc66d','c343acf5-231f-406d-8611-d5e5b8fee4ac','ff0262ad-7c92-42e2-8f75-5df94ba13320',23.00,'2026-02-18 01:41:01'),
('8ff333d8-9297-4461-a4c0-b876e1d32a59','1b4956c6-a387-49e0-9848-2776637e7798','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('90bfae14-e162-45a7-bbdf-08a602681881','66790402-d047-462c-be40-e3ebd3fe8663','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('955988d2-e325-4880-89dd-58a30517d522','e6cf5716-d64f-497c-b7a6-950cd346678f','ee2b930f-de5f-4bb2-af86-45c7d3e39ba4',20.00,'2026-02-18 01:41:01'),
('98348a33-3fad-423e-a08d-af4fd05e227c','e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3','7306e1ce-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('9db7ccd6-b352-403d-999b-7925428e12f2','f41c7c02-8151-4728-a436-d84a83bf8d8c','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('9eeb1e33-a3c3-4c45-8ccf-9de692062c37','ce288881-4422-4332-ac36-21c288f201e9','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('9f6888f4-a86a-44dc-9c49-711526325429','7544398d-4389-4349-8fa4-78733df4507e','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('a0b319e2-f9e0-4e9e-8db3-fbe198295019','af8a8ef7-ca26-405e-a817-4253e601a308','fd183f89-035e-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('a0e7b696-5154-413e-a5db-ee5ceccf4f84','eda015a0-7989-4373-8269-0ec907d93de2','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('a0edd80a-cf8b-409f-9ec0-fcf50e7c099d','24d7a3c6-b650-423c-aed2-bc626d2379d3','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00,'2026-02-18 01:41:01'),
('a102083d-6e4d-437e-87b4-a4744a58dd86','18db6fe8-b5f3-48d9-afe4-c8063748cb22','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('a1c74e35-f5bb-4f68-94ab-fd02997500d6','1b4956c6-a387-49e0-9848-2776637e7798','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('a1d809f2-4577-4ae8-9ad4-c4060e1aa139','af8a8ef7-ca26-405e-a817-4253e601a308','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('a3224956-312e-45c1-b5a2-ebe42c522cd6','9d260e69-a41b-45cd-bde3-e549ff7309a0','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('a3931d87-553b-45c3-a0bd-944435764629','69495623-4a4b-486e-ba3f-726b8a6c0a62','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('a3d355ab-13aa-46c2-b560-5d38e17501c9','86b55866-5335-48e5-b416-a83dce5e8dff','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('a8a1995c-6925-4cc5-9e3e-0e92a0741104','d838e456-a305-457d-b950-9e376586cb52','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('a97fa636-6e15-435c-b10c-b48b96a8a0d0','47952bf9-0842-4f60-8fbc-ace32caec81e','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('aa2ea4cf-1428-416e-9e9d-2913f5eb5809','47952bf9-0842-4f60-8fbc-ace32caec81e','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('aa2ff689-2bc7-4345-a8bf-e9989826fecc','e7884f47-8610-4230-9236-e9f92117654e','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('aa980816-2dd9-4200-b328-5cafd15d57d2','fc594ec5-07e6-45d1-b642-114ab175379e','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('aac6234c-ec92-4e8d-a62a-7523ff6a96b6','536fd762-9e30-458d-b231-7a3eb41c3120','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('aacccaa1-4521-47c5-a6aa-3dbeb6fb92a1','4e9a77bc-f41d-4896-9686-afe0a037bdb0','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('adcdc73b-5efe-40bd-b5f2-a4c2136842e9','fdfaea5f-db57-4cee-a23b-9af7e288c9ab','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('b08c0717-5951-446d-b71d-435b16d162e7','e7884f47-8610-4230-9236-e9f92117654e','a5724b15-1ae9-4837-b76f-e625c211a96f',25.00,'2026-02-18 01:41:01'),
('b3da2683-b945-430d-abb2-78008e3186c6','980e0a85-9ac7-4ddf-9c32-790329fdc557','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('b57cc08a-136f-45b7-8aba-ad26ff78f529','9d260e69-a41b-45cd-bde3-e549ff7309a0','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('b5968baa-8fae-4668-8162-2520f56c88e3','8dd052cd-4ee4-4577-a6b5-7f0b6e604714','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('b5f494ad-91f8-4d5e-8d3f-e9a1a2563304','af01ff02-e3fa-4cfe-8d74-dd0825154689','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('b6627872-160c-4df8-9f88-f9775a7fb215','c59a3a1d-1496-4b19-9502-4b0ec7847468','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('b94cc996-e0a2-48ae-81b9-e172a863d40d','ee01eb78-ecf0-4cf8-9959-7dbf6f4cbd81','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',18.00,'2026-02-18 01:41:01'),
('baad98ae-64a9-4fa2-a70c-327a928de01c','ce288881-4422-4332-ac36-21c288f201e9','0c139446-dae8-4173-b865-68f0254e22f6',10.00,'2026-02-18 01:41:01'),
('bc865140-05f3-46f0-a6c1-7e0e6e2ed09d','1187b118-55dc-42fb-91a3-9aaf00a66151','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('befb3230-a5cd-473e-b685-181ff3487822','f51c2588-7a47-4209-a196-14957452e165','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('bf234ad2-5911-4037-adc0-fd4f4820344e','e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('c0cd2141-ea88-48c3-b129-5b7a65f6d327','c3c607c0-c180-40cd-8cdd-6e29d93dab32','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('c476fedb-dd3b-4d47-804c-13c129ee6005','8dd052cd-4ee4-4577-a6b5-7f0b6e604714','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('c4d14a37-fc33-4c4d-89e1-639745d66426','980e0a85-9ac7-4ddf-9c32-790329fdc557','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('c4f22fd2-bd95-40fe-b7c4-4118602cc01a','86b55866-5335-48e5-b416-a83dce5e8dff','a5724b15-1ae9-4837-b76f-e625c211a96f',25.00,'2026-02-18 01:41:01'),
('c4f23cb3-1e5b-4764-9d1e-cc96b0ff7b06','eefb20cf-2b98-4437-85e5-1d0d8810824b','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('c65f846f-9f4c-47b4-969a-fefc47ebad6a','371edcce-3288-48d0-9d4a-7b5a2d2d505c','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('c89e79b2-f1e6-4e99-b68b-d6e36bd82c7a','536fd762-9e30-458d-b231-7a3eb41c3120','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('c8ddf4e3-43c1-4372-a611-25f12894122d','539f1d58-8fa9-4c6e-8981-b14726dc4c8e','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('caf87c6d-b055-4596-92c7-8564fe660d10','dafb7951-d6c5-44bd-8e9f-b74aecf49c85','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('cdbb5fd1-2895-4b1e-812a-8f67666adde1','60a1c563-5d02-4ab0-aad7-caf09de3a783','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('d0cf149e-a03b-45c9-8f28-6adfc62f64fa','49658ab1-cb59-4ba4-befc-5ede5df581a6','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('d401f758-60d1-4e82-861d-6a0678e1c19e','24d7a3c6-b650-423c-aed2-bc626d2379d3','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('d8eafcfc-2563-4937-b491-622dbbff6286','4ee47294-0c17-4371-b13f-493caf945d67','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('de7a894e-ae13-4b16-821b-bc2ed9061b4f','4ee47294-0c17-4371-b13f-493caf945d67','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('dea569b7-0b57-4fa2-89a2-4a0e2e477ac2','e6cf5716-d64f-497c-b7a6-950cd346678f','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('df6b6a67-670e-4727-8a62-3d4338af0b25','86b55866-5335-48e5-b416-a83dce5e8dff','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('dfd55f4a-0c54-4a4a-bedc-906eeb283473','1187b118-55dc-42fb-91a3-9aaf00a66151','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('e4a0b54c-c901-4058-b2ef-4ca07b3ce1b5','51b7bd4b-cbe5-4699-989e-826e5096c8fc','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('e787e8ff-fcc1-4e58-becc-098331495526','1b4956c6-a387-49e0-9848-2776637e7798','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00,'2026-02-18 01:41:01'),
('e8a8a4eb-596d-42ef-8dec-541e4c642b80','7031bb99-ef17-4bf2-b9a7-aac07572c398','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('e8aa351e-8eb6-43cb-b23a-8cc154705f4b','af8a8ef7-ca26-405e-a817-4253e601a308','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('eab2ddfe-f416-4eca-8043-cdd8f0aeb264','60a1c563-5d02-4ab0-aad7-caf09de3a783','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('ed3e2854-da04-4009-b4b6-e098cbda81d4','24d7a3c6-b650-423c-aed2-bc626d2379d3','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('eeab6c4b-7049-4f8f-b97f-742c57aee4b9','539f1d58-8fa9-4c6e-8981-b14726dc4c8e','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('ef071c48-8f17-4e02-9c50-face80f19f1a','d838e456-a305-457d-b950-9e376586cb52','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('f0cc4045-6070-4702-b62e-598658653a00','e7884f47-8610-4230-9236-e9f92117654e','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('f2a8eea2-7f64-49f0-991b-4191109ebe7e','4ee47294-0c17-4371-b13f-493caf945d67','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('f2f1f637-fc45-4a3c-b683-cbea615ce5cc','fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('f3672288-079d-48ad-b816-f0b9f65a8c4a','ce288881-4422-4332-ac36-21c288f201e9','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00,'2026-02-18 01:41:01'),
('f46f3aa0-e587-4f0d-a7a1-116147a42919','299c0233-89bb-4cb1-a74a-9e158615caf2','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('f674367a-bbde-4d9c-af6b-8de924a44b6d','b8d5e7c9-15b0-4753-886d-308719ecf758','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('f7221cce-5cdb-45d2-8b2c-ebd02c554029','b8d5e7c9-15b0-4753-886d-308719ecf758','7306e13b-035f-11f1-94d2-507b9db621bd',25.00,'2026-02-18 01:41:01'),
('f7b188a5-4804-409d-a329-93dfbd0b8e90','299c0233-89bb-4cb1-a74a-9e158615caf2','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('f7da5b08-6114-4fb0-af7c-19f80a5d3819','b431300d-1fdf-4603-bd2e-6f2729f27d09','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00,'2026-02-18 01:41:01'),
('f81db3b5-019a-4d8b-8f4f-20030991b75f','4bf82d21-cb0f-436a-9d5b-13065bd0af42','ee2b930f-de5f-4bb2-af86-45c7d3e39ba4',20.00,'2026-02-18 01:41:01'),
('f8e82acb-dbdf-4019-be7c-d77c21ec3991','60a1c563-5d02-4ab0-aad7-caf09de3a783','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01'),
('f9ba61b1-1762-4971-a4b5-3991686e16ea','1187b118-55dc-42fb-91a3-9aaf00a66151','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00,'2026-02-18 01:41:01'),
('f9e45510-35ed-4dbb-9674-7ab16d154720','0d2c947d-aa24-4963-8936-12857b302ac8','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('fa299803-7886-4293-ad59-f52ddc3b1756','371edcce-3288-48d0-9d4a-7b5a2d2d505c','0c139446-dae8-4173-b865-68f0254e22f6',12.00,'2026-02-18 01:41:01'),
('fa379bbd-45b8-4074-aed8-a805f991c58b','7031bb99-ef17-4bf2-b9a7-aac07572c398','0c139446-dae8-4173-b865-68f0254e22f6',10.00,'2026-02-18 01:41:01'),
('fd12f97b-ebe6-4e35-8dec-d9a1d35d69e7','701940af-137d-40b5-aeb4-7579c0b4ec87','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00,'2026-02-18 01:41:01'),
('fd964471-f789-4665-b34e-e38cc26ec768','47952bf9-0842-4f60-8fbc-ace32caec81e','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00,'2026-02-18 01:41:01');

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `products` */

insert  into `products`(`id`,`name`,`price`,`category`,`is_active`,`created_at`,`image_url`) values 
('0d2c947d-aa24-4963-8936-12857b302ac8','Coklat',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/coklat.jpg'),
('0f1e3a5b-ff17-49f9-997e-4dfa032c3bba','Espresso',10000.00,'Espresso Based',1,'2026-02-10 01:55:23','/assets/img/espresso.jpg'),
('1187b118-55dc-42fb-91a3-9aaf00a66151','Latte (Panas)',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/latte.jpg'),
('18db6fe8-b5f3-48d9-afe4-c8063748cb22','Lemon Tea (Dingin)',8000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/lemon-tea.jpg'),
('1b4956c6-a387-49e0-9848-2776637e7798','Red Velvet Creamy (Panas)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/red-velvet.jpg'),
('24d7a3c6-b650-423c-aed2-bc626d2379d3','Matcha Latte',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/matcha-latte.jpg'),
('299c0233-89bb-4cb1-a74a-9e158615caf2','Matcha Latte (Dingin)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/matcha-latte.jpg'),
('371edcce-3288-48d0-9d4a-7b5a2d2d505c','Red Velvet Creamy (Dingin)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/red-velvet.jpg'),
('47952bf9-0842-4f60-8fbc-ace32caec81e','Vanilla Latte (Dingin)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/vanilla-latte.jpg'),
('49658ab1-cb59-4ba4-befc-5ede5df581a6','Caramel Latte (Dingin)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/caramel-latte.jpg'),
('4ae6f38c-dbcc-4604-8ba9-64bc63ce088f','Roti Bakar Keju',13000.00,'Snack',1,'2026-02-10 01:55:23','/assets/img/roti-bakar.jpg'),
('4bf82d21-cb0f-436a-9d5b-13065bd0af42','Hazelnut Latte',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/hazelnut-latte.jpg'),
('4e9a77bc-f41d-4896-9686-afe0a037bdb0','Kopi Susu (Dingin)',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/kopi-susu.jpg'),
('4ee47294-0c17-4371-b13f-493caf945d67','Latte (Dingin)',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/latte.jpg'),
('51b7bd4b-cbe5-4699-989e-826e5096c8fc','Red Velvet Creamy',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/red-velvet.jpg'),
('536fd762-9e30-458d-b231-7a3eb41c3120','Butterscotch',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/butterscotch.jpg'),
('539f1d58-8fa9-4c6e-8981-b14726dc4c8e','Matcha Latte (Panas)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/matcha-latte.jpg'),
('60a1c563-5d02-4ab0-aad7-caf09de3a783','Pandan Latte (Dingin)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/pandan-latte.jpg'),
('66790402-d047-462c-be40-e3ebd3fe8663','Caramel Latte (Panas)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/caramel-latte.jpg'),
('69495623-4a4b-486e-ba3f-726b8a6c0a62','Coklat (Dingin)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/coklat.jpg'),
('701940af-137d-40b5-aeb4-7579c0b4ec87','Vanilla Latte',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/vanilla-latte.jpg'),
('7031bb99-ef17-4bf2-b9a7-aac07572c398','Matcha (Dingin)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/matcha.jpg'),
('7157f68f-7eef-4fe7-95f3-0dcf9865a25a','Kopi Susu (Panas)',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/kopi-susu.jpg'),
('7544398d-4389-4349-8fa4-78733df4507e','StrawBerry Squash (Dingin)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/strawberry-squash.jpg'),
('77c1c69f-05e9-11f1-9a18-507b9db621bd','Roti Bakar Coklat',13000.00,'Snack',1,'2026-02-10 01:59:31','/assets/img/roti-bakar.jpg'),
('86b55866-5335-48e5-b416-a83dce5e8dff','Thai Tea (Panas)',13000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/thai-tea.jpg'),
('8dd052cd-4ee4-4577-a6b5-7f0b6e604714','Kopi Gula Aren (Dingin)',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/kopi-aren.jpg'),
('980e0a85-9ac7-4ddf-9c32-790329fdc557','Thai Tea',13000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/thai-tea.jpg'),
('9d260e69-a41b-45cd-bde3-e549ff7309a0','Americano (Panas)',10000.00,'Espresso Based',1,'2026-02-10 01:55:23','/assets/img/americano.jpg'),
('9ea47c76-6bf2-43ce-9ca8-2a6a5a101f03','Pandan Latte (Panas)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/pandan-latte.jpg'),
('aeb8ad2b-5f19-401e-9f4f-15c7f84f9896','Espresso (Panas)',10000.00,'Espresso Based',1,'2026-02-10 01:55:23','/assets/img/espresso.jpg'),
('af01ff02-e3fa-4cfe-8d74-dd0825154689','Caramel Latte',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/caramel-latte.jpg'),
('af8a8ef7-ca26-405e-a817-4253e601a308','Kopi Gula Aren',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/kopi-aren.jpg'),
('b431300d-1fdf-4603-bd2e-6f2729f27d09','Coklat (Panas)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/coklat.jpg'),
('b716e3c0-3f42-4362-b850-4e0dd50ac621','Latte',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/late.jpg'),
('b8d5e7c9-15b0-4753-886d-308719ecf758','StrawBerry Squash',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/strawberry-squash.jpg'),
('c343acf5-231f-406d-8611-d5e5b8fee4ac','Lemon Tea',8000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/lemon-tea.jpg'),
('c3c607c0-c180-40cd-8cdd-6e29d93dab32','StrawBerry Squash (Panas)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/strawberry-squash.jpg'),
('c59a3a1d-1496-4b19-9502-4b0ec7847468','Pandan Latte',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/pandan-latte.jpg'),
('ce288881-4422-4332-ac36-21c288f201e9','Matcha',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/matcha.jpg'),
('d838e456-a305-457d-b950-9e376586cb52','Americano (Dingin)',10000.00,'Espresso Based',1,'2026-02-10 01:55:23','/assets/img/americano.jpg'),
('dafb7951-d6c5-44bd-8e9f-b74aecf49c85','Vanilla Latte (Panas)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/vanilla-latte.jpg'),
('e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3','Butterscotch (Dingin)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/butterscotch.jpg'),
('e6cf5716-d64f-497c-b7a6-950cd346678f','Hazelnut Latte (Panas)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/hazelnut-latte.jpg'),
('e7884f47-8610-4230-9236-e9f92117654e','Thai Tea (Dingin)',13000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/thai-tea.jpg'),
('eda015a0-7989-4373-8269-0ec907d93de2','Butterscotch (Panas)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/butterscotch.jpg'),
('ee01eb78-ecf0-4cf8-9959-7dbf6f4cbd81','Matcha (Panas)',15000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/matcha.jpg'),
('eefb20cf-2b98-4437-85e5-1d0d8810824b','Kopi Susu',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/kopi-susu.jpg'),
('f41c7c02-8151-4728-a436-d84a83bf8d8c','Lemon Tea (Panas)',8000.00,'Non-Coffee',1,'2026-02-10 01:55:23','/assets/img/lemon-tea.jpg'),
('f51c2588-7a47-4209-a196-14957452e165','Americano',10000.00,'Espresso Based',1,'2026-02-10 01:55:23','/assets/img/americano.jpg'),
('fc594ec5-07e6-45d1-b642-114ab175379e','Espresso (Dingin)',10000.00,'Espresso Based',1,'2026-02-10 01:55:23','/assets/img/espresso.jpg'),
('fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','Hazelnut Latte (Dingin)',16000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/hazelnut-latte.jpg'),
('fdfaea5f-db57-4cee-a23b-9af7e288c9ab','Kopi Gula Aren (Panas)',15000.00,'Milk Based',1,'2026-02-10 01:55:23','/assets/img/kopi-aren.jpg');

/*Table structure for table `raw_materials` */

DROP TABLE IF EXISTS `raw_materials`;

CREATE TABLE `raw_materials` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` decimal(10,2) DEFAULT 0.00,
  `min_stock` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `raw_materials` */

insert  into `raw_materials`(`id`,`name`,`unit`,`image_url`,`stock`,`min_stock`,`created_at`) values 
('0c139446-dae8-4173-b865-68f0254e22f6','Creamer Bubuk','gram','/assets/bahan-baku/creamer.jpg',712.00,1000.00,'2026-02-10 02:37:58'),
('7306a061-035f-11f1-94d2-507b9db621bd','Syrup Caramel','ml','/assets/bahan-baku/sirup-caramel.jpg',975.00,200.00,'2026-02-06 20:26:31'),
('7306e09a-035f-11f1-94d2-507b9db621bd','Vanilla Powder','gram','/assets/bahan-baku/vanila-powder.jpg',950.00,100.00,'2026-02-06 20:26:31'),
('7306e13b-035f-11f1-94d2-507b9db621bd','Sirup strawberry','ml','/assets/bahan-baku/sirup-strawbery.jpg',975.00,100.00,'2026-02-06 20:26:31'),
('7306e1ce-035f-11f1-94d2-507b9db621bd','Sirup Buterscoth','ml','/assets/bahan-baku/buters-scoth.jpg',825.00,100.00,'2026-02-06 20:26:31'),
('7306e245-035f-11f1-94d2-507b9db621bd','Sirup Pandan Late','ml','/assets/bahan-baku/pandan-late.jpg',923.00,100.00,'2026-02-06 20:26:31'),
('7d96767a-123b-4c62-bbbe-a8ca2a2d8b42','Cup Kertas','pcs','/assets/bahan-baku/cup-kertas.jpg',899.00,10.00,'2026-02-06 14:57:19'),
('81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','Susu Kental Manis','ml','/assets/bahan-baku/skm.jpg',550.00,200.00,'2026-02-06 02:41:56'),
('86fd48ab-3912-4c00-9921-72a1344ea08f','Cup Plastik','pcs','/assets/bahan-baku/cup-plastik.jpg',966.00,10.00,'2026-02-06 14:57:19'),
('9d34503c-56ee-4ddf-a61f-43f837157dca','Matcha (Bubuk)','gram','/assets/bahan-baku/macha-bubuk.jpg',940.00,150.00,'2026-02-06 11:50:11'),
('a5724b15-1ae9-4837-b76f-e625c211a96f','Thai Tea (Bubuk)','gram','/assets/bahan-baku/thai-tea.jpg',975.00,150.00,'2026-02-06 11:50:11'),
('a7a99075-19f6-481c-893e-f8d3ec0fa140','Susu UHT','ml','/assets/bahan-baku/UHT.jpg',4800.00,1000.00,'2026-02-06 02:41:56'),
('c10464fc-e0bc-45ea-b720-f8cead11d263','Biji Kopi','gram','/assets/bahan-baku/biji-kopi.jpg',655.00,200.00,'2026-02-06 02:41:56'),
('d52b4710-be7e-4b48-bdd0-7a69c9c02c42','Coklat (Bubuk)','gram','/assets/bahan-baku/coklat.jpg',952.00,100.00,'2026-02-06 11:50:11'),
('ee2b930f-de5f-4bb2-af86-45c7d3e39ba4','Sirup Hazelnut','ml','/assets/bahan-baku/hazelnut.jpg',940.00,200.00,'2026-02-18 00:48:07'),
('fd183f89-035e-11f1-94d2-507b9db621bd','Gula Aren Cair','gram','/assets/bahan-baku/gula-aren.jpg',985.00,100.00,'2026-02-06 20:23:13'),
('fde6c993-aba9-4f67-ab24-2cdaad89e81c','Red Velvet (Bubuk)','gram',NULL,8.00,100.00,'2026-03-03 02:10:53'),
('ff0262ad-7c92-42e2-8f75-5df94ba13320','Lemon Tea (Bubuk)','gram','/assets/bahan-baku/lemon-tea.jpg',950.00,50.00,'2026-02-06 11:50:11');

/*Table structure for table `recipe_details` */

DROP TABLE IF EXISTS `recipe_details`;

CREATE TABLE `recipe_details` (
  `id` varchar(36) NOT NULL,
  `recipe_id` varchar(36) DEFAULT NULL,
  `raw_material_id` varchar(36) DEFAULT NULL,
  `qty` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `raw_material_id` (`raw_material_id`),
  CONSTRAINT `recipe_details_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recipe_details_ibfk_2` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `recipe_details` */

insert  into `recipe_details`(`id`,`recipe_id`,`raw_material_id`,`qty`) values 
('00b79aa6-83b1-4d8a-98f5-c2a1946b1cfe','cdfa4653-6340-4ce8-aeb9-ebed51848703','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('01a54a37-a787-4f1f-8cdd-8e1ec2f90908','fa3785d1-1161-4107-a95c-48caef4c4757','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('034659e4-da8f-4909-9896-fc9102c87a38','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('05e14474-8c2a-467d-9146-c3a97451b088','3719a11e-c958-4650-96b8-eb06b3e5a6e8','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('06140fe1-949d-40d5-8f7e-09b482438c61','37b268f4-e476-47cf-b1d7-2baf3fecc85a','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('06bec578-704a-4d72-a0b7-d3b3a9431fd8','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('0b2989da-6590-4dd4-9910-c2153b4c00f1','dc1f9071-fc29-45af-bde9-d260826d96ed','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('0cc07f31-dcea-4b20-b138-bbbe8a2d2671','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('0d6b3025-d4c0-431e-9839-1409301dc5f7','fdb88066-ced2-430d-b80f-a57c1f053ddb','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('0e2c371b-7488-476d-be0d-b05e8912f605','24975183-2e80-46de-94f3-50811ca17327','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('10dadc9e-7146-4254-bf6c-d00a9e829d9a','26e95cbe-b0f8-44dd-907f-72377303222d','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('125443dd-7b38-4a45-8839-7c03939c0d59','f04c95f6-6412-4d92-abb7-192e46138725','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('13277ec4-2b4e-499a-8488-0761745544dd','24975183-2e80-46de-94f3-50811ca17327','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('1396e330-cc78-4469-b911-927c761ffc3c','11c62233-58e9-4c6d-ba72-f804efc85a1a','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('13e2a02c-6172-42bd-a50f-575620fdd638','0a509d4d-fc23-414a-870b-d2a371c14244','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('1495f0de-5654-4910-b1f4-b64d92c280ce','f39f9c2a-2dce-487e-b225-23fdc2154c39','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('174be636-25b5-409e-90c8-1e02885fa7cb','f39f9c2a-2dce-487e-b225-23fdc2154c39','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('178205c8-5707-4d02-95a9-2a97b97e77d7','11c62233-58e9-4c6d-ba72-f804efc85a1a','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('17ad6e93-233d-4ad9-a4ce-403895b33474','2a8a2734-26e1-444d-81a0-e6edae1164ca','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('1800e2e5-cf02-4dd5-984b-5fdef0ea5571','f04c95f6-6412-4d92-abb7-192e46138725','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('185e58ae-deb1-44f9-ab09-8a04854353e9','ed382d89-03f1-4aae-9643-83512a977f92','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('19ad204c-b577-4d44-bfd1-94f55ffbf165','107b3aba-6698-4d72-a516-18ecfe631737','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('19add199-ced9-47da-b8b6-ff13efc9dda3','59b69c4d-d758-4b03-8c31-d20968c10220','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00),
('19bb71f8-b0dc-4db7-b8a2-fbddfa0777f3','19918a4a-0db6-43d5-b82c-2ab39ee366c6','a5724b15-1ae9-4837-b76f-e625c211a96f',25.00),
('1a2dac40-317b-4ab3-b722-2dabe44c76fb','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','7306a061-035f-11f1-94d2-507b9db621bd',25.00),
('1c3febf8-e3db-4bdd-bf8a-904bbb630fbf','74820eca-cbd3-4b2d-985d-82a390a5eca0','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('1d3c28f9-3841-45a4-b382-bf2cf0286d60','74820eca-cbd3-4b2d-985d-82a390a5eca0','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('1dacb34a-481e-46d7-b1c1-9b9aff72d972','37b268f4-e476-47cf-b1d7-2baf3fecc85a','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('1dc05376-e927-4bd7-b6d6-ef55b00eaa0a','ea2e3454-97c3-4d00-8aef-4586e9889c75','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('200454ff-69cd-43b1-b6ed-df499ebe5004','cdfa4653-6340-4ce8-aeb9-ebed51848703','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('215b0338-d66d-48b6-bf60-73efbe0892ca','37b268f4-e476-47cf-b1d7-2baf3fecc85a','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('215b36b2-3ee4-4bd7-8a0d-65060df73da8','adbfc441-5dc4-46db-8cbe-059d564822a9','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('220f621f-bb07-41fa-93d0-df0d9650fb68','ab92e4f0-a435-47b7-8659-174d982162b8','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('222502bb-b03d-4785-a466-d4816a25ab6b','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('222faf38-6304-4232-bd88-a77440a37c33','6996c3c8-4ad4-4380-a78d-93c718b647f0','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('22ac2b98-0718-40a5-b0b6-efdce7b6d9dc','0a509d4d-fc23-414a-870b-d2a371c14244','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('24f72bf8-0df9-46c2-b50a-f494aa1ccbe9','1c52bda6-4b55-4550-9ac7-56b68cdd444d','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('26452cf9-64d4-4452-8780-d76277cbc32f','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('28b90217-f08b-4963-9ab5-45a0589efb30','507f20fa-89d4-4475-9cc5-145440eeb226','ee2b930f-de5f-4bb2-af86-45c7d3e39ba4',25.00),
('2b0c767c-31f0-4a61-8ec9-2ff2522c60da','ab92e4f0-a435-47b7-8659-174d982162b8','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('2b2021b2-70b1-4a06-8339-376cd8588568','cdfa4653-6340-4ce8-aeb9-ebed51848703','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('2e827f44-391e-4cd9-a8dc-c50cff6c879b','59b69c4d-d758-4b03-8c31-d20968c10220','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('2ed96f6d-213e-4716-b7c3-bf577bf15044','e6d214df-fd0c-4bcb-9bdd-ca75bce1adc9','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('2f363427-ad01-4b43-8222-5e69f915c29a','74aea3c2-a311-4f64-bdab-698f16767910','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('327f190e-c61d-4f49-90e1-0136db25687b','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('32c87fd1-56b5-4f56-abe2-37c5069a9dff','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('33afeb6a-6838-4e3e-bf13-ceaadb44a8c8','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('340b4e3c-e4be-4928-82d3-4062dd7fb997','f04c95f6-6412-4d92-abb7-192e46138725','d52b4710-be7e-4b48-bdd0-7a69c9c02c42',25.00),
('3498ae6a-df56-4535-93b8-37a6dea85296','74aea3c2-a311-4f64-bdab-698f16767910','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('34f619ba-4fae-4851-b522-01a45ae568e7','507f20fa-89d4-4475-9cc5-145440eeb226','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('34f6be46-bd7f-4af1-b155-de5663cf968f','fdb88066-ced2-430d-b80f-a57c1f053ddb','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('367d826f-6c1a-4e6f-a705-59a3d0079f9b','7fe83d8f-980f-4b33-a974-92c683379612','ff0262ad-7c92-42e2-8f75-5df94ba13320',25.00),
('39a282b2-388d-4727-bfd2-57d3f96fbac3','97d7280e-db45-41c5-869a-1e9c63db3684','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('3a5dacb9-97ee-4093-b715-53795e8e1e64','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00),
('3bef6488-51c7-4543-96ad-4b63b81f3e89','02179074-10e2-4c08-a11f-d1ca526d5b32','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('3d064054-c07b-4894-9b4a-bb6ec7d2dbea','02179074-10e2-4c08-a11f-d1ca526d5b32','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('3f30cbf7-21c6-402c-abb5-1d9d009ca2a7','74820eca-cbd3-4b2d-985d-82a390a5eca0','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('42e7d57d-a1cf-47bf-b5bd-26b20b2a6f01','107b3aba-6698-4d72-a516-18ecfe631737','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('43723589-590d-4c64-b4d2-d2c906018cb9','24975183-2e80-46de-94f3-50811ca17327','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('45029e8b-d8eb-47d8-b87f-848252990a7f','e6d214df-fd0c-4bcb-9bdd-ca75bce1adc9','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('458e3009-592f-4b56-a1f1-0b76294f2ec1','3c822f9f-4888-42d8-8092-371fc21279ed','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('460172a7-a0ba-4d8d-8911-c52c87551667','fa3785d1-1161-4107-a95c-48caef4c4757','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('4708ebb5-a9b0-4c08-aa54-8f545250e6b5','33b449c8-236d-4b1d-bda8-6419d7d43eab','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('47462769-1c49-4306-b654-87a10e5f9138','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('4e0cb930-c2eb-47f3-8d03-b4b23bc01ddb','5a1e968d-b10c-4928-a9a6-7ce1d0e213a2','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('50646702-eeba-4df1-8d62-1c90fcdc94d8','bf545366-6569-491e-afb0-0cd7c9baa113','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('50aba350-ab2b-48a6-a205-1d11af331898','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','ee2b930f-de5f-4bb2-af86-45c7d3e39ba4',25.00),
('5111bcc1-c332-48bc-b303-6541b4cd63db','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('51cef11b-9f1c-49ac-8f53-51cc0dc165dc','59b69c4d-d758-4b03-8c31-d20968c10220','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('5229cefb-96f4-46be-b871-4a3695caad07','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','7306e1ce-035f-11f1-94d2-507b9db621bd',25.00),
('53a5eb70-dd6a-4013-b561-2e6f1df58353','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('542a2769-92b5-489d-8039-d9beb5446d69','107b3aba-6698-4d72-a516-18ecfe631737','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('573e97e8-2c5b-43b1-8e0a-0f612db6e87f','7fe83d8f-980f-4b33-a974-92c683379612','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('579bc77b-a5e8-4f9b-bdce-5fccba4600be','bf545366-6569-491e-afb0-0cd7c9baa113','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('57f65a13-c81c-4563-b07a-2a56be9baab1','59b69c4d-d758-4b03-8c31-d20968c10220','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('59c53d53-129b-45fc-9b20-031b29817346','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('604f6fd1-2a3c-4c59-b555-6c4690c65e9c','3d0bd13b-3526-4b56-a888-3cc89772d870','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('61444e66-1caa-4bcd-9ab5-fd40ca498771','11c62233-58e9-4c6d-ba72-f804efc85a1a','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('64390f10-79fe-41d2-9be3-c7fbe36a696b','24975183-2e80-46de-94f3-50811ca17327','7306e1ce-035f-11f1-94d2-507b9db621bd',25.00),
('65738eb1-b0f5-4617-a966-cf124072f151','11c62233-58e9-4c6d-ba72-f804efc85a1a','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('66782239-8f1d-4aa6-971f-68bb933820dd','3c822f9f-4888-42d8-8092-371fc21279ed','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('67f4bda9-b394-419a-9b33-9c89d3a1184f','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('68df967d-bd35-499d-8063-7a9d62b6e3a8','c43ea7a1-73f2-4873-b74d-327f570cf5cc','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('6b8e2cd5-0302-45dc-8cbf-f508e4d1fb9b','26e95cbe-b0f8-44dd-907f-72377303222d','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('6c933a4b-374d-4b24-8120-f63f5f372f02','ed382d89-03f1-4aae-9643-83512a977f92','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00),
('6cd6ed30-5941-4cc8-8ff0-66fb8bcd022e','bf545366-6569-491e-afb0-0cd7c9baa113','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('6d4c9f9c-11e6-4789-861a-3f4ef56b180a','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('6ec03e31-f7c7-4a29-bfd7-391e1ce8ba62','5a1e968d-b10c-4928-a9a6-7ce1d0e213a2','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('6f883db8-0a3c-4cd9-af84-f1faeb1f562d','f39f9c2a-2dce-487e-b225-23fdc2154c39','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('7004d608-16c5-4618-ad1f-75f61ea80b96','46fb6074-f6ad-4400-a39d-0251ad6d2e73','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('71722e78-e0aa-443b-8488-1d8a4061c98b','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('71e86ed0-f028-434a-b5c8-9d80da0b709a','46fb6074-f6ad-4400-a39d-0251ad6d2e73','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('745d37db-3ae1-42a9-b0c9-2fa886e71f7d','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('74a1903c-8b8e-4952-a39b-9d6c5696c6dd','fdb88066-ced2-430d-b80f-a57c1f053ddb','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('753a17f8-7362-4755-ac55-bba5c1738255','ab92e4f0-a435-47b7-8659-174d982162b8','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('7706b189-ceb4-43b8-a264-b0058efd23fc','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('77282772-fe77-40c9-8e4d-b26c2c7969c0','e776a32b-2b74-402d-a782-0c4fb6a97242','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('791bab37-7fb9-42ed-bf40-84659879a734','0a509d4d-fc23-414a-870b-d2a371c14244','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('7a224770-25ee-4cc8-a7b4-6d899c78f91b','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('7a5e400d-2540-4e24-adff-510b82a41c93','6996c3c8-4ad4-4380-a78d-93c718b647f0','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('7dbd8f86-7ef3-46ee-ae5c-5fdd6c790281','ea2e3454-97c3-4d00-8aef-4586e9889c75','a5724b15-1ae9-4837-b76f-e625c211a96f',25.00),
('7dc3aa0c-a0a5-43fc-bea4-09720b5c84ef','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('7e3d2479-f424-46a7-9e9f-de36c8aa7d6c','24975183-2e80-46de-94f3-50811ca17327','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('7e61e117-ebf8-47ce-828b-5173b30bc2b8','e4097402-1fa5-4778-86e7-4ae206c42ee2','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('80ede4be-a977-496e-b858-0090c00d67c0','fdb88066-ced2-430d-b80f-a57c1f053ddb','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('82bf08df-7ade-4251-8d52-d2fb1e1af20a','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00),
('85b96f7b-f6f6-4d64-9cdc-6b7f0eaf6ff9','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('866d8ed1-8db0-4ac5-b2d7-d23c7451405e','bf545366-6569-491e-afb0-0cd7c9baa113','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('89e19b01-cb37-49f1-b943-8d874b1d536d','fdb88066-ced2-430d-b80f-a57c1f053ddb','7306e1ce-035f-11f1-94d2-507b9db621bd',25.00),
('8a062016-a912-4da6-831b-cc6adad51832','1afa6a2a-0983-4946-be88-82929eb8018b','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('8b3c31c2-3e69-42bf-827f-732f5f7119d0','2a8a2734-26e1-444d-81a0-e6edae1164ca','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('8ba02e30-e203-4630-9670-da681ab9c950','6996c3c8-4ad4-4380-a78d-93c718b647f0','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('8c55e0fa-7080-4a94-8378-431f1da006aa','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('8da7803c-501f-4f94-95b3-1a89d2f721ad','74aea3c2-a311-4f64-bdab-698f16767910','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('8eabbe32-1816-4174-85c0-820f40704aea','1c52bda6-4b55-4550-9ac7-56b68cdd444d','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('8f2f0461-079d-451f-ad94-c9edc75f5436','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('8f7ede7e-2283-404c-9c17-d98a61a29e1d','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('8f81feff-771b-421d-835f-c40b219c18d2','3d0bd13b-3526-4b56-a888-3cc89772d870','d52b4710-be7e-4b48-bdd0-7a69c9c02c42',25.00),
('8fdd375a-dd75-4ce3-b367-64c70d3ac1f7','0a509d4d-fc23-414a-870b-d2a371c14244','7306e245-035f-11f1-94d2-507b9db621bd',25.00),
('917cc7b2-0015-424e-9780-20498cce4d1e','37b268f4-e476-47cf-b1d7-2baf3fecc85a','7306e09a-035f-11f1-94d2-507b9db621bd',25.00),
('927fad7a-d598-463b-9dfc-381ce7c4106c','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('92f8a858-a93c-4a95-914c-fb5c33c008be','3d0bd13b-3526-4b56-a888-3cc89772d870','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('951c005a-967f-4d9d-a50d-852e1e8974ed','19918a4a-0db6-43d5-b82c-2ab39ee366c6','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('97815d4d-f223-4e0e-ab7f-e54cf8bda590','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('987d1115-e6e9-49c0-8c90-8bd0b9514b64','74820eca-cbd3-4b2d-985d-82a390a5eca0','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('9909d9bf-af62-4a7e-8903-67bcec66d222','e776a32b-2b74-402d-a782-0c4fb6a97242','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('99b126e0-b8e1-4ad5-b55c-70361e93be4e','ed382d89-03f1-4aae-9643-83512a977f92','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('9c539563-ed2a-4f27-8a98-bf561255598b','f16d9fb7-daa5-4d0a-933f-d7218bc4b1a1','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('9cd714c6-6ade-4904-af22-8e3cc3a74d7d','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('9f51ae7b-ba1a-4415-804d-7c2fef49836e','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','7306e13b-035f-11f1-94d2-507b9db621bd',25.00),
('a2556d20-0d1e-4d3b-8426-df22a387e3db','33b449c8-236d-4b1d-bda8-6419d7d43eab','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('a2790594-97e8-44ec-82ae-943d7b9767b0','33b449c8-236d-4b1d-bda8-6419d7d43eab','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('a379f495-5afb-4023-8062-d5c85e6034d9','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('a3cdf0eb-9f68-4628-a662-cdfc2b7d77be','02179074-10e2-4c08-a11f-d1ca526d5b32','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('a475e53e-2475-4d3b-9d74-6acebc749347','e6d214df-fd0c-4bcb-9bdd-ca75bce1adc9','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('a49414af-1b64-4d1e-988b-2e7df6cb396c','107b3aba-6698-4d72-a516-18ecfe631737','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00),
('a4e7b42c-6b67-41db-856f-be83bc9cd439','3d0bd13b-3526-4b56-a888-3cc89772d870','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('a65f5172-a4fb-4b4e-be27-e736569bc570','3719a11e-c958-4650-96b8-eb06b3e5a6e8','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('a8a20317-4cab-4826-8113-3c7b5d03b3ad','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('aa540d20-9790-4d56-afca-7a01adf31c3c','1c52bda6-4b55-4550-9ac7-56b68cdd444d','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('aa7cc8cf-4c0d-4456-a537-2b84c02532b9','6996c3c8-4ad4-4380-a78d-93c718b647f0','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('ab86d5ef-5acf-400b-8dd9-431047c6120c','1afa6a2a-0983-4946-be88-82929eb8018b','ff0262ad-7c92-42e2-8f75-5df94ba13320',25.00),
('ac0e6e2b-b1eb-4404-a8cd-8eca5ff5c15a','3c822f9f-4888-42d8-8092-371fc21279ed','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('ac254c51-ca07-4443-8386-4564280606e3','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('acb5190e-1353-4ffc-9fa1-b4947cf65a0b','f39f9c2a-2dce-487e-b225-23fdc2154c39','a5724b15-1ae9-4837-b76f-e625c211a96f',25.00),
('acd4e0c3-28e7-4633-beed-ea178210759b','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('ae196b4c-9fb9-4202-b65b-53decc13ba31','dc1f9071-fc29-45af-bde9-d260826d96ed','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('ae905ee3-7ff7-4c1a-86e0-6d2547981c04','5a1e968d-b10c-4928-a9a6-7ce1d0e213a2','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('afc1a2c0-bc99-4a04-988a-e0dc26c395b0','e6d214df-fd0c-4bcb-9bdd-ca75bce1adc9','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('b03eee72-2560-4ba7-8918-578c6f935e4d','74aea3c2-a311-4f64-bdab-698f16767910','7306a061-035f-11f1-94d2-507b9db621bd',25.00),
('b167c3b7-eae4-4e39-b892-93e76b450a8e','37b268f4-e476-47cf-b1d7-2baf3fecc85a','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b1f05565-6da8-458f-84fb-4add02ba9792','ab92e4f0-a435-47b7-8659-174d982162b8','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b2a43b4a-f57c-411f-a660-d2a1d660e8b0','3b395204-c1f9-4377-82a6-7f263b30d7af','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('b444976e-8e66-4b12-ac9d-15fc4d4f3104','fa3785d1-1161-4107-a95c-48caef4c4757','7306e13b-035f-11f1-94d2-507b9db621bd',25.00),
('b4d7696d-8d84-4bdc-a212-d154cb2eb0ad','cdfa4653-6340-4ce8-aeb9-ebed51848703','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('b5953aa6-df7b-4046-bf19-acf72395733e','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b5bdc2cc-bc83-460c-beeb-12a87ccd8a9a','ea2e3454-97c3-4d00-8aef-4586e9889c75','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b7cf281c-012b-41e0-8928-51f667fc8e16','ea2e3454-97c3-4d00-8aef-4586e9889c75','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('b8955fe4-0322-497b-8e48-1e06615ab209','c43ea7a1-73f2-4873-b74d-327f570cf5cc','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('ba62b5a2-5e33-4930-aecc-4ee64f4ed192','19918a4a-0db6-43d5-b82c-2ab39ee366c6','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('bd2f044c-aa5b-410d-80f8-524f17a3832a','19918a4a-0db6-43d5-b82c-2ab39ee366c6','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('bd693564-8bcb-45f8-9f26-f621ccd013a4','3b395204-c1f9-4377-82a6-7f263b30d7af','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('be45e4e6-5bdd-4876-a5ba-4bd5dfe41296','ed382d89-03f1-4aae-9643-83512a977f92','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('bed1486f-9e9a-4bb4-b1e0-3d3cbd21388f','74820eca-cbd3-4b2d-985d-82a390a5eca0','7306e09a-035f-11f1-94d2-507b9db621bd',25.00),
('bfa65695-efd9-45fa-8e5b-17ea99442d53','e4097402-1fa5-4778-86e7-4ae206c42ee2','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('c25091d7-34ae-4934-9fef-ca272087d10f','3719a11e-c958-4650-96b8-eb06b3e5a6e8','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('c3e98b67-c7dd-4a52-bf55-bde5042f5e9a','fdb88066-ced2-430d-b80f-a57c1f053ddb','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('c59c5a32-aea9-484b-85dd-bfabd97413fe','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('c898c79e-9b2c-496c-a723-4088dcb3b646','1c52bda6-4b55-4550-9ac7-56b68cdd444d','7306e245-035f-11f1-94d2-507b9db621bd',25.00),
('c8ad4ae0-417a-41bf-b01e-5eaf422c3833','33b449c8-236d-4b1d-bda8-6419d7d43eab','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('c8ca0879-e37e-4eb5-a1aa-218942888d1e','5a1e968d-b10c-4928-a9a6-7ce1d0e213a2','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('c960d3f4-4292-4c2a-9afb-05a4074e335c','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','ee2b930f-de5f-4bb2-af86-45c7d3e39ba4',25.00),
('ca8b29ef-81cf-4f85-9ae4-9add7d2ac37f','bf545366-6569-491e-afb0-0cd7c9baa113','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('cacd091c-dc16-4f31-a38d-604b5827b560','0a509d4d-fc23-414a-870b-d2a371c14244','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('ce1a21d4-802a-4709-9e46-00b60cc58c9e','e4097402-1fa5-4778-86e7-4ae206c42ee2','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('ce296c52-11c0-475f-a431-2d1f5436bcfc','dc1f9071-fc29-45af-bde9-d260826d96ed','d52b4710-be7e-4b48-bdd0-7a69c9c02c42',25.00),
('cf49eebb-3b44-457e-96b9-a1bfc2be3299','02179074-10e2-4c08-a11f-d1ca526d5b32','7306e09a-035f-11f1-94d2-507b9db621bd',25.00),
('cf96d38b-eac3-42b0-af97-8d5cba647215','dc1f9071-fc29-45af-bde9-d260826d96ed','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('d034a133-781b-47fd-a592-6adebe2c8b9c','02179074-10e2-4c08-a11f-d1ca526d5b32','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('d0c55e26-3b5b-4821-82a4-13d427f9fa3e','97d7280e-db45-41c5-869a-1e9c63db3684','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('d131f7bc-893d-4c01-9203-1b38b970cce2','26e95cbe-b0f8-44dd-907f-72377303222d','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('d170d567-ddda-4032-8ce0-dd8d178f1498','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('d1e7bf03-2167-4b98-aa4c-5543b3be1ec9','507f20fa-89d4-4475-9cc5-145440eeb226','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('d770b271-914e-470b-8db2-8b0a53f88617','33b449c8-236d-4b1d-bda8-6419d7d43eab','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('d77e21d0-8239-4460-bcef-9502e8bfcc6d','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('d7870f99-2a43-4ab4-82c3-e5c1c0c50d6a','e776a32b-2b74-402d-a782-0c4fb6a97242','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('d796dd04-6c7d-4770-97dd-4f87ae3c1202','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('d8790dfb-ae5b-4b82-8c71-df9ced432ae7','cdfa4653-6340-4ce8-aeb9-ebed51848703','fd183f89-035e-11f1-94d2-507b9db621bd',15.00),
('d9aae2d0-49c5-4752-9463-da3cda4358b8','f04c95f6-6412-4d92-abb7-192e46138725','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('dd724015-5e88-4e97-adc4-0c89e3aea4bc','3719a11e-c958-4650-96b8-eb06b3e5a6e8','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('e355891d-6d5e-4fd2-bdb3-e3254bcc7f2d','fa3785d1-1161-4107-a95c-48caef4c4757','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('e47e84ad-0300-4a01-89d3-cca0831d351a','08a6fc03-54a9-4148-be3f-ef68524f0ff0','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('e51ab2d4-c875-40ee-bb19-6537d781a663','e776a32b-2b74-402d-a782-0c4fb6a97242','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('e5916a50-c919-43a8-afa3-95926ef28851','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('e596ca12-6416-4d22-bcd3-cc1404d9f230','507f20fa-89d4-4475-9cc5-145440eeb226','c10464fc-e0bc-45ea-b720-f8cead11d263',15.00),
('e72f7f17-130d-4922-a662-3b37be56533a','f16d9fb7-daa5-4d0a-933f-d7218bc4b1a1','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('e7f3833b-cdfc-442a-87b2-bbe345383b0b','ab92e4f0-a435-47b7-8659-174d982162b8','7306e245-035f-11f1-94d2-507b9db621bd',25.00),
('eb5675a2-ec63-4eaa-b7c5-6317427a3f71','adbfc441-5dc4-46db-8cbe-059d564822a9','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('ecd3b6f2-ef5d-4903-94fd-0e243f40478e','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','7306a061-035f-11f1-94d2-507b9db621bd',25.00),
('ef59fd7b-1d5d-480a-a68b-b9a1e41d45ee','11c62233-58e9-4c6d-ba72-f804efc85a1a','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('f09744a5-4421-4328-ad8f-34618aa633ea','adbfc441-5dc4-46db-8cbe-059d564822a9','9d34503c-56ee-4ddf-a61f-43f837157dca',20.00),
('f1955e60-67d8-4052-87e2-5b859e138b52','1c52bda6-4b55-4550-9ac7-56b68cdd444d','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('f202bb85-4904-4a88-aec7-d54823f68c15','26e95cbe-b0f8-44dd-907f-72377303222d','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('f2067e15-bd50-436c-872d-5915ab7d08cf','adbfc441-5dc4-46db-8cbe-059d564822a9','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('f43776f5-ea4d-4105-9e0f-af0fa73da161','e776a32b-2b74-402d-a782-0c4fb6a97242','fd183f89-035e-11f1-94d2-507b9db621bd',15.00),
('f4560dbc-4105-4886-8e40-be9c2a75eb3a','507f20fa-89d4-4475-9cc5-145440eeb226','7d96767a-123b-4c62-bbbe-a8ca2a2d8b42',1.00),
('f4a041d7-97fd-4e5d-b0a0-cf80bfea1ad6','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('f4d464f4-813e-4e3d-bd95-4811616377a7','3c822f9f-4888-42d8-8092-371fc21279ed','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('f5f1b7db-077a-4b8f-a8ff-38f95cd46969','107b3aba-6698-4d72-a516-18ecfe631737','86fd48ab-3912-4c00-9921-72a1344ea08f',1.00),
('f60ae6ca-f05c-4b96-8819-0112cad938bb','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','7306e13b-035f-11f1-94d2-507b9db621bd',25.00),
('f60bade7-7c6d-43c0-9dbb-23fc2a0abdb4','e4097402-1fa5-4778-86e7-4ae206c42ee2','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('f669c6e1-1933-4719-a187-2d1ed29fb001','fa3785d1-1161-4107-a95c-48caef4c4757','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('f9877781-d9e4-42ad-b151-c20cb1c94dfe','08a6fc03-54a9-4148-be3f-ef68524f0ff0','ff0262ad-7c92-42e2-8f75-5df94ba13320',25.00),
('fa277ef2-d261-433c-ad25-4a417297b4e2','24975183-2e80-46de-94f3-50811ca17327','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('fb4e8fad-bb43-4a2e-ab18-825c00049576','74aea3c2-a311-4f64-bdab-698f16767910','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('fdebfd7b-e98f-4243-959e-0c560f1981bc','3c822f9f-4888-42d8-8092-371fc21279ed','fd183f89-035e-11f1-94d2-507b9db621bd',15.00);

/*Table structure for table `recipes` */

DROP TABLE IF EXISTS `recipes`;

CREATE TABLE `recipes` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `recipes` */

insert  into `recipes`(`id`,`product_id`) values 
('3d0bd13b-3526-4b56-a888-3cc89772d870','0d2c947d-aa24-4963-8936-12857b302ac8'),
('c43ea7a1-73f2-4873-b74d-327f570cf5cc','0f1e3a5b-ff17-49f9-997e-4dfa032c3bba'),
('3719a11e-c958-4650-96b8-eb06b3e5a6e8','1187b118-55dc-42fb-91a3-9aaf00a66151'),
('7fe83d8f-980f-4b33-a974-92c683379612','18db6fe8-b5f3-48d9-afe4-c8063748cb22'),
('e4097402-1fa5-4778-86e7-4ae206c42ee2','1b4956c6-a387-49e0-9848-2776637e7798'),
('fb07280c-a0a1-47a8-9a7d-fbc0f805e023','24d7a3c6-b650-423c-aed2-bc626d2379d3'),
('107b3aba-6698-4d72-a516-18ecfe631737','299c0233-89bb-4cb1-a74a-9e158615caf2'),
('26e95cbe-b0f8-44dd-907f-72377303222d','371edcce-3288-48d0-9d4a-7b5a2d2d505c'),
('37b268f4-e476-47cf-b1d7-2baf3fecc85a','47952bf9-0842-4f60-8fbc-ace32caec81e'),
('74aea3c2-a311-4f64-bdab-698f16767910','49658ab1-cb59-4ba4-befc-5ede5df581a6'),
('3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','4bf82d21-cb0f-436a-9d5b-13065bd0af42'),
('bf545366-6569-491e-afb0-0cd7c9baa113','4e9a77bc-f41d-4896-9686-afe0a037bdb0'),
('5a1e968d-b10c-4928-a9a6-7ce1d0e213a2','4ee47294-0c17-4371-b13f-493caf945d67'),
('6996c3c8-4ad4-4380-a78d-93c718b647f0','51b7bd4b-cbe5-4699-989e-826e5096c8fc'),
('24975183-2e80-46de-94f3-50811ca17327','536fd762-9e30-458d-b231-7a3eb41c3120'),
('21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','539f1d58-8fa9-4c6e-8981-b14726dc4c8e'),
('ab92e4f0-a435-47b7-8659-174d982162b8','60a1c563-5d02-4ab0-aad7-caf09de3a783'),
('750e0c03-015e-4cd1-892e-5cb6c91ab6e0','66790402-d047-462c-be40-e3ebd3fe8663'),
('dc1f9071-fc29-45af-bde9-d260826d96ed','69495623-4a4b-486e-ba3f-726b8a6c0a62'),
('02179074-10e2-4c08-a11f-d1ca526d5b32','701940af-137d-40b5-aeb4-7579c0b4ec87'),
('ed382d89-03f1-4aae-9643-83512a977f92','7031bb99-ef17-4bf2-b9a7-aac07572c398'),
('11c62233-58e9-4c6d-ba72-f804efc85a1a','7157f68f-7eef-4fe7-95f3-0dcf9865a25a'),
('2dce90da-adc7-48e0-bb40-60dfa8d05d9a','7544398d-4389-4349-8fa4-78733df4507e'),
('19918a4a-0db6-43d5-b82c-2ab39ee366c6','86b55866-5335-48e5-b416-a83dce5e8dff'),
('e776a32b-2b74-402d-a782-0c4fb6a97242','8dd052cd-4ee4-4577-a6b5-7f0b6e604714'),
('f39f9c2a-2dce-487e-b225-23fdc2154c39','980e0a85-9ac7-4ddf-9c32-790329fdc557'),
('3b395204-c1f9-4377-82a6-7f263b30d7af','9d260e69-a41b-45cd-bde3-e549ff7309a0'),
('1c52bda6-4b55-4550-9ac7-56b68cdd444d','9ea47c76-6bf2-43ce-9ca8-2a6a5a101f03'),
('f16d9fb7-daa5-4d0a-933f-d7218bc4b1a1','aeb8ad2b-5f19-401e-9f4f-15c7f84f9896'),
('57a88fb3-303c-4b29-97be-0f6eed9cb8ec','af01ff02-e3fa-4cfe-8d74-dd0825154689'),
('3c822f9f-4888-42d8-8092-371fc21279ed','af8a8ef7-ca26-405e-a817-4253e601a308'),
('f04c95f6-6412-4d92-abb7-192e46138725','b431300d-1fdf-4603-bd2e-6f2729f27d09'),
('e6d214df-fd0c-4bcb-9bdd-ca75bce1adc9','b716e3c0-3f42-4362-b850-4e0dd50ac621'),
('1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','b8d5e7c9-15b0-4753-886d-308719ecf758'),
('08a6fc03-54a9-4148-be3f-ef68524f0ff0','c343acf5-231f-406d-8611-d5e5b8fee4ac'),
('fa3785d1-1161-4107-a95c-48caef4c4757','c3c607c0-c180-40cd-8cdd-6e29d93dab32'),
('0a509d4d-fc23-414a-870b-d2a371c14244','c59a3a1d-1496-4b19-9502-4b0ec7847468'),
('adbfc441-5dc4-46db-8cbe-059d564822a9','ce288881-4422-4332-ac36-21c288f201e9'),
('97d7280e-db45-41c5-869a-1e9c63db3684','d838e456-a305-457d-b950-9e376586cb52'),
('74820eca-cbd3-4b2d-985d-82a390a5eca0','dafb7951-d6c5-44bd-8e9f-b74aecf49c85'),
('fdb88066-ced2-430d-b80f-a57c1f053ddb','e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3'),
('507f20fa-89d4-4475-9cc5-145440eeb226','e6cf5716-d64f-497c-b7a6-950cd346678f'),
('ea2e3454-97c3-4d00-8aef-4586e9889c75','e7884f47-8610-4230-9236-e9f92117654e'),
('acec6242-4c82-4bd2-b4ed-8ce18152cfdb','eda015a0-7989-4373-8269-0ec907d93de2'),
('59b69c4d-d758-4b03-8c31-d20968c10220','ee01eb78-ecf0-4cf8-9959-7dbf6f4cbd81'),
('33b449c8-236d-4b1d-bda8-6419d7d43eab','eefb20cf-2b98-4437-85e5-1d0d8810824b'),
('1afa6a2a-0983-4946-be88-82929eb8018b','f41c7c02-8151-4728-a436-d84a83bf8d8c'),
('46fb6074-f6ad-4400-a39d-0251ad6d2e73','f51c2588-7a47-4209-a196-14957452e165'),
('2a8a2734-26e1-444d-81a0-e6edae1164ca','fc594ec5-07e6-45d1-b642-114ab175379e'),
('9ed42d99-ebab-4f2a-a184-4a48042c7ee3','fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce'),
('cdfa4653-6340-4ce8-aeb9-ebed51848703','fdfaea5f-db57-4cee-a23b-9af7e288c9ab');

/*Table structure for table `sales` */

DROP TABLE IF EXISTS `sales`;

CREATE TABLE `sales` (
  `id` varchar(36) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer_name` varchar(255) DEFAULT NULL,
  `payment_status` enum('PAID','PENDING') DEFAULT 'PAID',
  `creator_id` varchar(36) DEFAULT NULL,
  `qris_exchange` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `sales` */

/*Table structure for table `sales_items` */

DROP TABLE IF EXISTS `sales_items`;

CREATE TABLE `sales_items` (
  `id` varchar(36) NOT NULL,
  `sales_id` varchar(36) DEFAULT NULL,
  `product_id` varchar(36) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_id` (`sales_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sales_items_ibfk_1` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `sales_items` */

/*Table structure for table `settings` */

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `key_name` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `settings` */

insert  into `settings`(`key_name`,`value`) values 
('default_print','OFF'),
('shift_1_end','17:00'),
('shift_1_start','06:00'),
('shift_2_end','03:00'),
('show_shutdown','OFF'),
('virtual_keyboard','OFF');

/*Table structure for table `stock_movements` */

DROP TABLE IF EXISTS `stock_movements`;

CREATE TABLE `stock_movements` (
  `id` varchar(36) NOT NULL,
  `raw_material_id` varchar(36) DEFAULT NULL,
  `type` enum('IN','OUT','ADJUST') NOT NULL,
  `qty` decimal(10,2) NOT NULL,
  `reference_id` varchar(36) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `raw_material_id` (`raw_material_id`),
  CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `stock_movements` */

/*Table structure for table `stock_opnames` */

DROP TABLE IF EXISTS `stock_opnames`;

CREATE TABLE `stock_opnames` (
  `id` varchar(36) NOT NULL,
  `raw_material_id` varchar(36) DEFAULT NULL,
  `system_stock` decimal(10,2) NOT NULL,
  `physical_stock` decimal(10,2) NOT NULL,
  `difference` decimal(10,2) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `raw_material_id` (`raw_material_id`),
  CONSTRAINT `stock_opnames_ibfk_1` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `stock_opnames` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `pin` varchar(10) NOT NULL,
  `role` enum('ADMIN','KASIR','OWNER') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rate_per_minute` decimal(10,2) DEFAULT 250.00,
  `allow_off_schedule` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`pin`,`role`,`created_at`,`rate_per_minute`,`allow_off_schedule`) values 
('e06b542b-05f6-11f1-9a18-507b9db621bd','Atjas','1221','ADMIN','2026-02-10 03:35:31',250.00,0),
('e06b62e5-05f6-11f1-9a18-507b9db621bd','Andi','1111','KASIR','2026-02-10 03:35:31',250.00,0),
('e06b63f6-05f6-11f1-9a18-507b9db621bd','Cipa','2222','KASIR','2026-02-10 03:35:31',150.00,0),
('e06b6490-05f6-11f1-9a18-507b9db621bd','Arya','3333','KASIR','2026-02-10 03:35:31',150.00,0),
('e06b6521-05f6-11f1-9a18-507b9db621bd','Tamy','4444','KASIR','2026-02-10 03:35:31',150.00,1),
('e78057ba-0bdd-11f1-8cab-08979871e6ef','fila','5555','KASIR','2026-02-17 15:51:52',150.00,0);

/*Table structure for table `void_logs` */

DROP TABLE IF EXISTS `void_logs`;

CREATE TABLE `void_logs` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `void_logs` */

/*Table structure for table `warehouse_stock` */

DROP TABLE IF EXISTS `warehouse_stock`;

CREATE TABLE `warehouse_stock` (
  `id` varchar(36) NOT NULL,
  `raw_material_id` varchar(36) DEFAULT NULL,
  `stock` decimal(10,2) DEFAULT 0.00,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `raw_material_id` (`raw_material_id`),
  CONSTRAINT `warehouse_stock_ibfk_1` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `warehouse_stock` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
