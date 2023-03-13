-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para semtinel
CREATE DATABASE IF NOT EXISTS `semtinel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `semtinel`;

-- Volcando estructura para tabla semtinel.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.failed_jobs: ~0 rows (aproximadamente)

-- Volcando estructura para tabla semtinel.logistics_receipts
CREATE TABLE IF NOT EXISTS `logistics_receipts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID del registro',
  `origin` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Origen',
  `document_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Tipo de documento',
  `document_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Número de documento',
  `oc` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Orden de compra',
  `created_at` datetime DEFAULT NULL COMMENT 'Fecha de creación',
  `updated_at` datetime DEFAULT NULL COMMENT 'Fecha de modificación',
  `created_by` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Creado por el usuario',
  `updated_by` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Modificado por el usuario',
  `pole` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Polo',
  `project` int DEFAULT NULL COMMENT 'Proyecto',
  `warehouse` int DEFAULT NULL COMMENT 'Pañol',
  `warehouse_owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Responsable de pañol',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Comentario',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Estado de la entrada',
  `attach_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Documento adjunto escaneado',
  `confirm` int DEFAULT NULL COMMENT 'Entrada confirmada',
  `cancel` int DEFAULT NULL COMMENT 'Entrada cancelada',
  `cancel_by` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.logistics_receipts: ~4 rows (aproximadamente)
INSERT INTO `logistics_receipts` (`id`, `origin`, `document_type`, `document_number`, `oc`, `created_at`, `updated_at`, `created_by`, `updated_by`, `pole`, `project`, `warehouse`, `warehouse_owner`, `comment`, `status`, `attach_path`, `confirm`, `cancel`, `cancel_by`) VALUES
	(12, 'Tiro Directo Altec', NULL, '112233', 'ROCAN2-0039', '2023-02-06 21:30:37', '2023-02-10 14:54:41', 'tony@nauta.cu', 'tony@nauta.cu', 'HZHV', 1, 3, 'Diego Machado', NULL, 'parcial', NULL, NULL, 1, 'tony@nauta.cu'),
	(13, 'Despacho de Almacen', 'Orden de Despacho', '00885', NULL, '2023-02-07 02:06:12', '2023-02-13 19:12:41', 'tony@nauta.cu', 'tony@nauta.cu', 'HZHV', 1, 3, 'Diego Machado', NULL, 'total', 'uploads/METROP_OUT_00885.pdf', 1, NULL, NULL),
	(14, 'Tiro Directo Altec', NULL, '123456', 'ROCAN2-0039', '2023-02-10 14:46:00', '2023-02-10 14:49:43', 'tony@nauta.cu', 'tony@nauta.cu', 'HZHV', 1, 3, 'Diego Machado', NULL, 'parcial', 'uploads/123456.pdf', 1, NULL, NULL),
	(15, 'Despacho de Almacen', 'Orden de Despacho', '00885', NULL, '2023-02-10 16:23:10', '2023-02-10 16:25:40', 'tony@nauta.cu', 'tony@nauta.cu', 'HZHV', 1, 2, 'Yadira López', 'Enseñándole a Ale', 'total', 'uploads/METROP_OUT_00885.pdf', 1, NULL, NULL),
	(16, 'Tiro Directo Almest', NULL, '123456', 'ROCAN2-0039', '2023-02-13 19:08:11', '2023-02-13 19:12:11', 'tony@nauta.cu', 'tony@nauta.cu', 'HZHV', 1, 3, 'Diego Machado', NULL, 'parcial', 'uploads/123456.pdf', NULL, 1, 'tony@nauta.cu');

