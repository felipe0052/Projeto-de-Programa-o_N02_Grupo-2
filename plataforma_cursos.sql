CREATE DATABASE IF NOT EXISTS plataforma_cursos
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE plataforma_cursos;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `descricao` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `nome`, `descricao`) VALUES
(1, 'Categoria teste 1', 'saffsa'),
(2, 'Teste 2', 'saffasafs'),
(3, 'Categoria Teste', 'Teste'),
(4, 'Cat ENC', 'Teste'),
(5, 'Categoria Teste 4af1', 'Cat desc'),
(6, 'Lopes', 'apenas uma categoria qualquer');

CREATE TABLE `courses` (
  `id` bigint(20) NOT NULL,
  `nome` varchar(160) NOT NULL,
  `descricao` text DEFAULT NULL,
  `limite_alunos` int(11) NOT NULL DEFAULT 0,
  `valor` decimal(10,2) NOT NULL DEFAULT 0.00,
  `horario` varchar(160) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `instructor_id` bigint(20) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `imagem_base64` mediumtext DEFAULT NULL,
  `creditos` int(11) NOT NULL,
  `image_url` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_courses_category` (`category_id`),
  KEY `idx_courses_instructor` (`instructor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `courses` (`id`, `nome`, `descricao`, `limite_alunos`, `valor`, `horario`, `category_id`, `instructor_id`, `status`, `created_at`, `updated_at`, `imagem_base64`, `creditos`, `image_url`) VALUES
(15, 'teste curso lopes', 'fasfsa', 3, 0.00, NULL, 2, 5, 'ativo', '2025-11-17 16:54:17', '2025-11-18 13:31:56', NULL, 1, NULL),
(18, 'teste', 'teste video', 100, 0.00, NULL, 6, 5, 'ativo', '2025-11-18 13:32:57', '2025-11-18 13:32:57', NULL, 1, NULL);

CREATE TABLE `course_images` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `size_bytes` bigint(20) NOT NULL,
  `storage_path` varchar(500) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7q8l236yquo9m1xkygw4qhens` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `course_images` (`id`, `created_at`, `filename`, `mime_type`, `size_bytes`, `storage_path`, `course_id`) VALUES
(1, '2025-11-17 16:54:17.000000', 'f43d327a5fa5480392d88cb46d5ac8dc.jpg', 'image/jpeg', 2760079, 'D:\\Trabalhos\\lais\\.data\\uploads\\courses\\15\\f43d327a5fa5480392d88cb46d5ac8dc.jpg', 15),
(3, '2025-11-18 13:32:57.000000', '00be430d90fa4a55be557b6f3d177d3b.jpg', 'image/jpeg', 32129, 'D:\\Trabalhos\\lais\\.data\\uploads\\courses\\18\\00be430d90fa4a55be557b6f3d177d3b.jpg', 18);

CREATE TABLE `course_prerequisites` (
  `course_id` bigint(20) NOT NULL,
  `prerequisite_course_id` bigint(20) NOT NULL,
  PRIMARY KEY (`course_id`,`prerequisite_course_id`),
  KEY `fk_cp_prereq` (`prerequisite_course_id`)
);

INSERT INTO `course_prerequisites` (`course_id`, `prerequisite_course_id`) VALUES
(18, 15);

CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `registration_code` varchar(64) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_code` (`registration_code`),
  UNIQUE KEY `uk_enrollment_user_course` (`user_id`,`course_id`),
  KEY `idx_enrollments_course` (`course_id`,`status`),
  KEY `idx_enrollments_user` (`user_id`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `registration_code`, `status`, `created_at`, `completed_at`) VALUES
(1, 5, 15, 'MAT-b3a660e8-b469-4a85-89f5-0c969dc09e57', 'ativo', '2025-11-17 18:02:16', NULL),
(4, 4, 15, 'MAT-c4f1978d-9711-429b-a77a-26e77c9d7e54', 'ativo', '2025-11-18 09:51:20', NULL),
(5, 4, 18, 'MAT-55c6304a-42f5-4112-be73-7b8e44efb67d', 'ativo', '2025-11-18 13:33:25', NULL);

CREATE TABLE `roles` (
  `id` smallint(6) NOT NULL,
  `code` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `code`) VALUES (2, 'ALUNO'), (1, 'INSTRUTOR');

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password_hash` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `nome`, `email`, `foto_url`, `is_admin`, `created_at`, `updated_at`, `password_hash`) VALUES
(2, 'Teste', 'teste@example.com', NULL, 0, '2025-11-17 04:09:29', '2025-11-17 04:09:29', NULL),
(3, 'Teste Next', 'testenext@example.com', NULL, 0, '2025-11-17 04:09:47', '2025-11-17 04:09:47', NULL),
(4, 'Gabriel Almeida', 'gabrielalmeida0898p2p@gmail.com', NULL, 0, '2025-11-17 04:13:17', '2025-11-17 04:13:17', '$2a$10$tOLk62ErIfiVFmfebbkIhuZLaPxB9Z1j/Dwu7IY6uC834sU8.w7Jq'),
(5, 'Gabriel Almeida', 'gabrielalmeida0898p2ps@gmail.com', NULL, 0, '2025-11-17 04:45:17', '2025-11-17 04:45:17', '$2a$10$yyNQGCW7ClHKIseH.jcCGOUAIDo8ntgT5rHER7wVti6vuUdrmHXCm'),
(6, 'Teste Instrutor', 'instrutor+dev@local', NULL, 0, '2025-11-17 05:58:11', '2025-11-17 05:58:11', NULL),
(7, 'Test Instrutor', 'instructor@example.com', NULL, 0, '2025-11-17 06:09:03', '2025-11-17 06:09:03', NULL),
(8, 'Param Test', 'paramtest@example.com', NULL, 0, '2025-11-17 06:22:23', '2025-11-17 06:22:23', NULL),
(9, 'Verifica Param', 'verificaparam@example.com', NULL, 0, '2025-11-17 06:24:28', '2025-11-17 06:24:28', NULL),
(10, 'Encerrado Test', 'encerradotest@example.com', NULL, 0, '2025-11-17 06:55:44', '2025-11-17 06:55:44', NULL),
(11, 'Instrutor Teste', 'instrutor.teste@example.com', NULL, 0, '2025-11-17 07:54:48', '2025-11-17 07:54:48', NULL),
(12, 'Aluno Teste', 'aluno.teste@example.com', NULL, 0, '2025-11-17 07:55:36', '2025-11-17 07:55:36', NULL),
(13, 'Instrutor Teste', 'dev_instrutor_1dc0ee09@example.com', NULL, 0, '2025-11-18 09:17:35', '2025-11-18 09:17:35', NULL),
(14, 'Aluno Teste', 'dev_aluno_156276f6@example.com', NULL, 0, '2025-11-18 09:17:38', '2025-11-18 09:17:38', NULL);

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` smallint(6) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_roles_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(2, 2),(3, 2),(4, 2),(5, 1),(6, 1),(7, 1),(8, 1),(9, 1),(10, 1),(11, 1),(12, 2),(13, 1),(14, 2);

ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `courses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

ALTER TABLE `course_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `roles`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

ALTER TABLE `courses`
  ADD CONSTRAINT `fk_course_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_course_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `course_images`
  ADD CONSTRAINT `FK7q8l236yquo9m1xkygw4qhens` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

ALTER TABLE `course_prerequisites`
  ADD CONSTRAINT `fk_cp_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cp_prereq` FOREIGN KEY (`prerequisite_course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enrollment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;
