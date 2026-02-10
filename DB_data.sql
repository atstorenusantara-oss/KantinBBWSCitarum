/*
SQLyog Community v13.2.0 (64 bit)
MySQL - 10.4.28-MariaDB : Database - gcoffee_pos
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`gcoffee_pos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `gcoffee_pos`;

/*Table structure for table `attendance` */

DROP TABLE IF EXISTS `attendance`;

CREATE TABLE `attendance` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `clock_in` timestamp NOT NULL DEFAULT current_timestamp(),
  `clock_out` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `attendance` */

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=8200 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `bms_logs` */

/*Table structure for table `product_recipes` */

DROP TABLE IF EXISTS `product_recipes`;

CREATE TABLE `product_recipes` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `material_id` varchar(36) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `product_recipes` */

insert  into `product_recipes`(`id`,`product_id`,`material_id`,`quantity`,`created_at`) values 
('02e0a010-a677-4e31-a9bc-132b59fdaec3','0f1e3a5b-ff17-49f9-997e-4dfa032c3bba','c10464fc-e0bc-45ea-b720-f8cead11d263',18.00,'2026-02-10 04:04:56'),
('1bc1a6f6-3308-48c3-8410-e95c1f84273f','1187b118-55dc-42fb-91a3-9aaf00a66151','a7a99075-19f6-481c-893e-f8d3ec0fa140',150.00,'2026-02-10 04:23:45');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `stock` decimal(10,2) DEFAULT 0.00,
  `min_stock` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `raw_materials` */

insert  into `raw_materials`(`id`,`name`,`unit`,`stock`,`min_stock`,`created_at`) values 
('0c139446-dae8-4173-b865-68f0254e22f6','Creamer Bubuk','gram',412.00,1000.00,'2026-02-10 02:37:58'),
('7306a061-035f-11f1-94d2-507b9db621bd','Syrup Caramel','ml',1500.00,200.00,'2026-02-06 20:26:31'),
('7306e09a-035f-11f1-94d2-507b9db621bd','Vanilla Powder','gram',500.00,100.00,'2026-02-06 20:26:31'),
('7306e13b-035f-11f1-94d2-507b9db621bd','Sirup strawberry','ml',1000.00,100.00,'2026-02-06 20:26:31'),
('7306e1ce-035f-11f1-94d2-507b9db621bd','Sirup Buterscoth','ml',500.00,100.00,'2026-02-06 20:26:31'),
('7306e245-035f-11f1-94d2-507b9db621bd','Sirup Pandan Late','ml',500.00,100.00,'2026-02-06 20:26:31'),
('7d96767a-123b-4c62-bbbe-a8ca2a2d8b42','Cup Kertas','pcs',1000.00,0.00,'2026-02-06 14:57:19'),
('81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','Susu Kental Manis','ml',8800.00,200.00,'2026-02-06 02:41:56'),
('86fd48ab-3912-4c00-9921-72a1344ea08f','Cup Plastik','pcs',1000.00,0.00,'2026-02-06 14:57:19'),
('9d34503c-56ee-4ddf-a61f-43f837157dca','Matcha (Bubuk)','gram',1000.00,150.00,'2026-02-06 11:50:11'),
('a5724b15-1ae9-4837-b76f-e625c211a96f','Thai Tea (Bubuk)','gram',1000.00,150.00,'2026-02-06 11:50:11'),
('a7a99075-19f6-481c-893e-f8d3ec0fa140','Susu UHT','ml',600.00,1000.00,'2026-02-06 02:41:56'),
('c10464fc-e0bc-45ea-b720-f8cead11d263','Biji Kopi','gram',50.00,200.00,'2026-02-06 02:41:56'),
('d52b4710-be7e-4b48-bdd0-7a69c9c02c42','Coklat (Bubuk)','gram',68.00,100.00,'2026-02-06 11:50:11'),
('fd183f89-035e-11f1-94d2-507b9db621bd','Gula Aren Cair','gram',2000.00,100.00,'2026-02-06 20:23:13'),
('ff0262ad-7c92-42e2-8f75-5df94ba13320','Lemon Tea (Bubuk)','gram',1000.00,50.00,'2026-02-06 11:50:11');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `recipe_details` */