-- Volcando estructura para tabla semtinel.logistics_receipt_items_dispatch
CREATE TABLE IF NOT EXISTS `logistics_receipt_items_dispatch` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_receipt` int DEFAULT NULL,
  `odoo_id_stock_move` int DEFAULT NULL,
  `odoo_id_stock_picking` int DEFAULT NULL,
  `product_code` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `docnum` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `um` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_quantity` decimal(8,3) DEFAULT NULL,
  `received_quantity` decimal(8,3) DEFAULT NULL,
  `stowage_card` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price_unit` decimal(8,2) DEFAULT NULL,
  `price_total` decimal(8,2) DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.logistics_receipt_items_dispatch: ~1 rows (aproximadamente)
INSERT INTO `logistics_receipt_items_dispatch` (`id`, `id_receipt`, `odoo_id_stock_move`, `odoo_id_stock_picking`, `product_code`, `docnum`, `item_description`, `um`, `product_quantity`, `received_quantity`, `stowage_card`, `price_unit`, `price_total`, `comment`, `created_at`, `updated_at`) VALUES
	(7, 13, 427957, 50152, 'EQU-9579', 'METROP/OUT/00885', '[EQU-9579] Convertidor de frecuencia a doble coque e imantación permanente R112 TRIFASICO Entrada 400 Volts 60 Hz y la transforma en 46 Volts 240 Hz N. 3 tomas de corriente (salidas). Intensidad 54 A - Armazon protector', 'UNIDAD', 10.000, 10.000, '123456', 743.66, 7436.65, NULL, '2023-02-07 02:06:13', '2023-02-07 02:06:13'),
	(8, 15, 427957, 50152, 'EQU-9579', 'METROP/OUT/00885', '[EQU-9579] Convertidor de frecuencia a doble coque e imantación permanente R112 TRIFASICO Entrada 400 Volts 60 Hz y la transforma en 46 Volts 240 Hz N. 3 tomas de corriente (salidas). Intensidad 54 A - Armazon protector', 'UNIDAD', 10.000, 10.000, '12345', 743.66, 7436.65, NULL, '2023-02-10 16:23:10', '2023-02-10 16:23:10');

-- Volcando estructura para tabla semtinel.logistics_receipt_items_oc
CREATE TABLE IF NOT EXISTS `logistics_receipt_items_oc` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID del registro',
  `id_receipt` int DEFAULT NULL COMMENT 'ID de la recepción',
  `odoo_id_order_line` int DEFAULT NULL COMMENT 'ID del item en la tabla order_line',
  `odoo_id_order` int DEFAULT NULL COMMENT 'ID de la orden de compra',
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Código del producto padre',
  `product_description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Descripción del producto padre',
  `item_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Descripción del renglón',
  `um` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Unidad de medida',
  `received_quantity` decimal(8,3) DEFAULT NULL COMMENT 'Cantidad recibida',
  `stowage_card` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Tarjeta de estiba',
  `price_unit` decimal(8,6) DEFAULT NULL COMMENT 'Precio unitario',
  `price_total` decimal(8,2) DEFAULT NULL COMMENT 'Precio total',
  `sequence` decimal(8,2) DEFAULT NULL COMMENT 'Orden de aparición en el listado',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Comentario',
  `created_at` datetime DEFAULT NULL COMMENT 'Fecha de creación',
  `updated_at` datetime DEFAULT NULL COMMENT 'Fecha de modificación',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.logistics_receipt_items_oc: ~8 rows (aproximadamente)
INSERT INTO `logistics_receipt_items_oc` (`id`, `id_receipt`, `odoo_id_order_line`, `odoo_id_order`, `product_code`, `product_description`, `item_description`, `um`, `received_quantity`, `stowage_card`, `price_unit`, `price_total`, `sequence`, `comment`, `created_at`, `updated_at`) VALUES
	(10, 12, 200876, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 900 mm', 'UNIDAD', 1.000, '123', 47.412400, 47.41, 1.00, NULL, '2023-02-06 21:30:37', '2023-02-06 21:30:37'),
	(11, 12, 200878, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 750 mm', 'UNIDAD', 2.000, '345', 47.412400, 94.82, 2.00, NULL, '2023-02-06 21:30:37', '2023-02-06 21:30:37'),
	(12, 12, 200879, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 700 mm', 'UNIDAD', 3.000, '789', 47.412400, 142.24, 3.00, NULL, '2023-02-06 21:30:37', '2023-02-06 21:30:37'),
	(13, 14, 200876, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 900 mm', 'UNIDAD', 2.000, '12345', 47.412400, 94.82, 1.00, NULL, '2023-02-10 14:46:00', '2023-02-10 14:46:00'),
	(14, 14, 200878, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 750 mm', 'UNIDAD', 8.000, '6789', 47.412400, 379.30, 2.00, NULL, '2023-02-10 14:46:00', '2023-02-10 14:46:00'),
	(15, 14, 200879, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 700 mm', 'UNIDAD', 5.000, '34567', 47.412400, 237.06, 3.00, NULL, '2023-02-10 14:46:00', '2023-02-10 14:46:00'),
	(16, 16, 200876, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 900 mm', 'UNIDAD', 10.000, '12345', 47.412400, 474.12, 1.00, NULL, '2023-02-13 19:08:11', '2023-02-13 19:08:11'),
	(17, 16, 200878, 21929, 'ACA-4612', 'Placa acero inoxidable AISI 316/A4 pulido de 500x900x0,8 mm', 'PLACA DE ACERO INOXIDABLE. CALIDAD AISI 316L/A4 PULIDO. DE 0,8 x 500 x 750 mm', 'UNIDAD', 5.000, '5687', 47.412400, 237.06, 2.00, NULL, '2023-02-13 19:08:11', '2023-02-13 19:08:11');

-- Volcando estructura para tabla semtinel.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.migrations: ~0 rows (aproximadamente)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(2, '2014_10_12_100000_create_password_resets_table', 1),
	(3, '2019_08_19_000000_create_failed_jobs_table', 1),
	(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(5, '2014_10_12_000000_create_users_table', 2),
	(6, '2023_01_05_195844_create_permission_tables', 3);

-- Volcando estructura para tabla semtinel.model_has_permissions
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.model_has_permissions: ~0 rows (aproximadamente)

-- Volcando estructura para tabla semtinel.model_has_roles
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.model_has_roles: ~0 rows (aproximadamente)

-- Volcando estructura para tabla semtinel.password_resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.password_resets: ~0 rows (aproximadamente)

-- Volcando estructura para tabla semtinel.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.permissions: ~5 rows (aproximadamente)
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'app', 'web', '2023-01-05 20:53:39', '2023-01-05 20:53:42'),
	(2, 'app.web.admin', 'web', '2023-01-05 20:54:36', '2023-01-08 03:09:46'),
	(3, 'app.web.logistics', 'web', '2023-01-05 20:55:11', '2023-01-08 03:10:14'),
	(4, 'app.api.odoo.get.entry', 'web', '2023-01-08 03:00:39', '2023-01-08 03:09:21');

-- Volcando estructura para tabla semtinel.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=381 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.personal_access_tokens: ~326 rows (aproximadamente)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', 1, 'auth_token', 'cbff7c993fcd099719e5cd47bf500d8ee055733fbf7a0a85108ee3246f76d884', '["*"]', NULL, NULL, '2023-01-04 09:44:40', '2023-01-04 09:44:40'),
	(2, 'App\\Models\\User', 1, 'auth_token', 'bd25c5332bfcee9f979c393876161db66a032850f43b127b1475cc3071dcbfb5', '["*"]', '2023-02-14 00:01:01', NULL, '2023-01-04 09:59:12', '2023-02-14 00:01:01'),
	(3, 'App\\Models\\User', 1, 'auth_token', '5984f6eae443f6b1431d942b06dd668bafe4604ddf69483ce087e714cafc03c3', '["*"]', NULL, NULL, '2023-01-04 10:16:35', '2023-01-04 10:16:35'),
	(4, 'App\\Models\\User', 1, 'auth_token', '2d581308ea84dfbb89db712a2a4a6e316a26eb8ee29e6c2c3a9dda14bb4478b7', '["*"]', NULL, NULL, '2023-01-04 10:18:36', '2023-01-04 10:18:36'),
	(5, 'App\\Models\\User', 1, 'auth_token', '5d0d8458de9bc8f13bafaca20a16e334bfb2504f1124c408ffa814489acee85b', '["*"]', NULL, NULL, '2023-01-04 10:19:29', '2023-01-04 10:19:29'),
	(6, 'App\\Models\\User', 1, 'auth_token', 'e7fb9741542e8b3f8bf58a02fd818720f1eda54277ec744c983ecca5df3383fe', '["*"]', NULL, NULL, '2023-01-04 10:24:30', '2023-01-04 10:24:30'),
	(7, 'App\\Models\\User', 1, 'auth_token', '3961e9e55fe6b1a216b23faae4fe0a1e884aa970d73af4c1e9490e2bd1225258', '["*"]', NULL, NULL, '2023-01-04 10:46:45', '2023-01-04 10:46:45'),
	(8, 'App\\Models\\User', 1, 'auth_token', 'e01f8c3285fc53b9b322f789168b78cc896f9a8da0dd45be1aa3886ccb0ec078', '["*"]', NULL, NULL, '2023-01-04 10:54:35', '2023-01-04 10:54:35'),
	(9, 'App\\Models\\User', 1, 'auth_token', '55c9b52851abf1f78f85c4f71087fd584ec2771fa9072ba8d48708ca7be47292', '["*"]', NULL, NULL, '2023-01-05 02:06:48', '2023-01-05 02:06:48'),
	(10, 'App\\Models\\User', 1, 'auth_token', '40348823ef6818153d9f0c7808cafafcf28c355881355fb819bbbdd1ce30e0b0', '["*"]', NULL, NULL, '2023-01-05 02:13:51', '2023-01-05 02:13:51'),
	(11, 'App\\Models\\User', 1, 'auth_token', '6fddf2e04e50ba945a7adbda005fd6fa10294b404cc7d9a80bdd0f3aa6ceb47d', '["*"]', NULL, NULL, '2023-01-05 02:30:10', '2023-01-05 02:30:10'),
	(12, 'App\\Models\\User', 1, 'auth_token', '8ace3fb8c9399e673c6bb883f0af388e1d99da925cba043273fd7dc8b74788fb', '["*"]', NULL, NULL, '2023-01-05 02:33:43', '2023-01-05 02:33:43'),
	(13, 'App\\Models\\User', 1, 'auth_token', '20ec8c6b0105eb2eb5b88dc387e67b740cf2aff05ccd38258bcc63c66b6ca0d3', '["*"]', NULL, NULL, '2023-01-05 02:36:54', '2023-01-05 02:36:54'),
	(14, 'App\\Models\\User', 1, 'auth_token', '854a63e59c1480ce3d5a11464fb8bb1effda8524d135b34d652dc354c3455e9e', '["*"]', NULL, NULL, '2023-01-05 03:24:24', '2023-01-05 03:24:24'),
	(15, 'App\\Models\\User', 1, 'auth_token', '19f939fa545a48b13e7db2aefeb1ba3cba44de17ba19771c1dd2cd05e41ff346', '["*"]', NULL, NULL, '2023-01-05 03:26:53', '2023-01-05 03:26:53'),
	(16, 'App\\Models\\User', 1, 'auth_token', '2c97609f6a90a03763a844dcb66623902b467bd130c79458fe98d274d2853ba5', '["*"]', NULL, NULL, '2023-01-05 03:31:05', '2023-01-05 03:31:05'),
	(17, 'App\\Models\\User', 1, 'auth_token', '72ed5eb7b86cad2fb0180714162207c563ca6864fc1e0635b08949a4ec981666', '["*"]', NULL, NULL, '2023-01-05 07:15:13', '2023-01-05 07:15:13'),
	(18, 'App\\Models\\User', 1, 'auth_token', '6243c717519e2a5b9a7460f2249c15c69a4438c6e5084a83a641079d3083a822', '["*"]', NULL, NULL, '2023-01-05 07:43:57', '2023-01-05 07:43:57'),
	(19, 'App\\Models\\User', 1, 'auth_token', 'ffbbe07d434b169fa765e3bceacef4d7a1a0ed8c44106220c8e0c0a146280298', '["*"]', NULL, NULL, '2023-01-05 07:49:44', '2023-01-05 07:49:44'),
	(20, 'App\\Models\\User', 1, 'auth_token', '3a12c25584dad671bacedaf330e7a7a9338be1bb2ecadbbee94c951146192dfd', '["*"]', NULL, NULL, '2023-01-05 08:06:58', '2023-01-05 08:06:58'),
	(21, 'App\\Models\\User', 1, 'auth_token', '36c6fbc2863389dbf13b0cba9a3b41ff4094bdefd257481fe4eddd997e3cfa26', '["*"]', NULL, NULL, '2023-01-05 08:08:34', '2023-01-05 08:08:34'),
	(22, 'App\\Models\\User', 1, 'auth_token', 'd83558e282822036993a98796b674fc502396405bf96f4c7451e866a8ec9615b', '["*"]', NULL, NULL, '2023-01-05 08:19:51', '2023-01-05 08:19:51'),
	(23, 'App\\Models\\User', 1, 'auth_token', '5c80ae81741117d0b1420a7aa7ff523199ebf69540d5a2c328a9aca9a9260c4d', '["*"]', NULL, NULL, '2023-01-05 08:24:51', '2023-01-05 08:24:51'),
	(24, 'App\\Models\\User', 1, 'auth_token', '6823e15babab2bf0ff0c29a10651af73839e7cf2b1e6ef9ad9c37f05136e2523', '["*"]', NULL, NULL, '2023-01-05 08:41:40', '2023-01-05 08:41:40'),
	(25, 'App\\Models\\User', 1, 'auth_token', '4ba57c1231f730a184059f1b16b6dcfecb68bda214e19d4feff3cf09733ce359', '["*"]', NULL, NULL, '2023-01-05 08:48:06', '2023-01-05 08:48:06'),
	(26, 'App\\Models\\User', 1, 'auth_token', '36bca392827f65dd81a88771dc9be32387bc1f7a4b6a7770d21e40477d37afd5', '["*"]', NULL, NULL, '2023-01-05 08:53:32', '2023-01-05 08:53:32'),
	(27, 'App\\Models\\User', 1, 'auth_token', '039a8065df93cfec662fd75ddf1319edb6b9ce5ee259cd73c865e4793126bfe8', '["*"]', NULL, NULL, '2023-01-05 08:55:28', '2023-01-05 08:55:28'),
	(28, 'App\\Models\\User', 1, 'auth_token', 'f22ea223e2854bfa8c2dae3fe27b7f0b41340a8b4e7e436fe6fb878a218aef48', '["*"]', NULL, NULL, '2023-01-05 09:20:37', '2023-01-05 09:20:37'),
	(29, 'App\\Models\\User', 1, 'auth_token', '02155d6df141a191d91e5e5ace98826ddf394058996d137f469634ad14a26805', '["*"]', NULL, NULL, '2023-01-05 10:03:25', '2023-01-05 10:03:25'),
	(30, 'App\\Models\\User', 1, 'auth_token', 'bc9078c9147c8ec03eb3b16ef282d51376c4886238bb3678307ae5fbae98f4cb', '["*"]', NULL, NULL, '2023-01-05 10:31:03', '2023-01-05 10:31:03'),
	(31, 'App\\Models\\User', 1, 'auth_token', '82f26bc272249d48704f857a38ec283342c88392ae968ad38ea545f2ab79efdc', '["*"]', NULL, NULL, '2023-01-05 21:35:07', '2023-01-05 21:35:07'),
	(32, 'App\\Models\\User', 1, 'auth_token', '9e8adb887f5c97a9f8bb15777d1457aca854b0d613c71fde44384d84df0e4d8b', '["*"]', NULL, NULL, '2023-01-05 21:48:00', '2023-01-05 21:48:00'),
	(33, 'App\\Models\\User', 1, 'auth_token', 'cefc224c49f97ba520fb4ebed9049189b4c795176b7c12e01c5e8b42169f1e4f', '["*"]', NULL, NULL, '2023-01-05 21:54:45', '2023-01-05 21:54:45'),
	(34, 'App\\Models\\User', 1, 'auth_token', '357ff6718c0498f03b636ed93c2a97822e317f140bac6a671236d4663d4499a8', '["*"]', NULL, NULL, '2023-01-06 03:09:44', '2023-01-06 03:09:44'),
	(35, 'App\\Models\\User', 1, 'auth_token', '91dddaceafac74b9e9871f53a80b9b88d1a6cf0ec5970af3b6d313a1812e912c', '["*"]', NULL, NULL, '2023-01-06 17:24:08', '2023-01-06 17:24:08'),
	(36, 'App\\Models\\User', 1, 'auth_token', '797014e38bb3375be24d6a3b8de040683ff3c7405abed5ff40281f8ce128beb2', '["*"]', NULL, NULL, '2023-01-06 17:26:19', '2023-01-06 17:26:19'),
	(37, 'App\\Models\\User', 1, 'auth_token', 'd3f552dab7bf941f75659eb8290664f389b1c5f169264dc263c866d3bbe983a1', '["*"]', NULL, NULL, '2023-01-06 18:16:11', '2023-01-06 18:16:11'),
	(38, 'App\\Models\\User', 1, 'auth_token', 'd17b41ca1b7f9872ac1082a19fd2731f1e45560a20786ac54b630bc964d9324a', '["*"]', NULL, NULL, '2023-01-06 18:16:46', '2023-01-06 18:16:46'),
	(39, 'App\\Models\\User', 1, 'auth_token', '2d232a8dfa47ad249bffc147e52ac0acfed7f1b8a19769abcb4dc55ed8f47f4e', '["*"]', NULL, NULL, '2023-01-06 18:22:21', '2023-01-06 18:22:21'),
	(40, 'App\\Models\\User', 1, 'auth_token', '28811ef687f899b595e7a9b4a270e73317a87ced658e50acea4696fdbfcb5a8e', '["*"]', NULL, NULL, '2023-01-06 18:32:15', '2023-01-06 18:32:15'),
	(41, 'App\\Models\\User', 1, 'auth_token', '31c6da47fd7e66375e332281d728e749c4ca76862f88abf6e2b1b95898a9b974', '["*"]', NULL, NULL, '2023-01-06 18:36:45', '2023-01-06 18:36:45'),
	(42, 'App\\Models\\User', 1, 'auth_token', 'b465061a1ce68eda5ceb6af448fdbd7ee89b9336c0234ec8fefbb6bdaaa9141e', '["*"]', NULL, NULL, '2023-01-06 18:37:48', '2023-01-06 18:37:48'),
	(43, 'App\\Models\\User', 1, 'auth_token', '796b7ae16ccd53c5ea958ef7867b93968872c0895627f74aede71b00ed6fec5b', '["*"]', NULL, NULL, '2023-01-06 19:39:48', '2023-01-06 19:39:48'),
	(44, 'App\\Models\\User', 1, 'auth_token', 'f7acb7049d7853b172a229dd694556216600c6fd96f421b0a07ee3be7ab8f6bd', '["*"]', NULL, NULL, '2023-01-06 21:04:45', '2023-01-06 21:04:45'),
	(45, 'App\\Models\\User', 1, 'auth_token', 'bfceefcd204e445002e7cbd044b978b437afa9382ad95406295c4b4a9cbc03f5', '["*"]', NULL, NULL, '2023-01-06 21:23:30', '2023-01-06 21:23:30'),
	(46, 'App\\Models\\User', 1, 'auth_token', '07bc8ed65d21a8d63d8fa6687294897ca456d53ba4f49fdfec620c5c2ca7ea89', '["*"]', '2023-01-07 00:02:33', NULL, '2023-01-06 23:22:49', '2023-01-07 00:02:33'),
	(47, 'App\\Models\\User', 1, 'auth_token', '5637c86cf398cab109301931fe5cf9c870b6cb650f79d483ed4a0b46560e227f', '["*"]', '2023-01-07 00:04:50', NULL, '2023-01-07 00:02:49', '2023-01-07 00:04:50'),
	(48, 'App\\Models\\User', 1, 'auth_token', 'f4d1b50509f979b868e07f7d8e65ee73a81e77966f4585cce4f702f9fa1b11f0', '["*"]', NULL, NULL, '2023-01-07 00:10:24', '2023-01-07 00:10:24'),
	(49, 'App\\Models\\User', 1, 'auth_token', '8e356d5ce24395c4c02fc048057a2691ee6b7a6df61e0eb6dde8420527849115', '["*"]', '2023-01-07 00:19:57', NULL, '2023-01-07 00:19:34', '2023-01-07 00:19:57'),
	(50, 'App\\Models\\User', 1, 'auth_token', 'ee6f13a2619adad1537054f91756d8fe1196998c085d6c960a51e3b4a5687e27', '["*"]', '2023-01-07 00:26:50', NULL, '2023-01-07 00:21:59', '2023-01-07 00:26:50'),
	(51, 'App\\Models\\User', 1, 'auth_token', '560eba7c898e0b98a2804fe24207c4a8694a5f69a3f392de5e0f26ad0d69bc1d', '["*"]', '2023-01-07 00:29:49', NULL, '2023-01-07 00:27:15', '2023-01-07 00:29:49'),
	(52, 'App\\Models\\User', 1, 'auth_token', '7e5265a74f9feaaaaa7e651f8825f8172702ec4c607468d2c9418e37f49d2b56', '["*"]', '2023-01-07 00:37:33', NULL, '2023-01-07 00:30:45', '2023-01-07 00:37:33'),
	(53, 'App\\Models\\User', 1, 'auth_token', '2e79b0b7c4cea043ff77714d39246aa94e95cc7759c1fe4f0f731a4ee2a91b69', '["*"]', '2023-01-07 00:38:25', NULL, '2023-01-07 00:38:11', '2023-01-07 00:38:25'),
	(54, 'App\\Models\\User', 1, 'auth_token', '30996075500b2b228c6e7347bf5017324b1fe91040a57a0647a17959b6d47b90', '["*"]', '2023-01-07 00:39:55', NULL, '2023-01-07 00:38:33', '2023-01-07 00:39:55'),
	(55, 'App\\Models\\User', 1, 'auth_token', 'cdabaf78e1f18cb25134076508005bef03dd5e6a28a13148546328a1c7ac3899', '["*"]', '2023-01-07 00:45:07', NULL, '2023-01-07 00:40:41', '2023-01-07 00:45:07'),
	(56, 'App\\Models\\User', 1, 'auth_token', 'ea89f755a2d2174c3e50f2a3d5449514425cfe3c4066d1aef1fec9b94e8dc147', '["*"]', '2023-01-07 00:46:27', NULL, '2023-01-07 00:45:21', '2023-01-07 00:46:27'),
	(57, 'App\\Models\\User', 1, 'auth_token', 'bbf679424d09f03181cf834827e9830dc098eb5cf238639137795358cd5898f6', '["*"]', '2023-01-07 00:49:41', NULL, '2023-01-07 00:49:29', '2023-01-07 00:49:41'),
	(58, 'App\\Models\\User', 1, 'auth_token', 'd451408f73fb0029fa7107bcb29067ba6ad29b8af42e648017e2f7ff6b535ab1', '["*"]', '2023-01-07 01:20:02', NULL, '2023-01-07 00:55:29', '2023-01-07 01:20:02'),
	(59, 'App\\Models\\User', 1, 'auth_token', '4abaea2c59f842d6c3df6ba98a84564e1ada2fb1612a49e11bd711f0ee16583a', '["*"]', '2023-01-07 01:24:59', NULL, '2023-01-07 01:24:16', '2023-01-07 01:24:59'),
	(60, 'App\\Models\\User', 1, 'auth_token', 'de5f2436c772b3c461ba0470512ccf79144ada7621b9ad4a254a87f62af175b4', '["*"]', '2023-01-07 01:26:37', NULL, '2023-01-07 01:26:21', '2023-01-07 01:26:37'),
	(61, 'App\\Models\\User', 1, 'auth_token', 'e5ae9488b6cf394460f2accdf38d2eac1766a8dcef078e1faffc0abcd98a1b12', '["*"]', '2023-01-07 01:28:54', NULL, '2023-01-07 01:28:36', '2023-01-07 01:28:54'),
	(62, 'App\\Models\\User', 1, 'auth_token', '594bc1463ad3d30187bbcc21d5d3be7337d24223b72271d22b4e77f11a20ef1a', '["*"]', '2023-01-07 01:31:23', NULL, '2023-01-07 01:30:57', '2023-01-07 01:31:23'),
	(63, 'App\\Models\\User', 1, 'auth_token', '1e66c03e6014dba4d003fe00ffd38276d0f0f01d315a8cdab0855a75efd93d5d', '["*"]', '2023-01-07 01:32:38', NULL, '2023-01-07 01:32:02', '2023-01-07 01:32:38'),
	(64, 'App\\Models\\User', 1, 'auth_token', '9b0a54c6e3d1219355c247d7e3df99ea64e200eab61846c9364222974199a807', '["*"]', '2023-01-07 01:33:09', NULL, '2023-01-07 01:32:52', '2023-01-07 01:33:09'),
	(65, 'App\\Models\\User', 1, 'auth_token', '4aca53e73accffb0255d5dfff3bc66d8859032ec29f65db07ed0c904e0c6f357', '["*"]', '2023-01-07 01:34:40', NULL, '2023-01-07 01:34:25', '2023-01-07 01:34:40'),
	(66, 'App\\Models\\User', 1, 'auth_token', 'd11ac166af68f6dee63a945534604d542ac3a28378e251dedcdbdb1ea297a580', '["*"]', '2023-01-07 01:42:15', NULL, '2023-01-07 01:37:58', '2023-01-07 01:42:15'),
	(67, 'App\\Models\\User', 1, 'auth_token', '62259e35aa0a493d55eb564fa47aa8296d184aa8bc0b73f2257ed68a4cf72558', '["*"]', '2023-01-07 02:21:51', NULL, '2023-01-07 01:42:32', '2023-01-07 02:21:51'),
	(68, 'App\\Models\\User', 1, 'auth_token', '723210b92ec2949a85ac7a22fbfe46f8a75f1d2c4c9d7cd11317837088134310', '["*"]', '2023-01-07 05:56:49', NULL, '2023-01-07 05:55:01', '2023-01-07 05:56:49'),
	(69, 'App\\Models\\User', 1, 'auth_token', '991ca64b39589ae373f803ebf915f8e65648aefc10495318992bb54489330526', '["*"]', '2023-01-07 05:57:31', NULL, '2023-01-07 05:57:06', '2023-01-07 05:57:31'),
	(70, 'App\\Models\\User', 1, 'auth_token', 'aa234dcfb9f2a054d7d8e4406904f1754f4e0d19479664411db5c816be13983f', '["*"]', '2023-01-07 06:06:00', NULL, '2023-01-07 06:05:07', '2023-01-07 06:06:00'),
	(71, 'App\\Models\\User', 1, 'auth_token', 'f0174eca0f5fbfc27ccb835d031c23fbf76648626fb0c88abd5cb7f384619a69', '["*"]', '2023-01-07 06:09:11', NULL, '2023-01-07 06:07:19', '2023-01-07 06:09:11'),
	(72, 'App\\Models\\User', 1, 'auth_token', '6b5ba708c1dfb16aebb4df50a4d26987994f3d1026bf3eb427c70129c974baa1', '["*"]', '2023-01-07 06:09:48', NULL, '2023-01-07 06:09:19', '2023-01-07 06:09:48'),
	(73, 'App\\Models\\User', 1, 'auth_token', 'd4347934b480cd4ef77890463f00632304854209895b5b677aebf2fe2997b43f', '["*"]', '2023-01-07 06:17:04', NULL, '2023-01-07 06:11:32', '2023-01-07 06:17:04'),
	(74, 'App\\Models\\User', 1, 'auth_token', '344f25594a0790694dfa1776a2ffefaf70c5e4c906380a5fb39e76ee07f5e71b', '["*"]', '2023-01-07 10:59:20', NULL, '2023-01-07 10:11:25', '2023-01-07 10:59:20'),
	(75, 'App\\Models\\User', 1, 'auth_token', 'c10d12dbf388accdd9f4c486acde5ba692aeec6d1ee14875370ee10cdc06bd33', '["*"]', '2023-01-07 11:30:43', NULL, '2023-01-07 11:01:49', '2023-01-07 11:30:43'),
	(76, 'App\\Models\\User', 1, 'auth_token', '6380d5532c02f9fc0c4fe824d5aa3533173fb01cad790d024de39b4565c06830', '["*"]', '2023-01-07 11:31:52', NULL, '2023-01-07 11:31:01', '2023-01-07 11:31:52'),
	(77, 'App\\Models\\User', 1, 'auth_token', '8f3699822739eb790a66200b5b0b07b9714e68758d024eed26bf8ee872a67a3f', '["*"]', '2023-01-07 11:34:29', NULL, '2023-01-07 11:32:00', '2023-01-07 11:34:29'),
	(78, 'App\\Models\\User', 1, 'auth_token', '00fdaa39323a013720f77de06be7101e1fa6261c30c530fe23b4d2021be035bd', '["*"]', '2023-01-07 11:37:37', NULL, '2023-01-07 11:34:37', '2023-01-07 11:37:37'),
	(79, 'App\\Models\\User', 1, 'auth_token', '066845c72be814c5d2e6fb782c38b95350f87c973a846da9c793c9dd9f0ca6a5', '["*"]', '2023-01-07 11:39:21', NULL, '2023-01-07 11:37:45', '2023-01-07 11:39:21'),
	(80, 'App\\Models\\User', 1, 'auth_token', '2e65188c068ff4e0618c9ec76055720f5d423345aa37df3e3e5c7cefe909e246', '["*"]', '2023-01-07 12:23:05', NULL, '2023-01-07 11:41:05', '2023-01-07 12:23:05'),
	(81, 'App\\Models\\User', 1, 'auth_token', 'b19363dec6009b873a53241272b0ca6a4f9c306ff2368becbf691f5cb13023b7', '["*"]', '2023-01-07 19:24:11', NULL, '2023-01-07 19:17:32', '2023-01-07 19:24:11'),
	(82, 'App\\Models\\User', 1, 'auth_token', '6356bc857757124a19f8fbfe692a483e084ebe60475668704acf19e472a077e4', '["*"]', '2023-01-07 21:21:41', NULL, '2023-01-07 19:24:44', '2023-01-07 21:21:41'),
	(83, 'App\\Models\\User', 1, 'auth_token', '852e7be2afd8da79f73ff2cf211ebc5d693dc0eb598e584def62cb6ff45def3e', '["*"]', '2023-01-07 21:23:49', NULL, '2023-01-07 21:22:06', '2023-01-07 21:23:49'),
	(84, 'App\\Models\\User', 1, 'auth_token', '6b3699040e94c311e4e191ea188c9434da482776a6743b9b082dda1d146e5d28', '["*"]', '2023-01-07 21:56:14', NULL, '2023-01-07 21:26:17', '2023-01-07 21:56:14'),
	(85, 'App\\Models\\User', 1, 'auth_token', '4883df2e073a47cedf26e2151b0d0f404ec48b5f28c10d3088676e8e6bf259dc', '["*"]', '2023-01-08 03:00:43', NULL, '2023-01-08 02:25:50', '2023-01-08 03:00:43'),
	(86, 'App\\Models\\User', 1, 'auth_token', '3e6d53ffc159d5270b3ef7a513468b57d2f2afec8a825a2c79e59f8639e514b9', '["*"]', '2023-01-08 03:11:02', NULL, '2023-01-08 03:08:36', '2023-01-08 03:11:02'),
	(87, 'App\\Models\\User', 1, 'auth_token', '2b69ae28f140db8561e5e7029886ca6de1d52826a72a8fe5d1c06c13311e8c00', '["*"]', NULL, NULL, '2023-01-08 03:13:28', '2023-01-08 03:13:28'),
	(88, 'App\\Models\\User', 1, 'auth_token', '12610766a8301cf16f9bb72590f06022db19e355851c03f5dbfd23002bd3e97e', '["*"]', '2023-01-08 03:16:17', NULL, '2023-01-08 03:14:10', '2023-01-08 03:16:17'),
	(89, 'App\\Models\\User', 1, 'auth_token', 'a12ce714029ca92cf198126bfa64d1cec7c56d65b9c5433bbc94cc857aac3dd6', '["*"]', '2023-01-08 09:13:10', NULL, '2023-01-08 09:11:14', '2023-01-08 09:13:10'),
	(90, 'App\\Models\\User', 1, 'auth_token', '59335e6c025af01745b003bd418dcd195f6085e6ca8f4541b167e73d9040e588', '["*"]', '2023-01-08 10:05:19', NULL, '2023-01-08 09:36:09', '2023-01-08 10:05:19'),
	(91, 'App\\Models\\User', 1, 'auth_token', 'f833947c5257a157ba4cfbc2ac036c3d04b9a89a7f4c652b7e3d22aba1522650', '["*"]', NULL, NULL, '2023-01-08 10:06:18', '2023-01-08 10:06:18'),
	(92, 'App\\Models\\User', 1, 'auth_token', '4b134e3cba426214757d2158cb5435792ae4976c27657aa7591e63876e285787', '["*"]', NULL, NULL, '2023-01-08 10:07:50', '2023-01-08 10:07:50'),
	(93, 'App\\Models\\User', 1, 'auth_token', '2df7ee6c495cb7265aa624e055f5c640f3504232e6e6d11450b7163643fe6c64', '["*"]', '2023-01-08 10:12:12', NULL, '2023-01-08 10:10:45', '2023-01-08 10:12:13'),
	(94, 'App\\Models\\User', 1, 'auth_token', 'ad8da29bb6a4f547e5891204b7edf053ce32f741c89628d12598e0898b4d5fd1', '["*"]', '2023-01-08 10:22:38', NULL, '2023-01-08 10:14:47', '2023-01-08 10:22:38'),
	(95, 'App\\Models\\User', 1, 'auth_token', 'e4ef77a310252423ac790272b06447f58cfed03370869387b12ae21af4590f12', '["*"]', '2023-01-08 11:02:35', NULL, '2023-01-08 10:38:50', '2023-01-08 11:02:35'),
	(96, 'App\\Models\\User', 1, 'auth_token', '11965777a3a854b8664fe3fdfd8896a169e11d502d761c26a6f0ec1c1ed3de44', '["*"]', '2023-01-08 22:58:46', NULL, '2023-01-08 22:56:40', '2023-01-08 22:58:46'),
	(97, 'App\\Models\\User', 1, 'auth_token', '6d795f2d8c30e190a8af3e75c399d20ceaaf29626d998d9c3ac8fbc7115f425d', '["*"]', '2023-01-09 00:50:22', NULL, '2023-01-09 00:11:41', '2023-01-09 00:50:22'),
	(98, 'App\\Models\\User', 1, 'auth_token', '986a24da7b79d2d250a610063beb0604a334494d4a89320d4b42501bdd4a90b7', '["*"]', '2023-01-09 00:52:47', NULL, '2023-01-09 00:51:34', '2023-01-09 00:52:47'),
	(99, 'App\\Models\\User', 1, 'auth_token', '0ee3f0fe6f45c7993adb44071825d6843aadc4736d0eef32da6b9b6abe4ac184', '["*"]', '2023-01-09 00:53:53', NULL, '2023-01-09 00:53:32', '2023-01-09 00:53:53'),
	(100, 'App\\Models\\User', 1, 'auth_token', 'e4462925ce37704d1e95603cb3fddbbdf3ca4b10a38beac0e3076192b0b14b58', '["*"]', '2023-01-09 02:47:57', NULL, '2023-01-09 02:46:58', '2023-01-09 02:47:57'),
	(101, 'App\\Models\\User', 1, 'auth_token', 'e776702e931d13d7e92253d3cfb4911b41ea4e5f8b4eeae48ab83e1c3229d2ae', '["*"]', '2023-01-09 02:52:28', NULL, '2023-01-09 02:52:17', '2023-01-09 02:52:28'),
	(102, 'App\\Models\\User', 1, 'auth_token', 'f6c1a04014b2fd0995b33e27ca40d8617420bd5575e0bf8d2415c267a9dbecac', '["*"]', '2023-01-09 02:53:34', NULL, '2023-01-09 02:53:21', '2023-01-09 02:53:34'),
	(103, 'App\\Models\\User', 1, 'auth_token', 'e132dd590222c6150aad7946c5b759082f1009c798e90b25a51d2cc7a4dea74c', '["*"]', '2023-01-09 03:16:20', NULL, '2023-01-09 02:54:10', '2023-01-09 03:16:20'),
	(104, 'App\\Models\\User', 1, 'auth_token', '6607e83338a1dc7b67b6eb18d09bf1b44f14b83a56d028c48f0a4c6234ed52c3', '["*"]', '2023-01-09 03:39:36', NULL, '2023-01-09 03:33:00', '2023-01-09 03:39:36'),
	(105, 'App\\Models\\User', 1, 'auth_token', 'a6d806a3f5a1c7870ef705aa2751890043d87fa85d2f0b8a539386cebeb6b774', '["*"]', '2023-01-09 03:40:40', NULL, '2023-01-09 03:40:01', '2023-01-09 03:40:40'),
	(106, 'App\\Models\\User', 1, 'auth_token', '0fce1d95b4e69aedccafc30152dd6100785f7415371cb10c50eee0e0ab1543e9', '["*"]', '2023-01-09 04:20:53', NULL, '2023-01-09 04:04:40', '2023-01-09 04:20:53'),
	(107, 'App\\Models\\User', 1, 'auth_token', 'a33bcf659995fb4be6ab7a24acc1c0c009e89a0261f2b6c7a77a2909a1bdb7da', '["*"]', '2023-01-09 04:30:52', NULL, '2023-01-09 04:25:56', '2023-01-09 04:30:52'),
	(108, 'App\\Models\\User', 1, 'auth_token', '6ad90fbf7a2ab5372289f2eb178eb8c453004f2f4a105c073f7fb38a326b8f4e', '["*"]', '2023-01-09 04:40:06', NULL, '2023-01-09 04:31:05', '2023-01-09 04:40:06'),
	(109, 'App\\Models\\User', 1, 'auth_token', '7291a8b6e8273b214e6e3f822906f6e4ef1e69728f2070ddbb4735ba66bd588d', '["*"]', '2023-01-09 04:49:00', NULL, '2023-01-09 04:41:52', '2023-01-09 04:49:00'),
	(110, 'App\\Models\\User', 1, 'auth_token', 'e87daeb80be55c606e9c1f62b0601f02ab39e20006e35091385eefedb8aebc73', '["*"]', '2023-01-09 04:57:01', NULL, '2023-01-09 04:55:33', '2023-01-09 04:57:01'),
	(111, 'App\\Models\\User', 1, 'auth_token', 'a149b49ee3562b8280d17e7e2329749dd42245273cbbf817f9ae05a8ccc3ed25', '["*"]', '2023-01-09 08:09:22', NULL, '2023-01-09 08:01:09', '2023-01-09 08:09:22'),
	(112, 'App\\Models\\User', 1, 'auth_token', '16247df63721fee32f15e561e84a40ab54378b6ca848118e906b0c8911bf74e8', '["*"]', '2023-01-09 08:12:38', NULL, '2023-01-09 08:12:15', '2023-01-09 08:12:38'),
	(113, 'App\\Models\\User', 1, 'auth_token', '99f67257c39b6c94bb72edfa38d77f469229443ad70706d33c2e29ab717c3409', '["*"]', '2023-01-09 08:15:55', NULL, '2023-01-09 08:15:30', '2023-01-09 08:15:55'),
	(114, 'App\\Models\\User', 1, 'auth_token', '9981394c63b9bbc38776503c572afca44810d932235919ddd86b5b4a93a85d15', '["*"]', '2023-01-09 08:55:49', NULL, '2023-01-09 08:18:43', '2023-01-09 08:55:49'),
	(115, 'App\\Models\\User', 1, 'auth_token', '2ae3dc89e794e7054ff2fa0849f8dbd5d2179d32b966768e917dce1fee06afc5', '["*"]', '2023-01-09 09:08:52', NULL, '2023-01-09 09:08:37', '2023-01-09 09:08:52'),
	(116, 'App\\Models\\User', 1, 'auth_token', '3f4962b59142550758efbb9832aa94e3f39abdc3165436e27b77d0e49ca3d251', '["*"]', '2023-01-09 09:35:44', NULL, '2023-01-09 09:35:28', '2023-01-09 09:35:44'),
	(117, 'App\\Models\\User', 1, 'auth_token', '94c28e2ea895cb19c503fe66439a76aced5789091340672554255ccc889ce782', '["*"]', '2023-01-09 17:18:34', NULL, '2023-01-09 17:16:31', '2023-01-09 17:18:34'),
	(118, 'App\\Models\\User', 1, 'auth_token', '84c2606068f70c7b7c668a0fb4b89d01f7f21c7bd9fb3c3f7d578ad0b05fd46a', '["*"]', '2023-01-09 18:42:37', NULL, '2023-01-09 18:41:24', '2023-01-09 18:42:37'),
	(119, 'App\\Models\\User', 1, 'auth_token', 'ab49d5323caea197d4353396414ce84b36d7dbad7b1ff1a0bb43969f5d1292d2', '["*"]', '2023-01-09 18:50:56', NULL, '2023-01-09 18:50:35', '2023-01-09 18:50:56'),
	(120, 'App\\Models\\User', 1, 'auth_token', '19c9eae9c511ff6f956323dfb23613139f2f1b8961a12ae740fa3303494d253b', '["*"]', '2023-01-09 18:58:31', NULL, '2023-01-09 18:52:35', '2023-01-09 18:58:31'),
	(121, 'App\\Models\\User', 1, 'auth_token', 'efa750d78fb7188e0639834f815704472480ef674c433f16991789b9f30edfb4', '["*"]', '2023-01-09 19:01:07', NULL, '2023-01-09 19:00:35', '2023-01-09 19:01:07'),
	(122, 'App\\Models\\User', 1, 'auth_token', 'e64065bd18b0472ce48a2e8bb87d5f4f9d971f0f461f59fd8e4a071d419df6a9', '["*"]', '2023-01-09 19:09:25', NULL, '2023-01-09 19:08:21', '2023-01-09 19:09:25'),
	(123, 'App\\Models\\User', 1, 'auth_token', '312bcc360d2b396f3feec31346c266e44d6a19a77af419ed0f996a32dbefe397', '["*"]', '2023-01-09 19:13:07', NULL, '2023-01-09 19:12:38', '2023-01-09 19:13:08'),
	(124, 'App\\Models\\User', 1, 'auth_token', '808370a08890eaef37d6b5a17d97f0ca208f85563818d5cdb665587f36c8b0e5', '["*"]', '2023-01-09 19:17:01', NULL, '2023-01-09 19:16:43', '2023-01-09 19:17:01'),
	(125, 'App\\Models\\User', 1, 'auth_token', '8f7931886e55de9058f8c8eed2750b4cf00a766c9fbb83488474b070c2e81fc7', '["*"]', '2023-01-09 19:19:43', NULL, '2023-01-09 19:19:27', '2023-01-09 19:19:43'),
	(126, 'App\\Models\\User', 1, 'auth_token', '5319699a350f68b3b85abf2cef8719aa5d732743371d5dbad08543b2fec88511', '["*"]', '2023-01-09 19:22:40', NULL, '2023-01-09 19:22:21', '2023-01-09 19:22:40'),
	(127, 'App\\Models\\User', 1, 'auth_token', '3a62f1149f33af576605f0303fd8cc5243077e13d25ce34a01662590f3083c6b', '["*"]', '2023-01-09 19:25:17', NULL, '2023-01-09 19:24:26', '2023-01-09 19:25:17'),
	(128, 'App\\Models\\User', 1, 'auth_token', 'e2e8c974784e94037ede1cf54e5d89bd710cf1c052c8796a1dd02752c4a49f91', '["*"]', '2023-01-09 19:32:35', NULL, '2023-01-09 19:30:25', '2023-01-09 19:32:35'),
	(129, 'App\\Models\\User', 1, 'auth_token', '44faac92ef63bb15770eddc1c9434b55930ef9cc34958e08a9d4e486c46fbff3', '["*"]', '2023-01-09 19:34:32', NULL, '2023-01-09 19:33:57', '2023-01-09 19:34:32'),
	(130, 'App\\Models\\User', 1, 'auth_token', '9c357ce994fd13ee2fbdd1285313c961e27f80d84d7f7f49c32cb83c84b056d9', '["*"]', '2023-01-09 20:00:14', NULL, '2023-01-09 19:37:26', '2023-01-09 20:00:14'),
	(131, 'App\\Models\\User', 1, 'auth_token', 'd7323747ebea283a18ec49df8eb57c440a7ee01fb1094121a2f8658fc69454ac', '["*"]', '2023-01-09 20:04:20', NULL, '2023-01-09 20:03:58', '2023-01-09 20:04:20'),
	(132, 'App\\Models\\User', 1, 'auth_token', '9421b73da8f9237d8d8ae43885b5b54e07ca2da5a15f99381d93916182b7e50f', '["*"]', '2023-01-09 20:06:18', NULL, '2023-01-09 20:05:54', '2023-01-09 20:06:18'),
	(133, 'App\\Models\\User', 1, 'auth_token', '20c2ad7c55cc90ece654bbe4eb6362b457d07b308cd48b512926cdec57ba43b8', '["*"]', '2023-01-09 20:24:41', NULL, '2023-01-09 20:10:51', '2023-01-09 20:24:41'),
	(134, 'App\\Models\\User', 1, 'auth_token', '9e25f7a49750943e2ce5dc7704155fdf990fda6cae6daab51fbe09f1386ae184', '["*"]', '2023-01-10 02:26:24', NULL, '2023-01-10 02:25:27', '2023-01-10 02:26:24'),
	(135, 'App\\Models\\User', 1, 'auth_token', 'd4e628e7ea847c9fc215aa2180d05e9d14f422a1544f51e82e58bbb56187df08', '["*"]', '2023-01-13 17:43:26', NULL, '2023-01-13 17:41:24', '2023-01-13 17:43:26'),
	(136, 'App\\Models\\User', 1, 'auth_token', 'ad1b814bb9f39bd326a261fef52ad4fd2d4fd35d4378695233c0e04b98c1126b', '["*"]', '2023-01-13 20:22:44', NULL, '2023-01-13 18:00:09', '2023-01-13 20:22:44'),
	(137, 'App\\Models\\User', 1, 'auth_token', 'b7d289666b504d41c4f62d404685e34b5486c85c7cf17dae4db7d88aef77a996', '["*"]', '2023-01-16 18:25:18', NULL, '2023-01-16 18:23:15', '2023-01-16 18:25:18'),
	(138, 'App\\Models\\User', 1, 'auth_token', 'f9c088ce86d16ebe46fabba11b7a17988875cfe5b0c5ce31e7a948852bf44589', '["*"]', '2023-01-17 02:43:13', NULL, '2023-01-17 02:01:43', '2023-01-17 02:43:13'),
	(139, 'App\\Models\\User', 1, 'auth_token', '11f7cb52f7115df62ab7fdb852484cc835765c62fa7bda0338bf23d466d87cb6', '["*"]', '2023-01-17 02:43:54', NULL, '2023-01-17 02:43:34', '2023-01-17 02:43:54'),
	(140, 'App\\Models\\User', 1, 'auth_token', '479bda0fa45d0de483d3a447579d9945fec822cee8a4f15472a9bd9f28d1647b', '["*"]', '2023-01-17 02:45:38', NULL, '2023-01-17 02:45:20', '2023-01-17 02:45:38'),
	(141, 'App\\Models\\User', 1, 'auth_token', '8639a6a80e7112f04f4fe231b528b58f0ca6361b07e7ec962a5d43e0b8e6551b', '["*"]', '2023-01-17 02:48:17', NULL, '2023-01-17 02:47:57', '2023-01-17 02:48:17'),
	(142, 'App\\Models\\User', 1, 'auth_token', '7f686868aa192a9d2a3faab5179e8d4e45d1c82a41efa304e598811e49675728', '["*"]', '2023-01-17 02:52:45', NULL, '2023-01-17 02:52:14', '2023-01-17 02:52:45'),
	(143, 'App\\Models\\User', 1, 'auth_token', 'a2222c0b0f6ed5633e136ec0e2d68497c47198a3699f0cb5a4bd7a4d857a930b', '["*"]', '2023-01-17 02:59:19', NULL, '2023-01-17 02:55:48', '2023-01-17 02:59:19'),
	(144, 'App\\Models\\User', 1, 'auth_token', 'fc9df84a5fda95bc1edd69d4abbaeb9b1eb6462e18decd159e75e7e30727128b', '["*"]', '2023-01-17 03:05:02', NULL, '2023-01-17 03:01:46', '2023-01-17 03:05:02'),
	(145, 'App\\Models\\User', 1, 'auth_token', '1e28bd6a2a1c6b5fd9a960f6156cd7282a854f87c460b88b350bd18b8525f654', '["*"]', '2023-01-17 03:41:41', NULL, '2023-01-17 03:41:05', '2023-01-17 03:41:41'),
	(146, 'App\\Models\\User', 1, 'auth_token', 'fd64c40c1799e6ac590c39a0d994e699de9cfc706feedf06f70ec72c243117ce', '["*"]', '2023-01-17 06:48:51', NULL, '2023-01-17 03:42:36', '2023-01-17 06:48:51'),
	(147, 'App\\Models\\User', 1, 'auth_token', 'd8c053d0af35387a49f488f04d80219439760926502092e67f94372972ec921f', '["*"]', '2023-01-17 07:30:02', NULL, '2023-01-17 07:29:38', '2023-01-17 07:30:02'),
	(148, 'App\\Models\\User', 1, 'auth_token', 'c8ef8bd4b521cea50d3aed0fec9aaa934ba630b3d431b09488a09ee89586f099', '["*"]', '2023-01-17 07:38:55', NULL, '2023-01-17 07:38:28', '2023-01-17 07:38:55'),
	(149, 'App\\Models\\User', 1, 'auth_token', '5274799f560ac1da2e99fff91aaac7fa989d965546d60b7f64bef95c7cc3e647', '["*"]', '2023-01-17 08:04:41', NULL, '2023-01-17 08:04:31', '2023-01-17 08:04:41'),
	(150, 'App\\Models\\User', 1, 'auth_token', 'df63f2300e07bf22144b29b0cd38fd2cf8fbb33e1eff19595fa7e703217739e6', '["*"]', '2023-01-17 08:17:23', NULL, '2023-01-17 08:10:50', '2023-01-17 08:17:23'),
	(151, 'App\\Models\\User', 1, 'auth_token', 'f258bc6b2fe6a043af089d0927422a21526818f9b01fa3d7a45dd0778d26958a', '["*"]', '2023-01-17 08:42:48', NULL, '2023-01-17 08:19:41', '2023-01-17 08:42:48'),
	(152, 'App\\Models\\User', 1, 'auth_token', 'b1cb4aec6de20b0ed936903cb66b45b92b54cd90f0d6bb77bb6da6a2603fd965', '["*"]', '2023-01-17 19:34:58', NULL, '2023-01-17 17:32:26', '2023-01-17 19:34:58'),
	(153, 'App\\Models\\User', 1, 'auth_token', '2210921786542cbbd1e044e3ab2b608352faa9ba3244f6b2ae161b3705e5cdd5', '["*"]', '2023-01-17 22:05:28', NULL, '2023-01-17 19:50:03', '2023-01-17 22:05:28'),
	(154, 'App\\Models\\User', 1, 'auth_token', '92c48af1a4e7569a8f5b0390ccfd251c18430abccd3025de0bf5406fc9e57f4e', '["*"]', '2023-01-18 01:16:28', NULL, '2023-01-18 00:07:28', '2023-01-18 01:16:28'),
	(155, 'App\\Models\\User', 1, 'auth_token', 'dcb7f5cbd1e5cc669e5bde39aafeeebd2779fb90332323d84b424b2e249d4050', '["*"]', '2023-01-18 01:42:19', NULL, '2023-01-18 01:41:57', '2023-01-18 01:42:19'),
	(156, 'App\\Models\\User', 1, 'auth_token', '79f5b6b863966682ac4bff1f3cac22511f0b5784e4eb6a779c5f23d6e4b87063', '["*"]', '2023-01-18 01:53:00', NULL, '2023-01-18 01:52:28', '2023-01-18 01:53:00'),
	(157, 'App\\Models\\User', 1, 'auth_token', 'e2051414a28019d911eaeb5f77b16daad63f036cb59f22229bbc53e49601c8be', '["*"]', '2023-01-18 02:20:07', NULL, '2023-01-18 02:19:45', '2023-01-18 02:20:07'),
	(158, 'App\\Models\\User', 1, 'auth_token', 'd0f9cb32e8535134d54c8863a8b7b0e29917a0f78ed26f8febe9a6657a003d98', '["*"]', '2023-01-18 03:04:17', NULL, '2023-01-18 02:21:22', '2023-01-18 03:04:17'),
	(159, 'App\\Models\\User', 1, 'auth_token', 'ebd97e9a1a5c68592769d5de57668e5dc2bde65022ab2c6889bf42ee62230397', '["*"]', '2023-01-18 16:18:22', NULL, '2023-01-18 16:16:26', '2023-01-18 16:18:22'),
	(160, 'App\\Models\\User', 1, 'auth_token', '647878e8a1c4e0f2b32788d06756602c6dee15815a70e237e22888ed3664f90f', '["*"]', '2023-01-18 17:19:38', NULL, '2023-01-18 17:18:43', '2023-01-18 17:19:38'),
	(161, 'App\\Models\\User', 1, 'auth_token', '95124dcd53498ffecda00d00ec508c96bed910d94da5bf3558e7d1cbb068c3dc', '["*"]', '2023-01-18 19:59:56', NULL, '2023-01-18 19:44:57', '2023-01-18 19:59:56'),
	(162, 'App\\Models\\User', 1, 'auth_token', 'aa4bfcbb6c7c5ebcd09c52fab7d1d73170ad5074c3828277b1fc61bfd98a11db', '["*"]', '2023-01-18 20:01:44', NULL, '2023-01-18 20:00:56', '2023-01-18 20:01:44'),
	(163, 'App\\Models\\User', 1, 'auth_token', 'b855292aa39e5640bc86bf0c1bbf3107140de29652e199f3a931c372dda1f19d', '["*"]', '2023-01-18 21:44:34', NULL, '2023-01-18 21:44:20', '2023-01-18 21:44:34'),
	(164, 'App\\Models\\User', 1, 'auth_token', '7e9eb93e840f9af2f02f689dcdb11b9a82d5908cfb066d3f9dcb375e0c4f03f1', '["*"]', '2023-01-19 17:30:38', NULL, '2023-01-19 16:32:49', '2023-01-19 17:30:38'),
	(165, 'App\\Models\\User', 1, 'auth_token', 'eed03023f99bcbe568951a22e70d1487f84098dc1dc653bba2275322f8956522', '["*"]', '2023-01-20 01:44:21', NULL, '2023-01-20 00:02:17', '2023-01-20 01:44:21'),
	(166, 'App\\Models\\User', 1, 'auth_token', '35f378faef49a47b2bc54df03781a19154ae823acee6ff95d143790e77a16bb6', '["*"]', '2023-01-20 05:04:36', NULL, '2023-01-20 01:47:31', '2023-01-20 05:04:36'),
	(167, 'App\\Models\\User', 1, 'auth_token', 'd3d91c30f4c334656e6494c4087dfa68d604f0d49fd58e72a3afb292593e28fa', '["*"]', '2023-01-20 17:39:13', NULL, '2023-01-20 17:26:17', '2023-01-20 17:39:13'),
	(168, 'App\\Models\\User', 1, 'auth_token', '533cd919fa3718b448746ace1c4db9ebb03bc01dcf433325bca0b080a6ca4b5c', '["*"]', '2023-01-20 17:42:48', NULL, '2023-01-20 17:40:52', '2023-01-20 17:42:48'),
	(169, 'App\\Models\\User', 1, 'auth_token', '00ab1e586e75181cc361bbe0a6b494477837859c28430cd55aaf0044492d0659', '["*"]', '2023-01-20 18:36:29', NULL, '2023-01-20 18:03:42', '2023-01-20 18:36:29'),
	(170, 'App\\Models\\User', 1, 'auth_token', '29eebdfbe694c7e3318c3ce2f3f4521a055010a56491ac67c391c5bd01aaabfd', '["*"]', '2023-01-20 18:38:11', NULL, '2023-01-20 18:37:56', '2023-01-20 18:38:12'),
	(171, 'App\\Models\\User', 1, 'auth_token', 'f8199b5ea64ccde2760256d12c3f02b8e4f61caf738eaa28da42d4d58deb8f8f', '["*"]', '2023-01-20 18:44:04', NULL, '2023-01-20 18:40:40', '2023-01-20 18:44:04'),
	(172, 'App\\Models\\User', 1, 'auth_token', '817e145d411fb0dab02f6975395577612b5dfc864340dd5de839d968812ef121', '["*"]', '2023-01-20 23:25:42', NULL, '2023-01-20 18:46:54', '2023-01-20 23:25:42'),
	(173, 'App\\Models\\User', 1, 'auth_token', '745267284b1846d9970cb955e266d1ed515dd8d6b1e58956d89684ac24d7e907', '["*"]', '2023-01-22 05:24:13', NULL, '2023-01-22 05:05:36', '2023-01-22 05:24:13'),
	(174, 'App\\Models\\User', 1, 'auth_token', '1117eded01c263daa1b9d0d98efce162b92d277ede1c176907cc075dfac924cf', '["*"]', '2023-01-22 07:28:42', NULL, '2023-01-22 05:28:33', '2023-01-22 07:28:42'),
	(175, 'App\\Models\\User', 1, 'auth_token', 'dca758ffc29ed43f163dc72e036dc2bdd0ea34f2dddb68fadd9f2629c29462e2', '["*"]', '2023-01-22 07:48:57', NULL, '2023-01-22 07:29:03', '2023-01-22 07:48:57'),
	(176, 'App\\Models\\User', 1, 'auth_token', '7a74a37863d71209edbff3fc8532652077dde778c54b4804f3ab7ab6ba166fbc', '["*"]', '2023-01-22 07:49:39', NULL, '2023-01-22 07:49:16', '2023-01-22 07:49:39'),
	(177, 'App\\Models\\User', 1, 'auth_token', 'aad443c561840ac81336dbe32fd171d5432983cf45ec871061fdd25244631cf8', '["*"]', '2023-01-22 07:52:49', NULL, '2023-01-22 07:52:22', '2023-01-22 07:52:49'),
	(178, 'App\\Models\\User', 1, 'auth_token', '4a987e2edbf392afdb2f9990587e349a755e56ab36a1b55d9bfd7dd3fc669c50', '["*"]', '2023-01-22 07:55:16', NULL, '2023-01-22 07:54:01', '2023-01-22 07:55:16'),
	(179, 'App\\Models\\User', 1, 'auth_token', 'f1eff665e3ed9baf2db299e5753268bffa5e3a29545dcacda378b1e7fea474f4', '["*"]', '2023-01-22 15:55:02', NULL, '2023-01-22 07:56:45', '2023-01-22 15:55:02'),
	(180, 'App\\Models\\User', 1, 'auth_token', 'd8e2c8e602d47d55b668b31b94fa52cca51f1fd1127c525506109718f6860e0c', '["*"]', '2023-01-22 16:08:54', NULL, '2023-01-22 15:57:00', '2023-01-22 16:08:54'),
	(181, 'App\\Models\\User', 1, 'auth_token', '0a9e391da623af778e6be663a36936213c9c077ff03e880ba8696799fb95f842', '["*"]', '2023-01-22 16:25:06', NULL, '2023-01-22 16:21:08', '2023-01-22 16:25:06'),
	(182, 'App\\Models\\User', 1, 'auth_token', '3a632781791658086100c9594d56345e14dc46f2e401a3c9ff3b581adda435bd', '["*"]', '2023-01-22 16:41:10', NULL, '2023-01-22 16:33:21', '2023-01-22 16:41:10'),
	(183, 'App\\Models\\User', 1, 'auth_token', 'f36b7bac09398241e2392a1ff64eb33be0883cd4f17d4798f2be1503038fdb0c', '["*"]', '2023-01-22 16:49:56', NULL, '2023-01-22 16:43:40', '2023-01-22 16:49:56'),
	(184, 'App\\Models\\User', 1, 'auth_token', 'ab874e32b39536dc38614bf251af1ef6918906516e2dd8012154d9f8360a02bb', '["*"]', '2023-01-22 16:55:05', NULL, '2023-01-22 16:54:49', '2023-01-22 16:55:05'),
	(185, 'App\\Models\\User', 1, 'auth_token', '265e2675e7130ab0e32b32774fd4260fbecf9c714bce18f58cd6d1812e8c9396', '["*"]', '2023-01-22 16:56:18', NULL, '2023-01-22 16:56:01', '2023-01-22 16:56:18'),
	(186, 'App\\Models\\User', 1, 'auth_token', '1c64f8f181e4c044e56405cdb7452b078f2cdb5df1a93c307bc15b4ef99f9c2c', '["*"]', '2023-01-22 16:57:24', NULL, '2023-01-22 16:57:09', '2023-01-22 16:57:24'),
	(187, 'App\\Models\\User', 1, 'auth_token', 'f4d98e7c33c37dc3dbf55e4790c8c7c582d74051273d72e214eb06061c6c1b0f', '["*"]', '2023-01-22 16:59:45', NULL, '2023-01-22 16:59:31', '2023-01-22 16:59:45'),
	(188, 'App\\Models\\User', 1, 'auth_token', '1e65a0e1b02beca111bfc1eb9de894b23c5270ac1378fef543a667eb0f27872a', '["*"]', '2023-01-22 17:00:58', NULL, '2023-01-22 17:00:44', '2023-01-22 17:00:58'),
	(189, 'App\\Models\\User', 1, 'auth_token', '752dd27abd6e67b153ba753e60525ea4495c0d4cbfd2bfbc5032c7c31cc93bea', '["*"]', '2023-01-22 17:04:12', NULL, '2023-01-22 17:01:29', '2023-01-22 17:04:12'),
	(190, 'App\\Models\\User', 1, 'auth_token', '683d229f73419038cb90065e06eadf8facd0694dae39845141d79d4f93c40ec2', '["*"]', '2023-01-23 03:16:38', NULL, '2023-01-22 17:07:10', '2023-01-23 03:16:38'),
	(191, 'App\\Models\\User', 1, 'auth_token', '3bafcc32cf5c59058e1ec124b36377ec03123c2370f911813bdc12c959eb1e23', '["*"]', '2023-01-23 05:46:59', NULL, '2023-01-23 03:27:50', '2023-01-23 05:46:59'),
	(192, 'App\\Models\\User', 1, 'auth_token', 'c82bdcf5716214aa15b82977b28228222f71d7e93733a8610e1aac35b5ad8ab9', '["*"]', '2023-01-23 08:36:51', NULL, '2023-01-23 05:47:13', '2023-01-23 08:36:52'),
	(193, 'App\\Models\\User', 1, 'auth_token', '8ac4a174fcec77773d0a5a9bfc541169837305fbd5e4eda74003c024a706107d', '["*"]', '2023-01-23 09:16:32', NULL, '2023-01-23 08:38:48', '2023-01-23 09:16:32'),
	(194, 'App\\Models\\User', 1, 'auth_token', '4cef9ef5c07eac3b53cc197c16121707f7ac7dd8d31e07c06a601c648477fa71', '["*"]', '2023-01-23 09:52:59', NULL, '2023-01-23 09:28:48', '2023-01-23 09:52:59'),
	(195, 'App\\Models\\User', 1, 'auth_token', '20e235d7eb03a3bf15d5c6d55f7d7722780caa7c0b066fe281179065846909c4', '["*"]', '2023-01-23 18:52:56', NULL, '2023-01-23 17:17:16', '2023-01-23 18:52:56'),
	(196, 'App\\Models\\User', 1, 'auth_token', '4969538fe527a0181ecb70ab04188f166ea2a53a136849808f7c599a4becdf66', '["*"]', '2023-01-23 19:48:31', NULL, '2023-01-23 19:47:43', '2023-01-23 19:48:31'),
	(197, 'App\\Models\\User', 1, 'auth_token', 'ba64200c0800e9cb55c8e00bb05090cb15dcb5233090f110f783c2ec19b0e313', '["*"]', '2023-01-23 20:14:27', NULL, '2023-01-23 19:56:17', '2023-01-23 20:14:27'),
	(198, 'App\\Models\\User', 1, 'auth_token', '0e52acf5a942f72eebc828f1cef41ef248c426d3245c57d8cfdafcacc61e0e4b', '["*"]', '2023-01-24 01:11:39', NULL, '2023-01-24 01:10:25', '2023-01-24 01:11:39'),
	(199, 'App\\Models\\User', 1, 'auth_token', 'b24e4e94942b2fdc10239a6cd16433dab66fb45c98fb6b0c7e81391edbb81cb4', '["*"]', '2023-01-24 01:14:22', NULL, '2023-01-24 01:13:40', '2023-01-24 01:14:22'),
	(200, 'App\\Models\\User', 1, 'auth_token', '74f8366b135e780d7ac49bb358540ab84e0de4af19823621522897b42f211918', '["*"]', '2023-01-24 01:30:14', NULL, '2023-01-24 01:29:46', '2023-01-24 01:30:14'),
	(201, 'App\\Models\\User', 1, 'auth_token', 'be45e69538f1a5b724a17913eecb6acb9b160f2f263c8b8210f1e5635eb6aa74', '["*"]', '2023-01-24 01:35:23', NULL, '2023-01-24 01:34:56', '2023-01-24 01:35:23'),
	(202, 'App\\Models\\User', 1, 'auth_token', 'c16c58e26a8a544ac76b48364a9c1bd43718f95eb9fe9d33e41e438dce455104', '["*"]', '2023-01-24 01:50:45', NULL, '2023-01-24 01:49:34', '2023-01-24 01:50:45'),
	(203, 'App\\Models\\User', 1, 'auth_token', '485937a1068078f6a5727b73ce5fc6c075a5aebdeb74f87675b6ea495626d9c7', '["*"]', '2023-01-24 01:53:00', NULL, '2023-01-24 01:52:17', '2023-01-24 01:53:00'),
	(204, 'App\\Models\\User', 1, 'auth_token', '07ef8f01ebe13be75b243dee01053e231157727cbf32f14de077d353082ad6c2', '["*"]', '2023-01-24 01:58:09', NULL, '2023-01-24 01:57:09', '2023-01-24 01:58:09'),
	(205, 'App\\Models\\User', 1, 'auth_token', '594c4d1a444f0e831a6cee0a6cb0395c9123904a64edcf3f57e6abac6807f9aa', '["*"]', '2023-01-24 02:28:25', NULL, '2023-01-24 02:07:21', '2023-01-24 02:28:25'),
	(206, 'App\\Models\\User', 1, 'auth_token', 'd3cf52815f13d7062d2e0a8799dcea69c951ebad526060b30a67330d21d5f5c6', '["*"]', '2023-01-24 02:50:14', NULL, '2023-01-24 02:31:21', '2023-01-24 02:50:14'),
	(207, 'App\\Models\\User', 1, 'auth_token', '9c92c752f3aa43a015ccc66cfadd6bb06bf8086d485ab4b229adbc9d04a4a1af', '["*"]', '2023-01-24 03:08:40', NULL, '2023-01-24 03:08:20', '2023-01-24 03:08:40'),
	(208, 'App\\Models\\User', 1, 'auth_token', 'f4abf46c8cebc25479fbbb96b0cbf426db1093dc88b1ea1cc1ccb987509db33f', '["*"]', '2023-01-24 03:12:36', NULL, '2023-01-24 03:09:59', '2023-01-24 03:12:36'),
	(209, 'App\\Models\\User', 1, 'auth_token', '00a7c22bbe687b9336e45f39a383c16f9041bf5711caf4c6e357e28d25542197', '["*"]', '2023-01-24 20:39:00', NULL, '2023-01-24 19:36:39', '2023-01-24 20:39:00'),
	(210, 'App\\Models\\User', 1, 'auth_token', '5fe4229a232d08a0845ae83246342158a67e6f079426306ee899056558e6dcf1', '["*"]', '2023-01-25 01:01:33', NULL, '2023-01-25 01:01:12', '2023-01-25 01:01:33'),
	(211, 'App\\Models\\User', 1, 'auth_token', 'e3662a8bfa50efb93c08897d3a8924e18adb293d34f98bf6c10ac57cdb94d2dd', '["*"]', '2023-01-25 01:28:15', NULL, '2023-01-25 01:03:36', '2023-01-25 01:28:15'),
	(212, 'App\\Models\\User', 1, 'auth_token', '2d911465f3c3b21c529617009f3d045b06a585a500c320c6c4372dcb526bc804', '["*"]', '2023-01-27 01:20:03', NULL, '2023-01-27 00:53:44', '2023-01-27 01:20:03'),
	(213, 'App\\Models\\User', 1, 'auth_token', 'b82316425df6f3c8505e00ed655d2eec765ede027dedec408e715dff1bbc62df', '["*"]', '2023-01-27 01:43:03', NULL, '2023-01-27 01:38:34', '2023-01-27 01:43:03'),
	(214, 'App\\Models\\User', 1, 'auth_token', 'a658f1338fddda4fe2db1aa5a0b6fc5e86a1625fd93a8508a95ea08f59e4e20e', '["*"]', '2023-01-27 19:04:27', NULL, '2023-01-27 18:43:22', '2023-01-27 19:04:27'),
	(215, 'App\\Models\\User', 1, 'auth_token', '5a6d5278baca15d04bd29c0fb2a3d1b41d42ad1cf6488ee692f97e4efcbe726d', '["*"]', '2023-01-27 19:06:39', NULL, '2023-01-27 19:04:52', '2023-01-27 19:06:39'),
	(216, 'App\\Models\\User', 1, 'auth_token', '037b5369dfe051cc37eebbfdf7766a5debc60c933819ca56dd00016ed3f12fa8', '["*"]', '2023-01-27 19:08:16', NULL, '2023-01-27 19:07:55', '2023-01-27 19:08:16'),
	(217, 'App\\Models\\User', 1, 'auth_token', '0019720cadda940c4a13da689a74dfa1a9c10fbbdec0cd3fe0f9b643f3eb7c45', '["*"]', '2023-01-27 19:45:28', NULL, '2023-01-27 19:16:20', '2023-01-27 19:45:28'),
	(218, 'App\\Models\\User', 1, 'auth_token', 'b7981a20f564e658ad037f444924901af4e25a3a317c135cae819e1074a740d9', '["*"]', '2023-01-27 19:47:08', NULL, '2023-01-27 19:46:22', '2023-01-27 19:47:08'),
	(219, 'App\\Models\\User', 1, 'auth_token', '038c70995d45e1926eaf0d76b3b53424079a57e380ffe7b2b75593d5e8e09fcc', '["*"]', '2023-01-27 19:59:25', NULL, '2023-01-27 19:52:43', '2023-01-27 19:59:25'),
	(220, 'App\\Models\\User', 1, 'auth_token', 'bae516b09cafae824c4ed1f33b53a145f43f5c99269b0486f06ba7d24c73f396', '["*"]', '2023-01-27 22:22:25', NULL, '2023-01-27 22:21:15', '2023-01-27 22:22:25'),
	(221, 'App\\Models\\User', 1, 'auth_token', '9510e451c3e8a4549a73266e549eaf134fc98da9523fef53a83eacbeebaecbf3', '["*"]', '2023-01-29 08:45:26', NULL, '2023-01-29 08:45:08', '2023-01-29 08:45:26'),
	(222, 'App\\Models\\User', 1, 'auth_token', '4c15a1c51e99e7acc2d5da95759ea61c3e4d1c3a6d8d145c35e07151726b31a8', '["*"]', '2023-01-29 21:24:57', NULL, '2023-01-29 08:46:31', '2023-01-29 21:24:57'),
	(223, 'App\\Models\\User', 1, 'auth_token', '1e8186c99d335c462a3b0d49ff3d893e0df2ff7d545399153a8e86deab316e84', '["*"]', '2023-01-30 09:05:54', NULL, '2023-01-30 08:59:33', '2023-01-30 09:05:54'),
	(224, 'App\\Models\\User', 1, 'auth_token', '1ebad1eb4baf6e2baac0204a71b3aa44be44c071e2b7e1f2152954733661260b', '["*"]', '2023-01-30 09:24:08', NULL, '2023-01-30 09:23:44', '2023-01-30 09:24:08'),
	(225, 'App\\Models\\User', 1, 'auth_token', '49a1eb23787ef4058df3f2e075ab95ff22e3376c60894ba2237a4854a3cc0dcd', '["*"]', '2023-01-30 09:31:50', NULL, '2023-01-30 09:30:34', '2023-01-30 09:31:50'),
	(226, 'App\\Models\\User', 1, 'auth_token', 'caa5fa85d00f28ed30c256a9c899b31073928e16c3b273a747d4811090aee923', '["*"]', '2023-01-30 22:11:04', NULL, '2023-01-30 22:10:07', '2023-01-30 22:11:04'),
	(227, 'App\\Models\\User', 1, 'auth_token', '6fa5ae535b8b17c01cd4dbc713a6561620cbb640a42dfc084a149123f23e6221', '["*"]', '2023-01-31 01:31:11', NULL, '2023-01-31 01:25:06', '2023-01-31 01:31:11'),
	(228, 'App\\Models\\User', 1, 'auth_token', '501507adf4845552db0ecb9862fce6e881648dee9569f0c45f3fe3d72508a714', '["*"]', '2023-01-31 01:56:51', NULL, '2023-01-31 01:53:02', '2023-01-31 01:56:51'),
	(229, 'App\\Models\\User', 1, 'auth_token', '9e721780ddd542a18aa9ea509fe1893dfa2b1408064d59b9209892f0a486d032', '["*"]', '2023-01-31 03:27:54', NULL, '2023-01-31 03:26:33', '2023-01-31 03:27:54'),
	(230, 'App\\Models\\User', 1, 'auth_token', '6c7ed98242deb9c281d64f94058e227860be8858dd9c8520fcc82c9a711a94b7', '["*"]', '2023-01-31 19:38:05', NULL, '2023-01-31 17:09:05', '2023-01-31 19:38:05'),
	(231, 'App\\Models\\User', 1, 'auth_token', 'c8feb7a80aef9f65837f51a2c833bb7c21fa296aa91b9e83f84b244ac19fdbd2', '["*"]', '2023-01-31 19:56:36', NULL, '2023-01-31 19:55:48', '2023-01-31 19:56:36'),
	(232, 'App\\Models\\User', 1, 'auth_token', '4fb7235dd08e6810d4f006195b56cd801558ba13dab8aece782f3aa06210a8d9', '["*"]', '2023-01-31 20:23:17', NULL, '2023-01-31 20:21:03', '2023-01-31 20:23:17'),
	(233, 'App\\Models\\User', 1, 'auth_token', '4a8505f648d60aaed161c6c3c5d07c75f5920dd273a36bb5efd26c6f5030f05b', '["*"]', '2023-01-31 20:32:20', NULL, '2023-01-31 20:31:57', '2023-01-31 20:32:20'),
	(234, 'App\\Models\\User', 1, 'auth_token', 'd51bf93169c6a36390d82fe9d055932b83e47c58bff2b311b4df843bcf93601d', '["*"]', '2023-01-31 20:36:42', NULL, '2023-01-31 20:36:20', '2023-01-31 20:36:42'),
	(235, 'App\\Models\\User', 1, 'auth_token', '5a9e683ec99be48326e1906bfd4aefd1ee5ec9857063a815ef21a682bd7b2b20', '["*"]', '2023-01-31 20:38:30', NULL, '2023-01-31 20:38:08', '2023-01-31 20:38:30'),
	(236, 'App\\Models\\User', 1, 'auth_token', '0c6ff5e0ac807810978b8af8f08560e8661d53daec86c7ab9ace1f9bc7e061da', '["*"]', '2023-01-31 21:26:41', NULL, '2023-01-31 21:26:25', '2023-01-31 21:26:41'),
	(237, 'App\\Models\\User', 1, 'auth_token', '83a79110369735c96702a1b37324f551914a74274c60ec54d42c7e1fe10801ca', '["*"]', '2023-02-02 01:42:17', NULL, '2023-02-02 01:16:46', '2023-02-02 01:42:17'),
	(238, 'App\\Models\\User', 1, 'auth_token', '7becf32784a3600615cebe2d6fa7f07951af91caca4d7a628a96349079b8d17e', '["*"]', '2023-02-02 02:18:48', NULL, '2023-02-02 02:18:26', '2023-02-02 02:18:48'),
	(239, 'App\\Models\\User', 1, 'auth_token', '87719b241ebb250e96f34f77d1e9be1614e15589f9c90aaff0ee77f8afa5aafa', '["*"]', '2023-02-02 04:40:23', NULL, '2023-02-02 04:39:43', '2023-02-02 04:40:23'),
	(240, 'App\\Models\\User', 1, 'auth_token', '4d293426d66ec865cc6ef43b533ef3287fb5932a014cca864d2a7bec2eb8c096', '["*"]', '2023-02-02 04:48:11', NULL, '2023-02-02 04:47:43', '2023-02-02 04:48:11'),
	(241, 'App\\Models\\User', 1, 'auth_token', '405044142a23b2fe09c882325930687da06abfe14afbfc6a47a55672f9c47bb6', '["*"]', '2023-02-02 04:53:17', NULL, '2023-02-02 04:52:58', '2023-02-02 04:53:17'),
	(242, 'App\\Models\\User', 1, 'auth_token', 'b73aa8416ea15692618d0b5ecb4383efa4f9ad9403bc1e39aa210414dce04bf1', '["*"]', '2023-02-02 04:58:27', NULL, '2023-02-02 04:58:09', '2023-02-02 04:58:27'),
	(243, 'App\\Models\\User', 1, 'auth_token', '372935d4f51f09bacd1da358a182b28296d0a075211686e7ac509e58bfbb88d7', '["*"]', '2023-02-02 05:02:33', NULL, '2023-02-02 04:59:12', '2023-02-02 05:02:33'),
	(244, 'App\\Models\\User', 1, 'auth_token', '68798103ef3b964b9b8e8970185712e293789661a2b825b8211af17bd95fdfc4', '["*"]', '2023-02-02 05:04:07', NULL, '2023-02-02 05:03:48', '2023-02-02 05:04:07'),
	(245, 'App\\Models\\User', 1, 'auth_token', '88677c335d900cb0a951daacf2365d8963434a313d2b56d643519890475d3310', '["*"]', '2023-02-02 08:04:42', NULL, '2023-02-02 05:12:33', '2023-02-02 08:04:42'),
	(246, 'App\\Models\\User', 1, 'auth_token', '2783e427f6ec68b31282c6d4208c374bc82069aa797823d744849a923aad2097', '["*"]', '2023-02-02 08:19:49', NULL, '2023-02-02 08:19:28', '2023-02-02 08:19:49'),
	(247, 'App\\Models\\User', 1, 'auth_token', '2b9418c63eaa3d2919b4ae30288e28e05fdb23f4a0844b9464f6742d72d6f653', '["*"]', '2023-02-02 08:25:46', NULL, '2023-02-02 08:25:25', '2023-02-02 08:25:46'),
	(248, 'App\\Models\\User', 1, 'auth_token', 'f572c96fd6181b1a514bdcff48d9340a9b4f9bc7f54f62caed419c2000c76f9d', '["*"]', '2023-02-02 09:07:09', NULL, '2023-02-02 09:06:50', '2023-02-02 09:07:09'),
	(249, 'App\\Models\\User', 1, 'auth_token', '5f055f366b324b5d7acf4836971d16f971fdf3080dec3387d3a3de84d2006b42', '["*"]', '2023-02-02 09:12:52', NULL, '2023-02-02 09:12:34', '2023-02-02 09:12:52'),
	(250, 'App\\Models\\User', 1, 'auth_token', '48059d513a3b6993bf1018d1e9e6709a2e8149d0f996215006be7f70705967db', '["*"]', '2023-02-02 09:16:48', NULL, '2023-02-02 09:16:00', '2023-02-02 09:16:48'),
	(251, 'App\\Models\\User', 1, 'auth_token', '532d1a5d9cb7652fa084479cc8f0ae16f6e5a75e4de9fd9245b803a9998d1b1c', '["*"]', '2023-02-02 09:19:57', NULL, '2023-02-02 09:19:33', '2023-02-02 09:19:57'),
	(252, 'App\\Models\\User', 1, 'auth_token', 'a83300db64e0193067f22ca1e9d746e2b8100c6a2a1c17ff84ba9eadd33dc09d', '["*"]', '2023-02-02 09:29:38', NULL, '2023-02-02 09:29:20', '2023-02-02 09:29:38'),
	(253, 'App\\Models\\User', 1, 'auth_token', '47323ec459729a9a72e143b45857ab3e3615a70ee1afa9012881218f1273cec6', '["*"]', '2023-02-02 09:31:53', NULL, '2023-02-02 09:31:15', '2023-02-02 09:31:53'),
	(254, 'App\\Models\\User', 1, 'auth_token', '1ccbc0abf61fb88bf61d6aa3c67038da8623af07c925c50ac8f70afd9dd2dfbc', '["*"]', '2023-02-02 09:34:06', NULL, '2023-02-02 09:33:48', '2023-02-02 09:34:06'),
	(255, 'App\\Models\\User', 1, 'auth_token', 'd94e4f272994de6854a1514f92f719dfb56dc75ef620fae92a14d340370866ca', '["*"]', '2023-02-02 09:34:44', NULL, '2023-02-02 09:34:26', '2023-02-02 09:34:44'),
	(256, 'App\\Models\\User', 1, 'auth_token', 'e961b2847297fd086e30e72bbff718dd99edf9d0fa240bbe9f589804ef32e1ff', '["*"]', '2023-02-02 09:36:28', NULL, '2023-02-02 09:36:11', '2023-02-02 09:36:28'),
	(257, 'App\\Models\\User', 1, 'auth_token', 'c5bcac39eb4c6f454cb5ea6a1a08c8c879735cd64c27fef1f4751830015644c4', '["*"]', '2023-02-02 09:38:09', NULL, '2023-02-02 09:37:53', '2023-02-02 09:38:09'),
	(258, 'App\\Models\\User', 1, 'auth_token', '49579f6ad472015ebe52f8eabe9fc2c1838383b773a8970d3c6517e167239d2c', '["*"]', '2023-02-02 09:39:27', NULL, '2023-02-02 09:39:11', '2023-02-02 09:39:27'),
	(259, 'App\\Models\\User', 1, 'auth_token', 'a9ac5edd6b81b3aaa255c666b1f756cd2469da0aafce7d4cbe789714ecc621e2', '["*"]', '2023-02-02 09:41:20', NULL, '2023-02-02 09:41:03', '2023-02-02 09:41:20'),
	(260, 'App\\Models\\User', 1, 'auth_token', '36a32a6ae6cabc556d706978ecf3f8df3728e0f233e59a80f95a2fde10b382e6', '["*"]', '2023-02-02 19:11:34', NULL, '2023-02-02 19:11:02', '2023-02-02 19:11:34'),
	(261, 'App\\Models\\User', 1, 'auth_token', '9203f2c8fa50a7007d7211616d638376e5a8ce17ad00c44fcbfc3632887b3802', '["*"]', '2023-02-02 19:19:06', NULL, '2023-02-02 19:18:18', '2023-02-02 19:19:06'),
	(262, 'App\\Models\\User', 1, 'auth_token', 'b2f2add0fa2fbda046be64bc0005d4dd85a9ef3a7275066e8ba2ab3834c51bba', '["*"]', '2023-02-02 21:21:20', NULL, '2023-02-02 21:20:58', '2023-02-02 21:21:20'),
	(263, 'App\\Models\\User', 1, 'auth_token', '7fb9d4759cc425d8d3422b4ad145ff459d147cb8f80bde78b84ab149db1c2bbb', '["*"]', '2023-02-02 21:22:52', NULL, '2023-02-02 21:22:37', '2023-02-02 21:22:52'),
	(264, 'App\\Models\\User', 1, 'auth_token', '335993c72ec326abbaa327accb3709934bae57c790eb50429e2f94a0526e12a2', '["*"]', '2023-02-02 21:26:51', NULL, '2023-02-02 21:26:36', '2023-02-02 21:26:51'),
	(265, 'App\\Models\\User', 1, 'auth_token', '827364c368b12b00caba4d06446b20587242349d223895c1446cd6d44667e749', '["*"]', '2023-02-02 21:34:25', NULL, '2023-02-02 21:34:02', '2023-02-02 21:34:25'),
	(266, 'App\\Models\\User', 1, 'auth_token', '5ae062b5b896368c21c6aebbc1f77328eff63cb1eca5b1fcfb80528f3efe713e', '["*"]', '2023-02-02 21:42:28', NULL, '2023-02-02 21:41:44', '2023-02-02 21:42:28'),
	(267, 'App\\Models\\User', 1, 'auth_token', '9e677e1cfa2881e8dd7d6ba9c300ef6e5fcd57a45c238be5d21dcff45f39b183', '["*"]', '2023-02-02 21:44:17', NULL, '2023-02-02 21:44:02', '2023-02-02 21:44:17'),
	(268, 'App\\Models\\User', 1, 'auth_token', '5ce773d7c987c1c8fde9994b1656edca0d40e69c912f15c46bfed5fe0ffb4b64', '["*"]', '2023-02-02 21:45:39', NULL, '2023-02-02 21:44:49', '2023-02-02 21:45:39'),
	(269, 'App\\Models\\User', 1, 'auth_token', '7a37c2e7981ef4970f2c98561bd3603c3b304a54870d8cab35d1c56373d91dd0', '["*"]', '2023-02-03 00:17:15', NULL, '2023-02-02 21:47:12', '2023-02-03 00:17:15'),
	(270, 'App\\Models\\User', 1, 'auth_token', '3b47c038b09e52865029ed8b169409453130fc25f14987e15795959f116539ba', '["*"]', '2023-02-03 00:23:02', NULL, '2023-02-03 00:22:45', '2023-02-03 00:23:02'),
	(271, 'App\\Models\\User', 1, 'auth_token', 'ce7f9def3a1fce8169c6b93153cca4f94ba346fbb0448abf63642ae5de86be58', '["*"]', '2023-02-03 00:24:07', NULL, '2023-02-03 00:23:35', '2023-02-03 00:24:07'),
	(272, 'App\\Models\\User', 1, 'auth_token', 'c7e0f1b890ca4fbd97dcdf08d50aa6eade169e1984fec68d31d21b23d9201d77', '["*"]', '2023-02-03 00:26:26', NULL, '2023-02-03 00:26:10', '2023-02-03 00:26:26'),
	(273, 'App\\Models\\User', 1, 'auth_token', '0576a858ccc56416ff0f9b00c4fa67a26df07be14a14a8e6477a32147f15375b', '["*"]', '2023-02-03 00:27:34', NULL, '2023-02-03 00:27:12', '2023-02-03 00:27:34'),
	(274, 'App\\Models\\User', 1, 'auth_token', 'da18173c94feeef2e37ec58358000bdfff4854dd313ab3e131ab46d8d966814f', '["*"]', '2023-02-03 00:29:13', NULL, '2023-02-03 00:28:57', '2023-02-03 00:29:13'),
	(275, 'App\\Models\\User', 1, 'auth_token', 'b5fee8a6e030c7883bd4666f69577846df8de512baa4851222a3226f6188c39e', '["*"]', '2023-02-03 00:30:02', NULL, '2023-02-03 00:29:47', '2023-02-03 00:30:03'),
	(276, 'App\\Models\\User', 1, 'auth_token', '50eba6f749bb29e7e80fa173cbcba11737397e2883875b283f29821565ca60a7', '["*"]', '2023-02-03 00:31:32', NULL, '2023-02-03 00:31:15', '2023-02-03 00:31:32'),
	(277, 'App\\Models\\User', 1, 'auth_token', 'f1bb57c0fcea32ec970f4e6d54cef187e550c123bffc6195e18602ae50380da2', '["*"]', NULL, NULL, '2023-02-03 00:50:19', '2023-02-03 00:50:19'),
	(278, 'App\\Models\\User', 1, 'auth_token', '213be61da1aba14aa31ee2da6be632103a83de26417e73a9be92409cacc49026', '["*"]', '2023-02-03 00:51:00', NULL, '2023-02-03 00:50:43', '2023-02-03 00:51:00'),
	(279, 'App\\Models\\User', 1, 'auth_token', 'd50fbc50a608bed842d20d6ce7fb43330d0ca401080a1164796e6190141f1797', '["*"]', '2023-02-03 00:53:20', NULL, '2023-02-03 00:52:56', '2023-02-03 00:53:20'),
	(280, 'App\\Models\\User', 1, 'auth_token', '23d41537bac9ff23908c53bb362e37d562951881104929ebfe06f97d94eb9723', '["*"]', '2023-02-03 00:54:56', NULL, '2023-02-03 00:54:35', '2023-02-03 00:54:56'),
	(281, 'App\\Models\\User', 1, 'auth_token', 'a30a7ec4ef4e3be206ca516d9e3caafa07e87dfcf2d4349e8c962c92a09f6d34', '["*"]', '2023-02-03 01:01:17', NULL, '2023-02-03 01:01:04', '2023-02-03 01:01:17'),
	(282, 'App\\Models\\User', 1, 'auth_token', 'aa5708560eb710ae3114b4d1dad04a21f118aea8b823c39ce7eb93acf176d2f1', '["*"]', '2023-02-03 01:03:53', NULL, '2023-02-03 01:02:38', '2023-02-03 01:03:53'),
	(283, 'App\\Models\\User', 1, 'auth_token', 'd33e40d78fe7fc9988931f4d7fd80dddbf9e7125506fe1d6e0206aeb7901ecec', '["*"]', '2023-02-03 01:37:21', NULL, '2023-02-03 01:36:54', '2023-02-03 01:37:21'),
	(284, 'App\\Models\\User', 1, 'auth_token', 'cf5521b8b1cbfa954a967969c23e46d84cd51b1b261ce7e29e030f5224bd22b0', '["*"]', '2023-02-03 01:40:18', NULL, '2023-02-03 01:39:55', '2023-02-03 01:40:18'),
	(285, 'App\\Models\\User', 1, 'auth_token', '61006e8873c3878d1baf485be2208972a74302fb0c0d187c10aaabcefdd7bbdb', '["*"]', '2023-02-03 01:41:31', NULL, '2023-02-03 01:41:16', '2023-02-03 01:41:31'),
	(286, 'App\\Models\\User', 1, 'auth_token', '3cfe428f7856254a50caa4d6fa8879ae464de2c99f457437baa55c7a7fde590b', '["*"]', '2023-02-03 01:42:20', NULL, '2023-02-03 01:42:05', '2023-02-03 01:42:20'),
	(287, 'App\\Models\\User', 1, 'auth_token', '4fa2d5be246d4411cbc1f2313d4e5c1183b67d3960b84266c07f2b1ebccb1d73', '["*"]', '2023-02-03 01:44:43', NULL, '2023-02-03 01:43:01', '2023-02-03 01:44:44'),
	(288, 'App\\Models\\User', 1, 'auth_token', 'de2be4443dea8ab1b350157fbf24bed0f9f5e13e272c27e837294a2f871d8094', '["*"]', '2023-02-03 01:46:06', NULL, '2023-02-03 01:45:49', '2023-02-03 01:46:06'),
	(289, 'App\\Models\\User', 1, 'auth_token', '9dc4f8d53c6d0e4ea5b7a8b2039e21b226985de805f07911a3ebf8ef33960440', '["*"]', '2023-02-03 01:47:36', NULL, '2023-02-03 01:47:16', '2023-02-03 01:47:36'),
	(290, 'App\\Models\\User', 1, 'auth_token', '5a386acd6bf34085c623c5979f675004b36c2b1b5cd6e9dc212e9b54d9dbadd5', '["*"]', '2023-02-03 01:49:10', NULL, '2023-02-03 01:48:53', '2023-02-03 01:49:10'),
	(291, 'App\\Models\\User', 1, 'auth_token', 'e244644cb3e72d79592a5b177947f6cf91b53fdabe3bd1828d5386e928fab51e', '["*"]', '2023-02-03 01:54:07', NULL, '2023-02-03 01:53:52', '2023-02-03 01:54:07'),
	(292, 'App\\Models\\User', 1, 'auth_token', 'aba0a2ab24ff9270ce565c204ee7c59c0ac64e291611393ddefa606665cbdb90', '["*"]', '2023-02-03 03:11:11', NULL, '2023-02-03 03:09:57', '2023-02-03 03:11:11'),
	(293, 'App\\Models\\User', 1, 'auth_token', 'fabca3f28802acaf296706b11bd809c348e867f9fed2b2d4bd6fc8dc63e05686', '["*"]', '2023-02-03 03:13:17', NULL, '2023-02-03 03:12:55', '2023-02-03 03:13:17'),
	(294, 'App\\Models\\User', 1, 'auth_token', 'fefd77fbbe409ad255134608aff1dde9e42abea7a0cee2ca7da93fac774fb8c5', '["*"]', '2023-02-03 12:57:34', NULL, '2023-02-03 12:57:08', '2023-02-03 12:57:34'),
	(295, 'App\\Models\\User', 1, 'auth_token', '15881a5ad5513071ef03fbea78aee555f11ba374b21c9b8bdce156e0777069d1', '["*"]', '2023-02-03 12:59:09', NULL, '2023-02-03 12:58:46', '2023-02-03 12:59:09'),
	(296, 'App\\Models\\User', 1, 'auth_token', '41317a574a4d8142732c67a5ce7cdb5f34aac03ce70ae6c5f9ee2c493cc6ac28', '["*"]', '2023-02-03 13:02:51', NULL, '2023-02-03 13:02:26', '2023-02-03 13:02:51'),
	(297, 'App\\Models\\User', 1, 'auth_token', 'e16d7048ca757994c9ba77a18b46645af61e448a94568b0f70ee52bcfedff4d6', '["*"]', '2023-02-03 13:07:05', NULL, '2023-02-03 13:06:41', '2023-02-03 13:07:05'),
	(298, 'App\\Models\\User', 1, 'auth_token', '246ebd153e1c4b73f9ffc7f12065202e61b6cb50f58b646403727e12d29f8a1a', '["*"]', '2023-02-03 13:09:01', NULL, '2023-02-03 13:08:19', '2023-02-03 13:09:01'),
	(299, 'App\\Models\\User', 1, 'auth_token', 'e3bd78952e670da8e57a0c6feb5653ec5c3d32dffe7f62afcb412969248def17', '["*"]', '2023-02-03 13:11:12', NULL, '2023-02-03 13:10:41', '2023-02-03 13:11:12'),
	(300, 'App\\Models\\User', 1, 'auth_token', '709645cdea41b09cfc1dbaa46d2a45b2b6dd0eaa6fadf8ebe27bb2a9c0a2a907', '["*"]', '2023-02-03 13:13:51', NULL, '2023-02-03 13:13:28', '2023-02-03 13:13:51'),
	(301, 'App\\Models\\User', 1, 'auth_token', 'f99272ebdced19cea54d274adaa2e65f5ad3957d43dc3d08153f87e6646af24a', '["*"]', '2023-02-03 13:15:11', NULL, '2023-02-03 13:14:49', '2023-02-03 13:15:11'),
	(302, 'App\\Models\\User', 1, 'auth_token', 'e31162fcc28ba4899834dde2c5e732be1bb9c7490ad487689acb230ba66ef330', '["*"]', '2023-02-03 13:17:55', NULL, '2023-02-03 13:17:31', '2023-02-03 13:17:55'),
	(303, 'App\\Models\\User', 1, 'auth_token', 'ae773c9334fff52a0cc3e7a83389f1b8fbe13d5aa88b6cca0891e380c97b72cd', '["*"]', '2023-02-03 13:19:38', NULL, '2023-02-03 13:19:15', '2023-02-03 13:19:38'),
	(304, 'App\\Models\\User', 1, 'auth_token', '234e9e924617da5cf151843369c2e49275490a57db9d9eba8042619b061cbaa4', '["*"]', '2023-02-03 13:27:41', NULL, '2023-02-03 13:27:18', '2023-02-03 13:27:41'),
	(305, 'App\\Models\\User', 1, 'auth_token', 'b551fc0b4d98d8f4ccde29bd03d117ec6cddc4bcd22ad1ac446eea5947840c6b', '["*"]', '2023-02-03 13:29:27', NULL, '2023-02-03 13:29:02', '2023-02-03 13:29:27'),
	(306, 'App\\Models\\User', 1, 'auth_token', 'cc18e6930ff509beeb866740e3a3982ed01176968987f2408b574a62b58de830', '["*"]', '2023-02-03 13:31:51', NULL, '2023-02-03 13:31:06', '2023-02-03 13:31:51'),
	(307, 'App\\Models\\User', 1, 'auth_token', '72b4bd49534dd91ba25082fe7945bd2bc57172667d1243eab4d8a59fd906d823', '["*"]', '2023-02-03 13:33:48', NULL, '2023-02-03 13:33:25', '2023-02-03 13:33:48'),
	(308, 'App\\Models\\User', 1, 'auth_token', '0a97b5228163ad47ff05c9916bc67c66647fd06a6fb64d22fb14c1a6f6d142bd', '["*"]', '2023-02-03 13:35:30', NULL, '2023-02-03 13:35:07', '2023-02-03 13:35:30'),
	(309, 'App\\Models\\User', 1, 'auth_token', 'd895512df407d0205ecc385e73239f74aaa881de6d70e11efb2bc8b21dcdbc31', '["*"]', '2023-02-03 13:38:03', NULL, '2023-02-03 13:37:41', '2023-02-03 13:38:03'),
	(310, 'App\\Models\\User', 1, 'auth_token', '45da3ae14d50f2535f5ef3e463cade8003ad375cce12cf964d446c8cbab5eb0b', '["*"]', '2023-02-03 13:39:45', NULL, '2023-02-03 13:39:15', '2023-02-03 13:39:45'),
	(311, 'App\\Models\\User', 1, 'auth_token', 'ea22a46362aa9b4354afa67d255c743f3cc1a18dd422f9df2dabac758019bf2a', '["*"]', '2023-02-03 13:50:44', NULL, '2023-02-03 13:50:18', '2023-02-03 13:50:44'),
	(312, 'App\\Models\\User', 1, 'auth_token', '99c6c87714170b08859e0fe361d2c1c8799814fe2d10e13a958f26085b6ec04e', '["*"]', '2023-02-03 13:55:11', NULL, '2023-02-03 13:54:46', '2023-02-03 13:55:11'),
	(313, 'App\\Models\\User', 1, 'auth_token', 'f235fc0f9508806c80e2e26c1dbeb3e244a5d6c4a864ff0dcebfe3ce4cd50fcf', '["*"]', '2023-02-03 14:17:49', NULL, '2023-02-03 14:17:21', '2023-02-03 14:17:49'),
	(314, 'App\\Models\\User', 1, 'auth_token', '24b49b3d3cb68ff05528ead9a85a948f9905aa0b113a366945643c53da898c41', '["*"]', '2023-02-03 14:22:01', NULL, '2023-02-03 14:18:56', '2023-02-03 14:22:01'),
	(315, 'App\\Models\\User', 1, 'auth_token', 'eafa5b17bf02364b69e1667ca4589b316e5fbaf2dbe40c4600184643067ef535', '["*"]', '2023-02-03 14:25:19', NULL, '2023-02-03 14:24:48', '2023-02-03 14:25:19'),
	(316, 'App\\Models\\User', 1, 'auth_token', 'f4c98786f431535497c56e4cb1ab62aeffe9b4dd43921aa8f1eca6134752cc7c', '["*"]', '2023-02-03 14:30:55', NULL, '2023-02-03 14:28:20', '2023-02-03 14:30:55'),
	(317, 'App\\Models\\User', 1, 'auth_token', '8e2a4a6d8fe2ec2909bfca0aa0b74828785377f5d8e3ce959d590f73f531c6fd', '["*"]', '2023-02-03 14:35:31', NULL, '2023-02-03 14:35:08', '2023-02-03 14:35:31'),
	(318, 'App\\Models\\User', 1, 'auth_token', '0ba62ba8e6457368129ca480931c307026b2ba023f2615d89747cfd36815d60d', '["*"]', '2023-02-03 14:38:53', NULL, '2023-02-03 14:38:29', '2023-02-03 14:38:53'),
	(319, 'App\\Models\\User', 1, 'auth_token', 'a7ab0c387f3fc76541e7f768002fa9c4b7afd4c1ae3d733d26ee463a3e307f76', '["*"]', '2023-02-03 14:41:32', NULL, '2023-02-03 14:40:58', '2023-02-03 14:41:32'),
	(320, 'App\\Models\\User', 1, 'auth_token', 'b87eb8566302738939a5c3b96bce388ae32bc570b616e5b4423806eadf201099', '["*"]', '2023-02-03 14:46:39', NULL, '2023-02-03 14:44:18', '2023-02-03 14:46:39'),
	(321, 'App\\Models\\User', 1, 'auth_token', '4e296920cf2c5a054a49ddcc81e186721bed2401e18a206d8b575e3e21b06c19', '["*"]', '2023-02-03 14:49:38', NULL, '2023-02-03 14:48:47', '2023-02-03 14:49:38'),
	(322, 'App\\Models\\User', 1, 'auth_token', '2f45a5776287bc79b1e55adca567d4261facdc2a393e20462788e4b38f31f2dd', '["*"]', '2023-02-03 14:54:30', NULL, '2023-02-03 14:54:05', '2023-02-03 14:54:30'),
	(323, 'App\\Models\\User', 1, 'auth_token', '6875f0979739456f681121b4afeefe7948315aae294a8aa04991e38be4b10c05', '["*"]', '2023-02-03 15:02:41', NULL, '2023-02-03 15:02:09', '2023-02-03 15:02:41'),
	(324, 'App\\Models\\User', 1, 'auth_token', '3229a660bdb2c5fe280e35903dcfa9c4a6f390ea321eded4e1a8e0c0911d8698', '["*"]', '2023-02-03 15:04:34', NULL, '2023-02-03 15:04:10', '2023-02-03 15:04:34'),
	(325, 'App\\Models\\User', 1, 'auth_token', '5ae3a54089d9dbd14aa3c693637da6db3f06460244e12ccd4ec748ea03f8c487', '["*"]', '2023-02-03 15:09:22', NULL, '2023-02-03 15:09:01', '2023-02-03 15:09:22'),
	(326, 'App\\Models\\User', 1, 'auth_token', 'd579af18699db4a18385a2d3279f2526be95e9463a3e04d4cbdbe9b32c46aeb1', '["*"]', '2023-02-03 15:13:19', NULL, '2023-02-03 15:12:55', '2023-02-03 15:13:19'),
	(327, 'App\\Models\\User', 1, 'auth_token', '29b4269ef9b1affda14d9b8607ac777e02291a89c613ec66a3ee1a886f955a20', '["*"]', '2023-02-03 15:15:31', NULL, '2023-02-03 15:14:50', '2023-02-03 15:15:31'),
	(328, 'App\\Models\\User', 1, 'auth_token', 'fde189e0b1b7229bee06950a4d0f16bf3d395a96f82015052e955cf2205418ac', '["*"]', '2023-02-03 15:17:11', NULL, '2023-02-03 15:16:49', '2023-02-03 15:17:11'),
	(329, 'App\\Models\\User', 1, 'auth_token', 'f66a7973ec715af7141dc6f33a263e4136741783be3e6c22e708f7bd89199c35', '["*"]', '2023-02-03 15:19:09', NULL, '2023-02-03 15:18:43', '2023-02-03 15:19:09'),
	(330, 'App\\Models\\User', 1, 'auth_token', 'd2a138eaac3e6b72bb50ead45472d0860355ecd43c216c8bd36b001d3eac3959', '["*"]', '2023-02-03 15:22:26', NULL, '2023-02-03 15:21:57', '2023-02-03 15:22:26'),
	(331, 'App\\Models\\User', 1, 'auth_token', '5f87ba62540f6af8ec709d2dd1e46617594bab1ed86c40587d36975ba3ecbc74', '["*"]', '2023-02-03 15:23:59', NULL, '2023-02-03 15:23:36', '2023-02-03 15:23:59'),
	(332, 'App\\Models\\User', 1, 'auth_token', '68686d76a9486a2fe60e2ee050ad8121cbfcc46d32e231f3318d956f68934c79', '["*"]', '2023-02-03 15:34:44', NULL, '2023-02-03 15:33:52', '2023-02-03 15:34:44'),
	(333, 'App\\Models\\User', 1, 'auth_token', '20b1db5fe254c55bcfeeadb800ba8abc6cbb785eb1c7fc3b3b80eb9620440eb8', '["*"]', '2023-02-03 15:39:22', NULL, '2023-02-03 15:39:00', '2023-02-03 15:39:22'),
	(334, 'App\\Models\\User', 1, 'auth_token', 'a4930701980f1059ef38bcd056633d233cd390d506817c8d38bbc19f447261c9', '["*"]', '2023-02-03 15:41:05', NULL, '2023-02-03 15:40:43', '2023-02-03 15:41:05'),
	(335, 'App\\Models\\User', 1, 'auth_token', 'bcd61e9e4ce9c33ddbb49ca569bea0eaec95b77aad800ce3c8870ca73a8edc55', '["*"]', '2023-02-03 15:42:59', NULL, '2023-02-03 15:42:36', '2023-02-03 15:42:59'),
	(336, 'App\\Models\\User', 1, 'auth_token', 'f26d18b4131b21e3632b4ac3d198382f9d1ca81b692deb1a29b6a83d89ff7a07', '["*"]', '2023-02-03 15:45:32', NULL, '2023-02-03 15:45:05', '2023-02-03 15:45:32'),
	(337, 'App\\Models\\User', 1, 'auth_token', '572c7f4001e228d1407748c2697724f286a5d5227d009d75b95e052bbc60a5ba', '["*"]', '2023-02-03 15:47:21', NULL, '2023-02-03 15:46:57', '2023-02-03 15:47:21'),
	(338, 'App\\Models\\User', 1, 'auth_token', '169ad43675d8d461c209c42f0c33333f856932ea1c87bd2207e137f7b230c3bf', '["*"]', '2023-02-03 15:48:48', NULL, '2023-02-03 15:48:25', '2023-02-03 15:48:48'),
	(339, 'App\\Models\\User', 1, 'auth_token', '1ad7aba1f51141d448244a8a5991805c06047e75f32a79f071d578af9620a2fc', '["*"]', '2023-02-03 15:50:13', NULL, '2023-02-03 15:49:50', '2023-02-03 15:50:13'),
	(340, 'App\\Models\\User', 1, 'auth_token', '5bda599cee0ef632f4ecfd27f003f160f9ce5e2990304546dfaf615d7bfa50f4', '["*"]', '2023-02-03 16:57:59', NULL, '2023-02-03 16:57:21', '2023-02-03 16:57:59'),
	(341, 'App\\Models\\User', 1, 'auth_token', '0b0157d1c5358efe0c7c39aa12acec6ce10a73b19b641a8644b53ab2ee923bdd', '["*"]', '2023-02-03 17:40:38', NULL, '2023-02-03 17:23:54', '2023-02-03 17:40:38'),
	(342, 'App\\Models\\User', 1, 'auth_token', '7957e5c4d51cefed9bcc8d335845db9967363454330cb85e9555065b1c58b29b', '["*"]', '2023-02-03 17:44:50', NULL, '2023-02-03 17:43:28', '2023-02-03 17:44:50'),
	(343, 'App\\Models\\User', 1, 'auth_token', '3249f245ac356c1e354f7c50a8e4de4261a40464440a77f6cafc1e66831728a3', '["*"]', '2023-02-03 17:45:31', NULL, '2023-02-03 17:45:07', '2023-02-03 17:45:31'),
	(344, 'App\\Models\\User', 1, 'auth_token', '0c895b131f7ab1a151b0f15df01b885b56ed5700901ce6c1b5dd5bb663b40c8a', '["*"]', '2023-02-03 18:10:40', NULL, '2023-02-03 18:07:55', '2023-02-03 18:10:40'),
	(345, 'App\\Models\\User', 1, 'auth_token', 'd24a876ae8f4b680ce77a620a7b4e0dc317b676480e6b313428f319a9691105d', '["*"]', '2023-02-03 18:11:55', NULL, '2023-02-03 18:11:38', '2023-02-03 18:11:55'),
	(346, 'App\\Models\\User', 1, 'auth_token', '917ca8b17524ae180ec2fedd9e5782f9c8aed0edc78cd2c1220850c4bce6f985', '["*"]', '2023-02-03 18:17:16', NULL, '2023-02-03 18:17:00', '2023-02-03 18:17:16'),
	(347, 'App\\Models\\User', 1, 'auth_token', '16cc59bc753fc0494b6b6e08cd38334135fe63a308fbab96606d2d5472af28ae', '["*"]', '2023-02-03 20:34:19', NULL, '2023-02-03 19:17:34', '2023-02-03 20:34:19'),
	(348, 'App\\Models\\User', 1, 'auth_token', 'c3569f9b7bf7df4f2262b1caacc5247839f79b049e21881ef639c8948892e880', '["*"]', '2023-02-03 21:05:12', NULL, '2023-02-03 20:34:37', '2023-02-03 21:05:12'),
	(349, 'App\\Models\\User', 1, 'auth_token', '43144895310969949876898ed87344dd2b804ed4aa150f51c34ac0fbc4d48de6', '["*"]', '2023-02-03 22:15:37', NULL, '2023-02-03 21:05:29', '2023-02-03 22:15:37'),
	(350, 'App\\Models\\User', 1, 'auth_token', '42a0951b1b0893182b19a54025c47f9f08e7a9c130e3e28d319873fea92bb0e3', '["*"]', '2023-02-03 22:20:23', NULL, '2023-02-03 22:17:18', '2023-02-03 22:20:23'),
	(351, 'App\\Models\\User', 1, 'auth_token', '1ac65d990165c162abae8e8624ec5fcec4b9c7760217476a140fc85ba2fc30dc', '["*"]', '2023-02-03 22:22:05', NULL, '2023-02-03 22:20:53', '2023-02-03 22:22:05'),
	(352, 'App\\Models\\User', 1, 'auth_token', 'bd91cc28999903482dfdf355deb592643a67deb4c295ef3f178ee397d52c9aa9', '["*"]', '2023-02-03 22:23:36', NULL, '2023-02-03 22:22:19', '2023-02-03 22:23:36'),
	(353, 'App\\Models\\User', 1, 'auth_token', '9492eef1d72f2f1e49ac75514b84b06f3a84ac05cb8f8320de0b57dee4e7e687', '["*"]', '2023-02-03 23:41:27', NULL, '2023-02-03 22:24:41', '2023-02-03 23:41:27'),
	(354, 'App\\Models\\User', 1, 'auth_token', 'a8e34b033f54128d93fd8c220bab3992487937f6f42e4b436289b32ef7e2cb9a', '["*"]', '2023-02-03 23:42:41', NULL, '2023-02-03 23:42:02', '2023-02-03 23:42:41'),
	(355, 'App\\Models\\User', 1, 'auth_token', '68c5843bcb83af9f57c1a2b7ee24fd6d4df3d17f64fd751bb4814f98bd4b71e7', '["*"]', '2023-02-03 23:48:22', NULL, '2023-02-03 23:43:02', '2023-02-03 23:48:22'),
	(356, 'App\\Models\\User', 1, 'auth_token', 'a7d4b060245350a0ef92fbd2510c5793b2c80ddd88fc40c35c0f61350dc1531b', '["*"]', '2023-02-04 00:48:57', NULL, '2023-02-03 23:49:16', '2023-02-04 00:48:57'),
	(357, 'App\\Models\\User', 1, 'auth_token', '1b23aedb7f80d79605dab0d97f9da950845f228f37fb9cb486efdff2935a31f4', '["*"]', '2023-02-04 02:00:20', NULL, '2023-02-04 00:51:38', '2023-02-04 02:00:20'),
	(358, 'App\\Models\\User', 1, 'auth_token', '709b9cb709fc4ddf29eb2eb8af81700c9f96bedb0e982e31c88ffb482640d573', '["*"]', '2023-02-04 03:27:04', NULL, '2023-02-04 03:22:28', '2023-02-04 03:27:04'),
	(359, 'App\\Models\\User', 1, 'auth_token', '9d101eebe7a95ef36d7d5de1b721b361168cd705c93d0fcfcb7056b0bd9ee798', '["*"]', '2023-02-04 17:39:47', NULL, '2023-02-04 07:30:40', '2023-02-04 17:39:47'),
	(360, 'App\\Models\\User', 1, 'auth_token', '0036155512b4ab58ee98a976c5d1e23f8a801707fd725a8295fa6fa840736332', '["*"]', '2023-02-04 18:37:26', NULL, '2023-02-04 18:29:58', '2023-02-04 18:37:26'),
	(361, 'App\\Models\\User', 1, 'auth_token', '591c02c0f808a9158388db3995a0e0feac282cb60808b888f2d0e4d4090ed82a', '["*"]', '2023-02-04 21:10:16', NULL, '2023-02-04 18:56:05', '2023-02-04 21:10:16'),
	(362, 'App\\Models\\User', 1, 'auth_token', 'afb78b3f142b690cd36a79407ddf2a8bae8541a185479013be94288eda1651cd', '["*"]', '2023-02-04 21:13:12', NULL, '2023-02-04 21:11:40', '2023-02-04 21:13:12'),
	(363, 'App\\Models\\User', 1, 'auth_token', 'e9e524cdef08cc96161b1ca8427235264dc23062eaf1fd5919fccebda0d58aaf', '["*"]', '2023-02-04 21:15:31', NULL, '2023-02-04 21:15:11', '2023-02-04 21:15:31'),
	(364, 'App\\Models\\User', 1, 'auth_token', '8bf8acbfa8e2c655805dc7db56024bf7ed97890d9b2a7add207a4c87be834580', '["*"]', '2023-02-04 21:29:27', NULL, '2023-02-04 21:23:09', '2023-02-04 21:29:27'),
	(365, 'App\\Models\\User', 1, 'auth_token', 'b50e656f1c1c172dd9c7292ff80438b9b72df7b0bf4874da12acc80bd4573001', '["*"]', '2023-02-04 21:32:27', NULL, '2023-02-04 21:32:05', '2023-02-04 21:32:27'),
	(366, 'App\\Models\\User', 1, 'auth_token', '169f63469c927081bca07fd00951951f302ca32c3db8b3748f1950835a5f4f9a', '["*"]', '2023-02-04 21:43:51', NULL, '2023-02-04 21:42:23', '2023-02-04 21:43:51'),
	(367, 'App\\Models\\User', 1, 'auth_token', 'aaf4059343ec047ec0536e1a5da615f35d2d4d63a18358982e551d418c033268', '["*"]', '2023-02-04 21:45:35', NULL, '2023-02-04 21:45:16', '2023-02-04 21:45:35'),
	(368, 'App\\Models\\User', 1, 'auth_token', '873a6d6efb2bb9522e5a284a3d580f3924b37e6a11ff847582df27be564063d3', '["*"]', '2023-02-05 20:29:46', NULL, '2023-02-04 21:49:37', '2023-02-05 20:29:46'),
	(369, 'App\\Models\\User', 1, 'auth_token', '62605bb9cc0fb1bd5da8fb6abaefe21b649b784d938e4f8e95909c77deb0fb64', '["*"]', '2023-02-05 22:38:50', NULL, '2023-02-05 20:31:12', '2023-02-05 22:38:50'),
	(370, 'App\\Models\\User', 1, 'auth_token', '2094575500674cda89e4cca121f261b61612e2b539247e53ffeaffe28a25e2cf', '["*"]', '2023-02-06 10:32:21', NULL, '2023-02-05 22:43:20', '2023-02-06 10:32:21'),
	(371, 'App\\Models\\User', 1, 'auth_token', '15d94c7a15c293c28f4add55c0481a0db622b93efb8419e594efb9b253027156', '["*"]', '2023-02-06 21:27:42', NULL, '2023-02-06 17:33:32', '2023-02-06 21:27:42'),
	(372, 'App\\Models\\User', 1, 'auth_token', 'cdeb1336365274704b13261a2643f28d0593b68c2523abb5021646a192ff51c2', '["*"]', '2023-02-06 23:58:07', NULL, '2023-02-06 21:56:09', '2023-02-06 23:58:07'),
	(373, 'App\\Models\\User', 1, 'auth_token', '99f21db9b71ccfc9ee9cbfab594c2546bf37b7071d1e95e380f4311c09beeb0d', '["*"]', '2023-02-07 02:30:40', NULL, '2023-02-07 02:11:25', '2023-02-07 02:30:40'),
	(374, 'App\\Models\\User', 1, 'auth_token', '2ed91934e6531b96848b33d523de4418a1a6a33c1be99cf420147057c6541240', '["*"]', '2023-02-07 08:05:33', NULL, '2023-02-07 06:57:00', '2023-02-07 08:05:33'),
	(375, 'App\\Models\\User', 1, 'auth_token', '32ce39a2a597d25e4eb3c6c8a1a879d30f21a5c459473545634ac002ad5fb9e9', '["*"]', '2023-02-07 09:22:51', NULL, '2023-02-07 08:26:32', '2023-02-07 09:22:51'),
	(376, 'App\\Models\\User', 1, 'auth_token', 'bf3cad1c8ba55d176df72fdc743cde89151a6b2e581eda0a8ff38a854bc4d508', '["*"]', '2023-02-07 22:28:05', NULL, '2023-02-07 22:01:14', '2023-02-07 22:28:05'),
	(377, 'App\\Models\\User', 1, 'auth_token', '88098a418b7b398fa7f2be357f45b220708152881c8456ccd98d406881857834', '["*"]', '2023-02-10 21:25:55', NULL, '2023-02-10 19:21:25', '2023-02-10 21:25:55'),
	(378, 'App\\Models\\User', 1, 'auth_token', '8a1979cc03b9328e53e16e652898eb9c58337b20c9d603ace302f6e9af6caa9b', '["*"]', '2023-02-14 05:22:00', NULL, '2023-02-13 23:55:39', '2023-02-14 05:22:00'),
	(379, 'App\\Models\\User', 1, 'auth_token', '638b788e627ee5df426201d71a0e77986680637391bdd48ead52ee3f378291d6', '["*"]', '2023-02-14 05:40:58', NULL, '2023-02-14 05:40:01', '2023-02-14 05:40:58'),
	(380, 'App\\Models\\User', 1, 'auth_token', 'c63ed805b51dc71225e093259a3a3ca7b394d88d0fc9c3deb05c39f0ee1c115a', '["*"]', '2023-02-14 16:31:51', NULL, '2023-02-14 16:31:27', '2023-02-14 16:31:51');

-- Volcando estructura para tabla semtinel.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.roles: ~9 rows (aproximadamente)
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'Administrador', 'web', '2023-01-05 20:33:09', '2023-01-07 01:00:08'),
	(2, 'Ejecutivo', 'web', '2023-01-05 20:35:23', '2023-01-07 00:55:59'),
	(3, 'Responsable de Especialidad', 'web', '2023-01-05 20:35:45', '2023-01-07 00:57:19'),
	(4, 'Especialista de Obra', 'web', '2023-01-05 20:41:46', '2023-01-07 00:57:00'),
	(5, 'Especialista de Logística', 'web', '2023-01-05 20:42:12', '2023-01-07 00:56:21'),
	(6, 'Especialista de Herramientas', 'web', '2023-01-05 20:46:24', '2023-01-07 00:59:43'),
	(7, 'Responsable de Pañol', 'web', '2023-01-05 20:48:10', '2023-01-07 00:58:17'),
	(8, 'Pañolero', 'web', '2023-01-05 20:48:58', '2023-01-07 00:59:00'),
	(13, 'Jefe de Brigada', 'web', '2023-01-27 01:42:59', '2023-01-27 01:42:59');

-- Volcando estructura para tabla semtinel.role_has_permissions
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.role_has_permissions: ~15 rows (aproximadamente)
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(1, 2),
	(3, 3),
	(3, 4),
	(4, 4),
	(3, 5),
	(4, 5),
	(3, 7),
	(4, 7),
	(3, 8),
	(4, 8),
	(1, 13);

-- Volcando estructura para tabla semtinel.syst_config
CREATE TABLE IF NOT EXISTS `syst_config` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `config` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `value` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_config: ~0 rows (aproximadamente)
INSERT INTO `syst_config` (`id`, `config`, `value`) VALUES
	(1, 'server_name', 'localhost');

-- Volcando estructura para tabla semtinel.syst_departments
CREATE TABLE IF NOT EXISTS `syst_departments` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_departments: ~0 rows (aproximadamente)

-- Volcando estructura para tabla semtinel.syst_poles
CREATE TABLE IF NOT EXISTS `syst_poles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `abbr` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_poles: ~9 rows (aproximadamente)
INSERT INTO `syst_poles` (`id`, `name`, `abbr`, `active`) VALUES
	(1, 'Habana: Habana Vieja', 'HZHV', b'1'),
	(2, 'Habana: Vedado-Miramar', 'HZVM', b'1'),
	(3, 'Cayo Coco', 'CCO', b'1'),
	(4, 'Varadero', 'VAR', b'1'),
	(5, 'Santa María', 'CSM', b'1'),
	(6, 'Cayo Cruz', 'CCZ', b'1'),
	(7, 'Guardalavaca', 'HGV', b'1'),
	(8, 'Ramón de Antilla', 'RDA', b'1'),
	(9, 'Todos', 'Todos', b'1');

-- Volcando estructura para tabla semtinel.syst_specialties
CREATE TABLE IF NOT EXISTS `syst_specialties` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_department` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_specialties: ~0 rows (aproximadamente)

-- Volcando estructura para tabla semtinel.syst_structure_objects
CREATE TABLE IF NOT EXISTS `syst_structure_objects` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_zone` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `active` bit(1) DEFAULT b'1',
  `abbr` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_structure_objects: ~4 rows (aproximadamente)
INSERT INTO `syst_structure_objects` (`id`, `id_zone`, `name`, `active`, `abbr`) VALUES
	(1, 1, 'BW 01', b'1', NULL),
	(3, 4, 'Prueba4', b'1', 'P4'),
	(4, 5, 'Prueba9', b'1', 'P9'),
	(5, 5, 'Prueba10', b'1', 'P10');

-- Volcando estructura para tabla semtinel.syst_structure_parts
CREATE TABLE IF NOT EXISTS `syst_structure_parts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_object` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent` int DEFAULT '0',
  `node_order` decimal(6,2) DEFAULT '1.00',
  `abbr` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_structure_parts: ~5 rows (aproximadamente)
INSERT INTO `syst_structure_parts` (`id`, `id_object`, `name`, `parent`, `node_order`, `abbr`, `active`) VALUES
	(1, 1, 'Habit 0101-2', 0, 1.00, '0101', b'1'),
	(4, 3, 'Prueba5', 0, 1.00, 'P5', b'1'),
	(5, 3, 'Prueba6', 0, 1.00, 'P6', b'1'),
	(6, 4, 'Prueba11', 0, 1.00, 'P11', b'1'),
	(11, NULL, 'Prueba14', 6, 1.00, 'P14', b'1'),
	(13, NULL, 'Prueba15', 11, 1.00, 'P15', b'1');

-- Volcando estructura para tabla semtinel.syst_structure_projects
CREATE TABLE IF NOT EXISTS `syst_structure_projects` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_pole` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `active` bit(1) DEFAULT b'1',
  `abbr` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_structure_projects: ~2 rows (aproximadamente)