insert  into `recipe_details`(`id`,`recipe_id`,`raw_material_id`,`qty`) values 
('01a54a37-a787-4f1f-8cdd-8e1ec2f90908','fa3785d1-1161-4107-a95c-48caef4c4757','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('02a50897-0aa3-412a-8bf9-1ac1858cc25b','19918a4a-0db6-43d5-b82c-2ab39ee366c6','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('034659e4-da8f-4909-9896-fc9102c87a38','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('0a699ef5-08cc-4d9d-a99f-01bcd5a5258a','107b3aba-6698-4d72-a516-18ecfe631737','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('0d6b3025-d4c0-431e-9839-1409301dc5f7','fdb88066-ced2-430d-b80f-a57c1f053ddb','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('0e2c371b-7488-476d-be0d-b05e8912f605','24975183-2e80-46de-94f3-50811ca17327','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('0ec8525d-c8e0-4679-a6bf-69f0cde7c237','ea2e3454-97c3-4d00-8aef-4586e9889c75','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('10dadc9e-7146-4254-bf6c-d00a9e829d9a','26e95cbe-b0f8-44dd-907f-72377303222d','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('1144c939-ae14-4cd8-bf63-16ef1ebf7351','f04c95f6-6412-4d92-abb7-192e46138725','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('1734a319-32c1-4103-af1f-da5c7ba2ebe2','f04c95f6-6412-4d92-abb7-192e46138725','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('182ee751-2fff-4fa3-a975-6c56da3cb88f','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('186dbb0c-b4eb-4577-b171-58e2ab362181','cdfa4653-6340-4ce8-aeb9-ebed51848703','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('1b836ff3-c599-4272-80dd-1c1cf68e062a','1c52bda6-4b55-4550-9ac7-56b68cdd444d','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('1f6c4971-e16e-40d7-b51c-e5c914ec2f4f','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('1f9cf32d-1fce-4827-af82-2731e549b9ed','107b3aba-6698-4d72-a516-18ecfe631737','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('21b3fb16-caf1-46d3-9134-71ec8ccb114f','ab92e4f0-a435-47b7-8659-174d982162b8','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('222faf38-6304-4232-bd88-a77440a37c33','6996c3c8-4ad4-4380-a78d-93c718b647f0','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('25168f4e-e9df-4922-b7d8-1e557302426f','3d0bd13b-3526-4b56-a888-3cc89772d870','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('2526d29a-e566-4b44-8758-ad84b0c1a2ad','11c62233-58e9-4c6d-ba72-f804efc85a1a','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('25e9c838-aaf6-4005-baec-00dfae70ec4c','e776a32b-2b74-402d-a782-0c4fb6a97242','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('26f82dc6-1544-4b76-91b3-2e0b8e961803','f39f9c2a-2dce-487e-b225-23fdc2154c39','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('2ae7765b-c93b-4a08-8e81-487f899c9b5a','bf545366-6569-491e-afb0-0cd7c9baa113','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('34f6be46-bd7f-4af1-b155-de5663cf968f','fdb88066-ced2-430d-b80f-a57c1f053ddb','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('3acb42e4-4a36-4eed-bb42-ef2e61b77004','37b268f4-e476-47cf-b1d7-2baf3fecc85a','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('3bf5f166-d16c-4b24-8cdc-e272fad337b6','dc1f9071-fc29-45af-bde9-d260826d96ed','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('3d152779-5d9a-4546-a025-484c85c4ee82','107b3aba-6698-4d72-a516-18ecfe631737','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('43723589-590d-4c64-b4d2-d2c906018cb9','24975183-2e80-46de-94f3-50811ca17327','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('43d10fab-8f6d-462d-b9d8-e952942fd73a','3d0bd13b-3526-4b56-a888-3cc89772d870','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('459d47ec-f20c-4a38-a553-3aa3c47c0447','bf545366-6569-491e-afb0-0cd7c9baa113','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('45de2f15-75fc-4555-835f-4258d0453abd','3d0bd13b-3526-4b56-a888-3cc89772d870','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('4921a18c-4357-4b66-9f4d-06742acbfe1f','507f20fa-89d4-4475-9cc5-145440eeb226','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('4cf5620a-7a6d-4d49-a862-17d6022be77c','3c822f9f-4888-42d8-8092-371fc21279ed','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('4d01164c-e0e1-42d8-9d21-6e3423fe6d2c','1c52bda6-4b55-4550-9ac7-56b68cdd444d','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('4d7d0d7b-3e8d-4bfe-b13f-6f29c8f5d036','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('500bc478-18f0-4ef5-a209-206f32413c8a','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('510ca1b5-2d68-4d29-be0f-af68fb9a747d','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('550d3fcc-ab8a-4dca-89cf-144a7fa563a4','74aea3c2-a311-4f64-bdab-698f16767910','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('5642f40f-c6a5-450f-9c03-2e232d547f52','0a509d4d-fc23-414a-870b-d2a371c14244','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('5d094cca-8a7c-4662-92e7-6aa5aeb4a0a2','1c52bda6-4b55-4550-9ac7-56b68cdd444d','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('67f4bda9-b394-419a-9b33-9c89d3a1184f','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('6a790c25-370d-4e09-86cd-9f2c4341dd7a','cdfa4653-6340-4ce8-aeb9-ebed51848703','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('6e248243-2578-49ae-b7ac-23f54d2a8983','74aea3c2-a311-4f64-bdab-698f16767910','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('70bbb31c-696c-419f-b98e-54d50cb10190','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('71ca31d2-9250-4210-a02b-2d873a3bfa6a','33b449c8-236d-4b1d-bda8-6419d7d43eab','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('7276314b-a210-40bf-b7d3-ebc805862432','19918a4a-0db6-43d5-b82c-2ab39ee366c6','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('74575d4a-88b1-4808-a34f-1c42a3e13908','19918a4a-0db6-43d5-b82c-2ab39ee366c6','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('7511dcb3-b7fa-40a9-883e-ca94dbfb646d','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('7a224770-25ee-4cc8-a7b4-6d899c78f91b','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('7a5e400d-2540-4e24-adff-510b82a41c93','6996c3c8-4ad4-4380-a78d-93c718b647f0','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('7b4da1c7-77bf-4434-a1e8-10cb9a452ec0','11c62233-58e9-4c6d-ba72-f804efc85a1a','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('7b700d03-3460-43d9-afe2-ceee8443eb06','02179074-10e2-4c08-a11f-d1ca526d5b32','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('7b725a95-fa34-4001-a392-a85041f0790c','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('7d9ca3ec-1254-4939-9ffc-da3e35c1d501','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('7da563ca-2022-4a81-b198-0df6c413db0b','3c822f9f-4888-42d8-8092-371fc21279ed','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('7dc3aa0c-a0a5-43fc-bea4-09720b5c84ef','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('7e61e117-ebf8-47ce-828b-5173b30bc2b8','e4097402-1fa5-4778-86e7-4ae206c42ee2','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('7e79b53f-3a8d-4db0-b56d-110bf6c17fdd','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('80ede4be-a977-496e-b858-0090c00d67c0','fdb88066-ced2-430d-b80f-a57c1f053ddb','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('81c92acb-1db8-4e2b-ab6d-9445a2322e6f','e776a32b-2b74-402d-a782-0c4fb6a97242','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('820f3d76-eb62-47ad-bb37-33cfbc4cef84','507f20fa-89d4-4475-9cc5-145440eeb226','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('82f23684-06d8-4561-a07e-68c6ba0c5455','f39f9c2a-2dce-487e-b225-23fdc2154c39','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('8445383f-d530-4735-9ee2-b83ff7d9b186','33b449c8-236d-4b1d-bda8-6419d7d43eab','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('887b3cdd-5031-4b1e-919d-b3a928ba4c8d','e776a32b-2b74-402d-a782-0c4fb6a97242','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('8b469476-2901-48b6-bd09-e39988a88718','f39f9c2a-2dce-487e-b225-23fdc2154c39','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('8ba02e30-e203-4630-9670-da681ab9c950','6996c3c8-4ad4-4380-a78d-93c718b647f0','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('90c51adb-9b47-4af6-a3b7-c8cc847302db','3c822f9f-4888-42d8-8092-371fc21279ed','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('9244536b-c87b-4b1c-9c3d-deb66b8400f4','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('927fad7a-d598-463b-9dfc-381ce7c4106c','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('948d57ce-1e30-451f-880c-2aaaccea4e6e','74820eca-cbd3-4b2d-985d-82a390a5eca0','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('9eba9c61-c75e-41c9-908c-28e7709321f3','0a509d4d-fc23-414a-870b-d2a371c14244','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('9f4ca7c2-88f8-4a5a-baf3-2d8463a63da3','507f20fa-89d4-4475-9cc5-145440eeb226','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('a226140a-c413-4841-8578-342614ee4214','37b268f4-e476-47cf-b1d7-2baf3fecc85a','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('a9440fce-0336-4668-bca2-096f58e8e27d','74820eca-cbd3-4b2d-985d-82a390a5eca0','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('a9fea1f9-bf93-4a16-a548-a765584e7de9','02179074-10e2-4c08-a11f-d1ca526d5b32','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('ab139abe-7271-4a53-b2b8-06384e6097ed','fb07280c-a0a1-47a8-9a7d-fbc0f805e023','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('acd4e0c3-28e7-4633-beed-ea178210759b','acec6242-4c82-4bd2-b4ed-8ce18152cfdb','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b1352866-327a-43bf-a176-d7d8f69235b2','11c62233-58e9-4c6d-ba72-f804efc85a1a','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('b2f12626-ebbf-408d-8d03-1affcb8508e0','f04c95f6-6412-4d92-abb7-192e46138725','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('b38d99f1-69d6-4c2b-aa2d-a298aca9c425','0a509d4d-fc23-414a-870b-d2a371c14244','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b6021151-8393-4f24-b521-b698b5ec9d6a','750e0c03-015e-4cd1-892e-5cb6c91ab6e0','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b6e105f1-d751-4fe8-ab74-be0ee95b2151','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b7a459f7-35bd-413f-813d-42e4f9f7f367','ea2e3454-97c3-4d00-8aef-4586e9889c75','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('b88b1464-0935-44c2-a45b-0c5408c135e9','21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('bb2b8772-65d8-4d24-8224-2a72fc05893d','37b268f4-e476-47cf-b1d7-2baf3fecc85a','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('bc0787ac-71e7-4739-96ae-d86c63966175','dc1f9071-fc29-45af-bde9-d260826d96ed','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('bfa65695-efd9-45fa-8e5b-17ea99442d53','e4097402-1fa5-4778-86e7-4ae206c42ee2','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('c4ad33cc-6321-4083-b4c7-259e84777395','cdfa4653-6340-4ce8-aeb9-ebed51848703','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('c59c5a32-aea9-484b-85dd-bfabd97413fe','2dce90da-adc7-48e0-bb40-60dfa8d05d9a','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('d131f7bc-893d-4c01-9203-1b38b970cce2','26e95cbe-b0f8-44dd-907f-72377303222d','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('d4e1dbb9-dcf3-4b40-8bcb-2323d42245fb','74820eca-cbd3-4b2d-985d-82a390a5eca0','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('d77e21d0-8239-4460-bcef-9502e8bfcc6d','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('db535399-cf44-42df-9179-0746559087ae','bf545366-6569-491e-afb0-0cd7c9baa113','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('dccf12f7-d5fa-42ef-a340-8067423876c6','57a88fb3-303c-4b29-97be-0f6eed9cb8ec','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('df123f99-a2c7-49fc-bc3e-e3699d9a020b','dc1f9071-fc29-45af-bde9-d260826d96ed','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('e04a4119-5e0c-4ecf-a9f5-fe6402dd1a92','33b449c8-236d-4b1d-bda8-6419d7d43eab','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('e355891d-6d5e-4fd2-bdb3-e3254bcc7f2d','fa3785d1-1161-4107-a95c-48caef4c4757','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('e467e8d9-5097-44e2-8e23-9c3126a15187','ab92e4f0-a435-47b7-8659-174d982162b8','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('eb852a2f-afc4-467a-a9d5-01dc538211e4','02179074-10e2-4c08-a11f-d1ca526d5b32','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('ef97c076-ec04-4033-b84f-35936e148996','ab92e4f0-a435-47b7-8659-174d982162b8','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('f044c743-789c-49f4-a8cd-bfb2a6ac3ced','3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('f160bf6a-1c26-4c82-ab8a-209660b38ec5','74aea3c2-a311-4f64-bdab-698f16767910','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('f202bb85-4904-4a88-aec7-d54823f68c15','26e95cbe-b0f8-44dd-907f-72377303222d','0c139446-dae8-4173-b865-68f0254e22f6',12.00),
('f3112782-a79e-444b-a997-7aa8526e7e70','9ed42d99-ebab-4f2a-a184-4a48042c7ee3','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('f4a041d7-97fd-4e5d-b0a0-cf80bfea1ad6','1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('f60bade7-7c6d-43c0-9dbb-23fc2a0abdb4','e4097402-1fa5-4778-86e7-4ae206c42ee2','a7a99075-19f6-481c-893e-f8d3ec0fa140',100.00),
('f669c6e1-1933-4719-a187-2d1ed29fb001','fa3785d1-1161-4107-a95c-48caef4c4757','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('fa277ef2-d261-433c-ad25-4a417297b4e2','24975183-2e80-46de-94f3-50811ca17327','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00),
('fb69ba20-6b52-497a-9ae3-5d01f16437e0','ea2e3454-97c3-4d00-8aef-4586e9889c75','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691',25.00);

/*Table structure for table `recipes` */

DROP TABLE IF EXISTS `recipes`;

CREATE TABLE `recipes` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `recipes` */

insert  into `recipes`(`id`,`product_id`) values 
('3d0bd13b-3526-4b56-a888-3cc89772d870','0d2c947d-aa24-4963-8936-12857b302ac8'),
('e4097402-1fa5-4778-86e7-4ae206c42ee2','1b4956c6-a387-49e0-9848-2776637e7798'),
('fb07280c-a0a1-47a8-9a7d-fbc0f805e023','24d7a3c6-b650-423c-aed2-bc626d2379d3'),
('107b3aba-6698-4d72-a516-18ecfe631737','299c0233-89bb-4cb1-a74a-9e158615caf2'),
('26e95cbe-b0f8-44dd-907f-72377303222d','371edcce-3288-48d0-9d4a-7b5a2d2d505c'),
('37b268f4-e476-47cf-b1d7-2baf3fecc85a','47952bf9-0842-4f60-8fbc-ace32caec81e'),
('74aea3c2-a311-4f64-bdab-698f16767910','49658ab1-cb59-4ba4-befc-5ede5df581a6'),
('3346a719-46b3-48aa-8fe3-abfa7f2ebfd1','4bf82d21-cb0f-436a-9d5b-13065bd0af42'),
('bf545366-6569-491e-afb0-0cd7c9baa113','4e9a77bc-f41d-4896-9686-afe0a037bdb0'),
('6996c3c8-4ad4-4380-a78d-93c718b647f0','51b7bd4b-cbe5-4699-989e-826e5096c8fc'),
('24975183-2e80-46de-94f3-50811ca17327','536fd762-9e30-458d-b231-7a3eb41c3120'),
('21d2d707-6fa5-4b3c-a0b6-ce193b88d84b','539f1d58-8fa9-4c6e-8981-b14726dc4c8e'),
('ab92e4f0-a435-47b7-8659-174d982162b8','60a1c563-5d02-4ab0-aad7-caf09de3a783'),
('750e0c03-015e-4cd1-892e-5cb6c91ab6e0','66790402-d047-462c-be40-e3ebd3fe8663'),
('dc1f9071-fc29-45af-bde9-d260826d96ed','69495623-4a4b-486e-ba3f-726b8a6c0a62'),
('02179074-10e2-4c08-a11f-d1ca526d5b32','701940af-137d-40b5-aeb4-7579c0b4ec87'),
('11c62233-58e9-4c6d-ba72-f804efc85a1a','7157f68f-7eef-4fe7-95f3-0dcf9865a25a'),
('2dce90da-adc7-48e0-bb40-60dfa8d05d9a','7544398d-4389-4349-8fa4-78733df4507e'),
('19918a4a-0db6-43d5-b82c-2ab39ee366c6','86b55866-5335-48e5-b416-a83dce5e8dff'),
('e776a32b-2b74-402d-a782-0c4fb6a97242','8dd052cd-4ee4-4577-a6b5-7f0b6e604714'),
('f39f9c2a-2dce-487e-b225-23fdc2154c39','980e0a85-9ac7-4ddf-9c32-790329fdc557'),
('1c52bda6-4b55-4550-9ac7-56b68cdd444d','9ea47c76-6bf2-43ce-9ca8-2a6a5a101f03'),
('57a88fb3-303c-4b29-97be-0f6eed9cb8ec','af01ff02-e3fa-4cfe-8d74-dd0825154689'),
('3c822f9f-4888-42d8-8092-371fc21279ed','af8a8ef7-ca26-405e-a817-4253e601a308'),
('f04c95f6-6412-4d92-abb7-192e46138725','b431300d-1fdf-4603-bd2e-6f2729f27d09'),
('1ea1305b-b66a-44d5-978c-ba5ef6a5e74b','b8d5e7c9-15b0-4753-886d-308719ecf758'),
('fa3785d1-1161-4107-a95c-48caef4c4757','c3c607c0-c180-40cd-8cdd-6e29d93dab32'),
('0a509d4d-fc23-414a-870b-d2a371c14244','c59a3a1d-1496-4b19-9502-4b0ec7847468'),
('74820eca-cbd3-4b2d-985d-82a390a5eca0','dafb7951-d6c5-44bd-8e9f-b74aecf49c85'),
('fdb88066-ced2-430d-b80f-a57c1f053ddb','e1c3ae9f-db7e-4ef7-a269-97c9069fd2a3'),
('507f20fa-89d4-4475-9cc5-145440eeb226','e6cf5716-d64f-497c-b7a6-950cd346678f'),
('ea2e3454-97c3-4d00-8aef-4586e9889c75','e7884f47-8610-4230-9236-e9f92117654e'),
('acec6242-4c82-4bd2-b4ed-8ce18152cfdb','eda015a0-7989-4373-8269-0ec907d93de2'),
('33b449c8-236d-4b1d-bda8-6419d7d43eab','eefb20cf-2b98-4437-85e5-1d0d8810824b'),
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `sales` */

insert  into `sales`(`id`,`invoice_number`,`total`,`payment_method`,`created_at`,`customer_name`,`payment_status`,`creator_id`) values 
('2604514e-4edb-490c-9c85-a00472cee31d','INV-1770712702539',42000.00,'CASH','2026-02-10 15:38:22','Kasir: Atjas','PAID',NULL),
('357fe0b7-5820-4347-928c-c9b1d8fb1e8c','INV-1770712512750',13000.00,'CASH','2026-02-10 15:35:12','Kasir: Andi','PAID',NULL),
('9cd0b558-c8d3-4550-a281-7f2c56640ea9','INV-1770712774654',44000.00,'CASH','2026-02-10 15:39:34','joiyz','PENDING',NULL),
('fc54bbac-e0ac-4aaa-ba4b-e979218142af','INV-1770712381742',28000.00,'QRIS','2026-02-10 15:33:01','joiy','PAID',NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `sales_items` */

insert  into `sales_items`(`id`,`sales_id`,`product_id`,`qty`,`price`) values 
('233688c2-9988-416a-b103-21f81d7f0eea','2604514e-4edb-490c-9c85-a00472cee31d','299c0233-89bb-4cb1-a74a-9e158615caf2',2,16000.00),
('36f33abd-7cad-44d4-9a1e-da32d96cedc1','357fe0b7-5820-4347-928c-c9b1d8fb1e8c','77c1c69f-05e9-11f1-9a18-507b9db621bd',1,13000.00),
('4cd6e237-03a6-4e5c-b7e4-b47035482f93','9cd0b558-c8d3-4550-a281-7f2c56640ea9','4ae6f38c-dbcc-4604-8ba9-64bc63ce088f',1,13000.00),
('53037853-c4b1-4718-8d52-b70658fce14c','fc54bbac-e0ac-4aaa-ba4b-e979218142af','77c1c69f-05e9-11f1-9a18-507b9db621bd',1,13000.00),
('c4e92a94-c6a6-401d-8a4c-4d3a2d39b355','9cd0b558-c8d3-4550-a281-7f2c56640ea9','371edcce-3288-48d0-9d4a-7b5a2d2d505c',1,15000.00),
('f432992b-70a7-4cc0-b91e-563e446577fc','fc54bbac-e0ac-4aaa-ba4b-e979218142af','69495623-4a4b-486e-ba3f-726b8a6c0a62',1,15000.00),
('fe1956c5-55c8-4e69-936f-3487f67680ab','2604514e-4edb-490c-9c85-a00472cee31d','aeb8ad2b-5f19-401e-9f4f-15c7f84f9896',1,10000.00),
('ffe3192c-5112-4f81-9ff7-ca05f5ae3123','9cd0b558-c8d3-4550-a281-7f2c56640ea9','fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce',1,16000.00);

/*Table structure for table `settings` */

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `key_name` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `settings` */

insert  into `settings`(`key_name`,`value`) values 
('shift_1_end','17:00'),
('shift_1_start','06:00'),
('shift_2_end','03:00');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `stock_movements` */

insert  into `stock_movements`(`id`,`raw_material_id`,`type`,`qty`,`reference_id`,`note`,`created_at`) values 
('0066647f-e0b5-4ff3-bd2c-123fd2483808','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'d0b3b235-93e3-48be-a253-88c0d15e7274','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 15:15:12'),
('00ca553b-fb06-4e23-9438-a3cb434afa6b','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'57b3f5b4-e0d4-425a-9b84-a9582ee32197','Sale of product 66790402-d047-462c-be40-e3ebd3fe8663','2026-02-10 03:42:41'),
('00dfb02e-380f-4121-92cc-7d6a12a84a66','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'fc54bbac-e0ac-4aaa-ba4b-e979218142af','Sale of product 69495623-4a4b-486e-ba3f-726b8a6c0a62','2026-02-10 15:33:01'),
('0262fae9-fc02-4ddc-9d30-5e782fa3f4dc','0c139446-dae8-4173-b865-68f0254e22f6','OUT',24.00,'f6a0f5ef-f894-47f8-ab72-4a91ea6e8d16','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 03:44:06'),
('09d0924e-de3e-41fd-8221-877dc23ae201','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',225.00,'a3fbe114-70ba-4f6f-9e00-4386ac30aaa5','Sale of product 69495623-4a4b-486e-ba3f-726b8a6c0a62','2026-02-10 04:35:32'),
('0d16b3cf-aec9-4091-adb6-1f5f6e16ae3a','c10464fc-e0bc-45ea-b720-f8cead11d263','ADJUST',950.00,'5334db33-3b3a-43aa-befe-e881e73eb9c5','Opname Adjustment: ','2026-02-10 04:16:46'),
('0f129b26-1f37-4d6f-9337-09619e239661','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'754d6e2d-a184-4bcc-b257-9b52c1a617c8','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 03:05:52'),
('0f9b3ae9-1536-4982-bf2e-04962d8a2a25','0c139446-dae8-4173-b865-68f0254e22f6','ADJUST',1000.00,'25a81423-b846-4bc1-882c-ef337fb65997','Opname Adjustment: ka atjas','2026-02-10 02:39:01'),
('0ff813f6-c9f5-46fe-bd21-e21d8bce0117','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'57b3f5b4-e0d4-425a-9b84-a9582ee32197','Sale of product 66790402-d047-462c-be40-e3ebd3fe8663','2026-02-10 03:42:41'),
('12bc23ff-5dd8-4e1f-a3fc-b41a7a1877f7','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'caec1c38-cfe8-494d-9dcd-78084cd77b53','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 13:47:30'),
('13344e86-5acb-4dad-b574-e1f32e8ee15b','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',5000.00,NULL,'Simulasi Anomali Stok','2026-02-10 04:23:45'),
('17928e08-60bd-4938-a0e1-6b4ea00d64f8','0c139446-dae8-4173-b865-68f0254e22f6','OUT',120.00,'64731526-43ca-416e-96b5-9a51bb73a491','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 04:10:33'),
('1811dfb8-4868-4001-a791-286cd70b4c58','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'57b3f5b4-e0d4-425a-9b84-a9582ee32197','Sale of product 66790402-d047-462c-be40-e3ebd3fe8663','2026-02-10 03:42:41'),
('18398fe6-3ed0-42a9-b3ea-635868e38ba7','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',150.00,'0b20f9cc-afdc-4748-9699-c5b3841e8d68','Sale of product b431300d-1fdf-4603-bd2e-6f2729f27d09','2026-02-10 04:16:16'),
('19c1b19e-a582-4e67-a17f-38c548957356','a7a99075-19f6-481c-893e-f8d3ec0fa140','ADJUST',3300.00,'d1f43281-d39f-4ebe-86f5-3da01d08e114','Opname Adjustment: atjas','2026-02-10 15:38:11'),
('1ddce681-4770-4ffa-8dc7-6f990aa64556','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',200.00,'2604514e-4edb-490c-9c85-a00472cee31d','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 15:38:22'),
('1df2a2c5-d419-445f-9aa2-178a70f498d8','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'2b4902c3-52a7-449d-bbc3-567fb0278522','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 14:01:10'),
('1f85576e-7182-4265-8341-4391c2245bb1','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'0b20f9cc-afdc-4748-9699-c5b3841e8d68','Sale of product 539f1d58-8fa9-4c6e-8981-b14726dc4c8e','2026-02-10 04:16:16'),
('20722863-8f06-46ca-801f-ccdaec2e627d','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'dd382e01-4da0-4b24-a8a9-355d308a8dcc','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 13:45:03'),
('207b7409-d6b4-4cd7-8383-3a425547d49c','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product 8dd052cd-4ee4-4577-a6b5-7f0b6e604714','2026-02-10 03:33:45'),
('21a279f0-178b-4501-9975-2d5b97c9724b','0c139446-dae8-4173-b865-68f0254e22f6','OUT',24.00,'2604514e-4edb-490c-9c85-a00472cee31d','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 15:38:22'),
('265b58b6-d3fd-4fe4-82b0-c5286fb22771','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'391434a6-d415-4bc4-98c2-388b33923e26','Sale of product b431300d-1fdf-4603-bd2e-6f2729f27d09','2026-02-10 13:09:07'),
('2dbd88f6-d13f-4c92-981b-27d0270c4282','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'dd382e01-4da0-4b24-a8a9-355d308a8dcc','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 13:45:03'),
('33ff2b49-5506-44f0-9d6a-09f1a032f058','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 03:33:45'),
('36bd9d0e-30f2-4f6d-82ad-20f647318161','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'e48f40f6-ab8c-46e4-86ad-7369e80c8918','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 02:39:13'),
('3d2246be-2555-4206-a50d-9e7cbfcdda90','0c139446-dae8-4173-b865-68f0254e22f6','OUT',72.00,'0b20f9cc-afdc-4748-9699-c5b3841e8d68','Sale of product b431300d-1fdf-4603-bd2e-6f2729f27d09','2026-02-10 04:16:16'),
('3d418220-4984-4bd7-9726-e72d22051b5f','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'754d6e2d-a184-4bcc-b257-9b52c1a617c8','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 03:05:52'),
('3f7c1d6a-a74c-4396-9f38-4747327d6178','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product e7884f47-8610-4230-9236-e9f92117654e','2026-02-10 03:33:45'),
('41891f94-79de-45dc-bafe-de41f6e27466','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 03:33:45'),
('4dd5404f-517f-4a14-a6b8-b41add428d2f','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product 8dd052cd-4ee4-4577-a6b5-7f0b6e604714','2026-02-10 03:33:45'),
('4e40c806-9d61-4af5-85f4-9d14197e7280','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'9cd0b558-c8d3-4550-a281-7f2c56640ea9','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 15:39:34'),
('4e71b440-5d28-4b43-86b9-a9f1c283396e','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'9cd0b558-c8d3-4550-a281-7f2c56640ea9','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 15:39:48'),
('4fa12427-8338-449e-8c11-22b247588334','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'cf52c0da-246a-4dc4-a31b-e2607aab62dd','Sale of product 47952bf9-0842-4f60-8fbc-ace32caec81e','2026-02-10 14:57:28'),
('4fca268f-9141-4804-ad83-ffffb8aa83bb','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'56349555-9ed8-49bc-9bbd-ffe588706f2f','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 14:04:39'),
('57ee8ea1-e9de-4b67-8579-d8b0a51ce29a','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'2b4902c3-52a7-449d-bbc3-567fb0278522','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 14:01:10'),
('5cc82145-c1cd-4905-8c87-baf300519091','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'caec1c38-cfe8-494d-9dcd-78084cd77b53','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 13:47:30'),
('5d6434bb-c0a0-46f3-bc98-ea47c84dadd8','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'caec1c38-cfe8-494d-9dcd-78084cd77b53','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 13:47:30'),
('5efae51c-c03c-499c-95c7-3f810b5ce056','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'9cd0b558-c8d3-4550-a281-7f2c56640ea9','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 15:39:34'),
('621a368c-74aa-49d8-ab55-0a2b6e5c4e3d','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'391434a6-d415-4bc4-98c2-388b33923e26','Sale of product b431300d-1fdf-4603-bd2e-6f2729f27d09','2026-02-10 13:09:07'),
('673eedec-75c7-4baa-bcc4-69f0ae331095','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'cf52c0da-246a-4dc4-a31b-e2607aab62dd','Sale of product 47952bf9-0842-4f60-8fbc-ace32caec81e','2026-02-10 14:57:28'),
('6840d3f8-f3bc-48d3-b115-ae9da9bfdcb7','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',600.00,'0b20f9cc-afdc-4748-9699-c5b3841e8d68','Sale of product b431300d-1fdf-4603-bd2e-6f2729f27d09','2026-02-10 04:16:16'),
('6c20d66f-9353-4bfb-bd8b-807181fb8504','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'0b20f9cc-afdc-4748-9699-c5b3841e8d68','Sale of product 539f1d58-8fa9-4c6e-8981-b14726dc4c8e','2026-02-10 04:16:16'),
('7271f09c-56c0-4ad8-8a5f-49f840bdff16','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',200.00,'f6a0f5ef-f894-47f8-ab72-4a91ea6e8d16','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 03:44:06'),
('746e963c-b176-4bad-a233-08d813539950','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'d0b3b235-93e3-48be-a253-88c0d15e7274','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 15:15:12'),
('774c64bb-3ecd-4548-810c-0cdfecace1db','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'56349555-9ed8-49bc-9bbd-ffe588706f2f','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 14:04:39'),
('7852ca12-cfa5-46fd-899b-111fbe729764','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'cf52c0da-246a-4dc4-a31b-e2607aab62dd','Sale of product 47952bf9-0842-4f60-8fbc-ace32caec81e','2026-02-10 14:57:28'),
('7a5dcd47-d45b-40fd-81cf-a7e77d5b07eb','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'e48f40f6-ab8c-46e4-86ad-7369e80c8918','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 02:39:13'),
('7c3ff840-95da-4139-8f66-43551aa32c93','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product e7884f47-8610-4230-9236-e9f92117654e','2026-02-10 03:33:45'),
('7d3e7dc9-66e0-4d80-a8d6-8c5dd6b47303','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',900.00,'a3fbe114-70ba-4f6f-9e00-4386ac30aaa5','Sale of product 69495623-4a4b-486e-ba3f-726b8a6c0a62','2026-02-10 04:35:32'),
('7ddfbc73-2fe4-4512-a531-f8a975393f5b','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'754d6e2d-a184-4bcc-b257-9b52c1a617c8','Sale of product e7884f47-8610-4230-9236-e9f92117654e','2026-02-10 03:05:52'),
('840ea610-b2f1-4f81-a455-69190d183431','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'391434a6-d415-4bc4-98c2-388b33923e26','Sale of product b431300d-1fdf-4603-bd2e-6f2729f27d09','2026-02-10 13:09:07'),
('86dcb0ba-8ac1-47da-802d-482634db3667','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'57b3f5b4-e0d4-425a-9b84-a9582ee32197','Sale of product 1b4956c6-a387-49e0-9848-2776637e7798','2026-02-10 03:42:41'),
('88b2c7f9-aa54-465d-a0b7-42f885ef5cfe','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',250.00,'64731526-43ca-416e-96b5-9a51bb73a491','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 04:10:33'),
('8955d967-faa4-4543-961f-fc8fae0dcdc7','0c139446-dae8-4173-b865-68f0254e22f6','OUT',108.00,'a3fbe114-70ba-4f6f-9e00-4386ac30aaa5','Sale of product 69495623-4a4b-486e-ba3f-726b8a6c0a62','2026-02-10 04:35:32'),
('8cc67b67-bed8-45f4-8ae2-677448f85305','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'fc54bbac-e0ac-4aaa-ba4b-e979218142af','Sale of product 69495623-4a4b-486e-ba3f-726b8a6c0a62','2026-02-10 15:33:01'),
('92ba5123-90e4-4083-a8da-81bce4476e24','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'9cd0b558-c8d3-4550-a281-7f2c56640ea9','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 15:39:34'),
('97c97f30-fc0f-40af-bfe7-5f07b3ef9315','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product 8dd052cd-4ee4-4577-a6b5-7f0b6e604714','2026-02-10 03:33:45'),
('a37cd882-b24a-43a8-8466-d37322b8b533','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'d0b3b235-93e3-48be-a253-88c0d15e7274','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 15:15:12'),
('a4f93b8b-29c7-48c8-a31b-b954cff999d1','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'f70d3d31-58f9-4ce9-9bff-5903f535a958','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 14:57:18'),
('ae58b460-a979-4a4b-a745-d7dc33a9548f','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'f70d3d31-58f9-4ce9-9bff-5903f535a958','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 14:57:18'),
('ae94f358-1d61-4568-a7fe-7de4c2441011','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'dd382e01-4da0-4b24-a8a9-355d308a8dcc','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 13:45:03'),
('b3d20a64-4c0a-4183-ad16-1a0d41018288','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'56349555-9ed8-49bc-9bbd-ffe588706f2f','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 14:04:39'),
('b652868a-8f3f-4eac-859f-d12fa030ad3f','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'754d6e2d-a184-4bcc-b257-9b52c1a617c8','Sale of product e7884f47-8610-4230-9236-e9f92117654e','2026-02-10 03:05:52'),
('b6d2bbe5-08bb-4413-ac2c-f8c89c28d61e','d52b4710-be7e-4b48-bdd0-7a69c9c02c42','ADJUST',932.00,'697c67dc-6057-4e0e-85a6-166fe654cc64','Opname Adjustment: ','2026-02-10 04:35:52'),
('b712f019-5cf6-4212-9fee-9a4535e71551','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'f70d3d31-58f9-4ce9-9bff-5903f535a958','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 14:57:18'),
('b777cab3-4a1c-40ca-b16e-b5178987d0b7','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'9cd0b558-c8d3-4550-a281-7f2c56640ea9','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 15:39:48'),
('c7456c70-cb04-4dcd-a5b7-d12a73ae7ff3','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'0b20f9cc-afdc-4748-9699-c5b3841e8d68','Sale of product 539f1d58-8fa9-4c6e-8981-b14726dc4c8e','2026-02-10 04:16:16'),
('cd14cc3f-1426-49c3-8963-95dc733b0954','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'57b3f5b4-e0d4-425a-9b84-a9582ee32197','Sale of product 1b4956c6-a387-49e0-9848-2776637e7798','2026-02-10 03:42:41'),
('cd4a3aea-a4c9-4f70-9624-ad3665cc7d44','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'754d6e2d-a184-4bcc-b257-9b52c1a617c8','Sale of product e7884f47-8610-4230-9236-e9f92117654e','2026-02-10 03:05:52'),
('dd696fb8-91a7-4a32-bb5e-b5ec3e557393','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'57b3f5b4-e0d4-425a-9b84-a9582ee32197','Sale of product 1b4956c6-a387-49e0-9848-2776637e7798','2026-02-10 03:42:41'),
('dfc0c127-593d-4e71-8e9a-ae773550977a','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',50.00,'2604514e-4edb-490c-9c85-a00472cee31d','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 15:38:22'),
('dfea9f22-3b15-4a28-926f-ff89612897d3','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'2b4902c3-52a7-449d-bbc3-567fb0278522','Sale of product 299c0233-89bb-4cb1-a74a-9e158615caf2','2026-02-10 14:01:10'),
('e197fdae-ea4e-4433-a912-f2a325e1f27c','7306e13b-035f-11f1-94d2-507b9db621bd','ADJUST',500.00,'dcbdb3dd-e8d6-49c3-a1f0-cbcd74a52c93','Opname Adjustment: ','2026-02-10 02:27:48'),
('e54ed891-7545-4073-bdad-0a14fa5615cd','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',50.00,'f6a0f5ef-f894-47f8-ab72-4a91ea6e8d16','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 03:44:06'),
('e5cc6fb8-432d-41a5-8388-aa970bf8b958','c10464fc-e0bc-45ea-b720-f8cead11d263','ADJUST',288.00,'413da140-f390-402f-acc9-ba2a0cc8810e','Opname Adjustment: ','2026-02-10 02:43:37'),
('e9f16732-ac3a-4dae-85a7-46d5bb6f9ebd','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product e7884f47-8610-4230-9236-e9f92117654e','2026-02-10 03:33:45'),
('ed95efc7-1cc1-40e6-82cd-8cd1ce0e1177','81bdf4d1-e3b0-48d7-95dc-63a6f37d5691','OUT',25.00,'754d6e2d-a184-4bcc-b257-9b52c1a617c8','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 03:05:52'),
('f4287d13-a287-40d8-a998-9bf6d4d658a7','a7a99075-19f6-481c-893e-f8d3ec0fa140','ADJUST',200.00,'038072ee-360f-4e81-bf7d-13245391de4a','Opname Adjustment: ','2026-02-10 04:10:48'),
('f7a73b54-6e1b-4dc4-a1b1-742bb2fd1fc6','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',1000.00,'64731526-43ca-416e-96b5-9a51bb73a491','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 04:10:33'),
('fa968161-1274-44bd-8545-c45735ad7611','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'fc54bbac-e0ac-4aaa-ba4b-e979218142af','Sale of product 69495623-4a4b-486e-ba3f-726b8a6c0a62','2026-02-10 15:33:01'),
('fd2860ed-7d4b-479e-9582-9f6e32e763f6','0c139446-dae8-4173-b865-68f0254e22f6','OUT',12.00,'9cd0b558-c8d3-4550-a281-7f2c56640ea9','Sale of product 371edcce-3288-48d0-9d4a-7b5a2d2d505c','2026-02-10 15:39:48'),
('fee88326-d6a8-4b8a-8070-200fe5813364','a7a99075-19f6-481c-893e-f8d3ec0fa140','OUT',100.00,'3a473beb-6c06-45ef-9c63-54f0c3dc0c81','Sale of product fc6c2f3b-0b8b-48b3-9538-8125fa6c26ce','2026-02-10 03:33:45');

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
  PRIMARY KEY (`id`),
  KEY `raw_material_id` (`raw_material_id`),
  CONSTRAINT `stock_opnames_ibfk_1` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `stock_opnames` */

insert  into `stock_opnames`(`id`,`raw_material_id`,`system_stock`,`physical_stock`,`difference`,`note`,`created_at`) values 
('038072ee-360f-4e81-bf7d-13245391de4a','a7a99075-19f6-481c-893e-f8d3ec0fa140',0.00,200.00,200.00,'','2026-02-10 04:10:48'),
('25a81423-b846-4bc1-882c-ef337fb65997','0c139446-dae8-4173-b865-68f0254e22f6',0.00,1000.00,1000.00,'ka atjas','2026-02-10 02:39:01'),
('413da140-f390-402f-acc9-ba2a0cc8810e','c10464fc-e0bc-45ea-b720-f8cead11d263',712.00,1000.00,288.00,'','2026-02-10 02:43:37'),
('5334db33-3b3a-43aa-befe-e881e73eb9c5','c10464fc-e0bc-45ea-b720-f8cead11d263',1000.00,50.00,-950.00,'','2026-02-10 04:16:46'),
('697c67dc-6057-4e0e-85a6-166fe654cc64','d52b4710-be7e-4b48-bdd0-7a69c9c02c42',1000.00,68.00,-932.00,'','2026-02-10 04:35:51'),
('d1f43281-d39f-4ebe-86f5-3da01d08e114','a7a99075-19f6-481c-893e-f8d3ec0fa140',-2300.00,1000.00,3300.00,'atjas','2026-02-10 15:38:11'),
('dcbdb3dd-e8d6-49c3-a1f0-cbcd74a52c93','7306e13b-035f-11f1-94d2-507b9db621bd',500.00,1000.00,500.00,'','2026-02-10 02:27:48');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `pin` varchar(10) NOT NULL,
  `role` enum('ADMIN','KASIR') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`pin`,`role`,`created_at`) values 
('e06b542b-05f6-11f1-9a18-507b9db621bd','Atjas','1221','ADMIN','2026-02-10 03:35:31'),
('e06b62e5-05f6-11f1-9a18-507b9db621bd','Andi','1111','KASIR','2026-02-10 03:35:31'),
('e06b63f6-05f6-11f1-9a18-507b9db621bd','Cipa','2222','KASIR','2026-02-10 03:35:31'),
('e06b6490-05f6-11f1-9a18-507b9db621bd','Arya','3333','KASIR','2026-02-10 03:35:31'),
('e06b6521-05f6-11f1-9a18-507b9db621bd','Tamy','4444','KASIR','2026-02-10 03:35:31');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `void_logs` */

insert  into `void_logs`(`id`,`user_id`,`product_name`,`price`,`reason`,`created_at`) values 
('10651c93-fbfb-485b-95b4-59cdd5bf0430','e06b62e5-05f6-11f1-9a18-507b9db621bd','Vanilla Latte (Panas)',16000.00,'Salah Input','2026-02-10 14:44:23'),
('20c991dc-812f-41dc-b4f4-35dc4a684d85','e06b62e5-05f6-11f1-9a18-507b9db621bd','Matcha Latte (Dingin)',16000.00,'Salah Input','2026-02-10 14:47:03'),
('273b3a9f-d9e2-47ea-9f64-1623a2689a2e','e06b542b-05f6-11f1-9a18-507b9db621bd','Coklat (Dingin)',15000.00,'Salah Input','2026-02-10 15:39:21'),
('3948fc98-8609-4ad5-bbe1-ca3742d1ee6f','e06b62e5-05f6-11f1-9a18-507b9db621bd','Vanilla Latte (Dingin)',16000.00,'Salah Input','2026-02-10 14:42:48'),
('3bc01289-2b42-4b11-8d2c-b2a17a9cc2dc','e06b62e5-05f6-11f1-9a18-507b9db621bd','Butterscotch (Dingin)',16000.00,'Salah Input','2026-02-10 14:44:29'),
('401ddd18-f413-4e05-9ade-35b1e57e3a8b','e06b62e5-05f6-11f1-9a18-507b9db621bd','Kopi Susu (Panas)',15000.00,'Salah Input','2026-02-10 14:38:48'),
('48e3aeec-cab8-4869-9f78-25286765981c','e06b62e5-05f6-11f1-9a18-507b9db621bd','Americano (Dingin)',10000.00,'Salah Input','2026-02-10 14:39:35'),
('50303f29-1555-4ae2-9829-546c68157921','e06b62e5-05f6-11f1-9a18-507b9db621bd','Lemon Tea (Dingin)',8000.00,'Salah Input','2026-02-10 14:37:40'),
('50843de3-1842-4118-8a32-84d7ea08a69b','e06b62e5-05f6-11f1-9a18-507b9db621bd','Vanilla Latte (Panas)',16000.00,'Salah Input','2026-02-10 14:42:44'),
('5ee204f0-0924-40dc-a451-0d79211271f4','e06b62e5-05f6-11f1-9a18-507b9db621bd','Lemon Tea (Panas)',8000.00,'Salah Input','2026-02-10 14:37:43'),
('667c5729-c029-441f-ab25-b96a54dc1c0a','e06b62e5-05f6-11f1-9a18-507b9db621bd','Red Velvet Creamy (Panas)',25000.00,'Salah Input','2026-02-10 03:39:35'),
('737091e5-d2d4-41fb-bc13-f587e5f18c08','14088033-05f5-11f1-9a18-507b9db621bd','Butterscotch (Panas)',25000.00,'Salah Input','2026-02-10 03:31:50'),
('7a2e4829-f41f-4a29-82c6-9cc8058d26a3','e06b62e5-05f6-11f1-9a18-507b9db621bd','Coklat (Dingin)',15000.00,'Produk Habis/Reject','2026-02-10 03:52:42'),
('7d563fa9-8a1e-484f-a1ff-579eb2a4f70c','e06b62e5-05f6-11f1-9a18-507b9db621bd','Hazelnut Latte (Dingin)',29000.00,'Salah Input','2026-02-10 03:37:30'),
('812ba8a3-9252-46b7-891a-280b2014474d','e06b62e5-05f6-11f1-9a18-507b9db621bd','Matcha Latte (Panas)',16000.00,'Pelanggan Batal','2026-02-10 15:37:00'),
('83d4ab49-eaf0-4650-9e11-d7a4c036432c','e06b62e5-05f6-11f1-9a18-507b9db621bd','Matcha Latte (Panas)',16000.00,'Salah Input','2026-02-10 14:46:43'),
('9c7815c5-ff93-4d21-8dab-ec2961283c14','e06b62e5-05f6-11f1-9a18-507b9db621bd','Red Velvet Creamy (Dingin)',25000.00,'Salah Input','2026-02-10 03:53:06'),
('a911e023-64d7-4c42-a86b-6367bb07658b','e06b62e5-05f6-11f1-9a18-507b9db621bd','Butterscotch (Panas)',16000.00,'Salah Input','2026-02-10 14:44:32'),
('b42c6e3d-0e4d-4df0-8f0a-43e2aecb3398','e06b62e5-05f6-11f1-9a18-507b9db621bd','Americano (Panas)',10000.00,'Salah Input','2026-02-10 14:39:32'),
('baf64abb-3251-421c-9fcb-e0d4a8b65479','e06b62e5-05f6-11f1-9a18-507b9db621bd','Red Velvet Creamy (Dingin)',25000.00,'Salah Input','2026-02-10 03:52:59'),
('d4375f2d-7153-4a62-8137-a598ad6c2126','e06b62e5-05f6-11f1-9a18-507b9db621bd','Vanilla Latte (Dingin)',16000.00,'Salah Input','2026-02-10 14:44:26'),
('ef840f25-e208-4059-981f-24ab720ae84b','e06b62e5-05f6-11f1-9a18-507b9db621bd','Kopi Susu (Dingin)',15000.00,'Salah Input','2026-02-10 14:38:45');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