INSERT INTO `syst_structure_projects` (`id`, `id_pole`, `name`, `active`, `abbr`) VALUES
	(1, 1, 'Hotel Metrópolis', b'1', 'METROP'),
	(6, 5, 'Prueba7', b'1', 'P7'),
	(7, 1, 'Hotel Gran Manzana', b'1', 'HGM');

-- Volcando estructura para tabla semtinel.syst_structure_zones
CREATE TABLE IF NOT EXISTS `syst_structure_zones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_project` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `active` bit(1) DEFAULT b'1',
  `abbr` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_structure_zones: ~5 rows (aproximadamente)
INSERT INTO `syst_structure_zones` (`id`, `id_project`, `name`, `active`, `abbr`) VALUES
	(1, 1, 'A1', b'1', NULL),
	(2, 1, 'B', b'1', NULL),
	(3, 3, 'Nueva5', b'1', 'N5'),
	(4, 1, 'Prueba3', b'1', 'P3'),
	(5, 6, 'Prueba8', b'1', 'P8');

-- Volcando estructura para tabla semtinel.syst_subsystems
CREATE TABLE IF NOT EXISTS `syst_subsystems` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_subsystems: ~4 rows (aproximadamente)
INSERT INTO `syst_subsystems` (`id`, `name`, `active`) VALUES
	(1, 'Logística de Obras', b'1'),
	(2, 'BTA Inventarios', b'0'),
	(3, 'Convenios', b'0');

-- Volcando estructura para tabla semtinel.syst_warehouses
CREATE TABLE IF NOT EXISTS `syst_warehouses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_project` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `owner` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla semtinel.syst_warehouses: ~3 rows (aproximadamente)
INSERT INTO `syst_warehouses` (`id`, `id_project`, `name`, `owner`, `active`) VALUES
	(1, 1, 'Pañol Estructura', 'Tony Machado', b'1'),
	(2, 1, 'Pañol Instalaciones', 'Yadira López', b'0'),
	(3, 1, 'Pañol Acabado', 'Diego Machado', b'1');

-- Volcando estructura para tabla semtinel.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla semtinel.users: ~2 rows (aproximadamente)
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `email_verified_at`, `username`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Tony', 'Machado', 'tony@nauta.cu', NULL, 'admin', '$2y$10$FKGSPHZC1kcrU8zyQJoqNe.9GtxwQ5XYA68oHDt.Xb0ecbev34QYi', '7A2XsNuDIZ5PeKwKZ5zmS6Bs9NqWD9PBhkMvFcTrgysJFMjxuItABQ16vOxy', '2022-11-26 18:45:07', '2022-11-26 18:45:07'),
	(2, 'Diego', 'Machado', 'diego@nauta.cu', NULL, 'diego', '202cb962ac59075b964b07152d234b70', NULL, '2022-11-27 00:35:14', '2022-11-27 00:35:14');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
