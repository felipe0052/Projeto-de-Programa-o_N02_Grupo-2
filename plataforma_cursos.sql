-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 17/11/2025 às 17:30
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS plataforma_cursos;
USE plataforma_cursos;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `plataforma_cursos`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `descricao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `categories`
--

INSERT INTO `categories` (`id`, `nome`, `descricao`) VALUES
(1, 'Categoria teste 1', 'saffsa'),
(2, 'Teste 2', 'saffasafs'),
(3, 'Categoria Teste', 'Teste'),
(4, 'Cat ENC', 'Teste');

-- --------------------------------------------------------

--
-- Estrutura para tabela `courses`
--

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
  `image_url` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `courses`
--

INSERT INTO `courses` (`id`, `nome`, `descricao`, `limite_alunos`, `valor`, `horario`, `category_id`, `instructor_id`, `status`, `created_at`, `updated_at`, `imagem_base64`, `creditos`, `image_url`) VALUES
(1, 'Curso Dev', 'Introducao', 30, 0.00, NULL, 1, 6, 'ativo', '2025-11-17 06:02:35', '2025-11-17 03:51:46', NULL, 4, NULL),
(2, 'Curso Verificacao', 'Desc', 10, 0.00, NULL, 3, 7, 'ativo', '2025-11-17 06:09:03', '2025-11-17 03:51:40', NULL, 1, NULL),
(3, 'teste', 'teste desc', 10, 0.00, NULL, 1, 5, 'ativo', '2025-11-17 06:21:39', '2025-11-17 03:51:44', NULL, 1, NULL),
(4, 'Curso ENC', 'Desc', 10, 0.00, NULL, 4, 10, 'encerrado', '2025-11-17 06:55:44', '2025-11-17 06:55:44', NULL, 1, NULL),
(5, 'teste 2', 'sfafsafsasaff', 12, 0.00, NULL, 1, 5, 'ativo', '2025-11-17 07:22:09', '2025-11-17 07:22:09', NULL, 1, NULL),
(6, 'sdasd', 'safsasf', 2, 0.00, NULL, 1, 5, 'rascunho', '2025-11-17 07:31:13', '2025-11-17 07:31:13', NULL, 1, NULL),
(7, 'asfsaf', 'safsaf', 2, 0.00, NULL, 1, 5, 'ativo', '2025-11-17 07:31:36', '2025-11-17 07:31:36', NULL, 1, NULL),
(8, 'hdf', 'dg', 1, 0.00, NULL, 1, 5, 'rascunho', '2025-11-17 07:47:18', '2025-11-17 07:47:18', NULL, 1, NULL),
(9, 'afsf', 'saf', 2, 0.00, NULL, 1, 5, 'rascunho', '2025-11-17 07:50:04', '2025-11-17 07:50:04', NULL, 1, NULL),
(10, 'Curso Draft Visivel', 'curso em rascunho', 50, 0.00, 'Seg 20h', 3, 11, 'rascunho', '2025-11-17 07:55:19', '2025-11-17 07:55:19', NULL, 3, NULL),
(11, 'asfsaf', 'safafs', 2, 0.00, NULL, 1, 5, 'ativo', '2025-11-17 08:03:10', '2025-11-17 08:03:10', NULL, 1, NULL),
(12, 'g', 'saf', 2, 0.00, NULL, 1, 5, 'ativo', '2025-11-17 08:43:44', '2025-11-17 08:43:44', NULL, 1, NULL),
(13, 'sfasf', 'safsaf', 2, 0.00, NULL, 1, 5, 'rascunho', '2025-11-17 08:53:29', '2025-11-17 08:53:29', NULL, 1, NULL),
(14, 'saf', 'sfafa', 2, 0.00, NULL, 2, 5, 'ativo', '2025-11-17 09:05:20', '2025-11-17 09:05:20', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `course_images`
--

CREATE TABLE `course_images` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `size_bytes` bigint(20) NOT NULL,
  `storage_path` varchar(500) NOT NULL,
  `course_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `course_prerequisites`
--

CREATE TABLE `course_prerequisites` (
  `course_id` bigint(20) NOT NULL,
  `prerequisite_course_id` bigint(20) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `registration_code` varchar(64) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `roles`
--

CREATE TABLE `roles` (
  `id` smallint(6) NOT NULL,
  `code` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `roles`
--

INSERT INTO `roles` (`id`, `code`) VALUES
(2, 'ALUNO'),
(1, 'INSTRUTOR');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `nome`, `email`, `foto_url`, `is_admin`, `created_at`, `updated_at`) VALUES
(2, 'Teste', 'teste@example.com', NULL, 0, '2025-11-17 04:09:29', '2025-11-17 04:09:29'),
(3, 'Teste Next', 'testenext@example.com', NULL, 0, '2025-11-17 04:09:47', '2025-11-17 04:09:47'),
(4, 'Gabriel Almeida', 'gabrielalmeida0898p2p@gmail.com', NULL, 0, '2025-11-17 04:13:17', '2025-11-17 04:13:17'),
(5, 'Gabriel Almeida', 'gabrielalmeida0898p2ps@gmail.com', NULL, 0, '2025-11-17 04:45:17', '2025-11-17 04:45:17'),
(6, 'Teste Instrutor', 'instrutor+dev@local', NULL, 0, '2025-11-17 05:58:11', '2025-11-17 05:58:11'),
(7, 'Test Instrutor', 'instructor@example.com', NULL, 0, '2025-11-17 06:09:03', '2025-11-17 06:09:03'),
(8, 'Param Test', 'paramtest@example.com', NULL, 0, '2025-11-17 06:22:23', '2025-11-17 06:22:23'),
(9, 'Verifica Param', 'verificaparam@example.com', NULL, 0, '2025-11-17 06:24:28', '2025-11-17 06:24:28'),
(10, 'Encerrado Test', 'encerradotest@example.com', NULL, 0, '2025-11-17 06:55:44', '2025-11-17 06:55:44'),
(11, 'Instrutor Teste', 'instrutor.teste@example.com', NULL, 0, '2025-11-17 07:54:48', '2025-11-17 07:54:48'),
(12, 'Aluno Teste', 'aluno.teste@example.com', NULL, 0, '2025-11-17 07:55:36', '2025-11-17 07:55:36');

-- --------------------------------------------------------

--
-- Estrutura para tabela `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(2, 2),
(3, 2),
(4, 2),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 2);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_courses_category` (`category_id`),
  ADD KEY `idx_courses_instructor` (`instructor_id`);

--
-- Índices de tabela `course_images`
--
ALTER TABLE `course_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7q8l236yquo9m1xkygw4qhens` (`course_id`);

--
-- Índices de tabela `course_prerequisites`
--
ALTER TABLE `course_prerequisites`
  ADD PRIMARY KEY (`course_id`,`prerequisite_course_id`),
  ADD KEY `fk_cp_prereq` (`prerequisite_course_id`);

--
-- Índices de tabela `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_code` (`registration_code`),
  ADD UNIQUE KEY `uk_enrollment_user_course` (`user_id`,`course_id`),
  ADD KEY `idx_enrollments_course` (`course_id`,`status`),
  ADD KEY `idx_enrollments_user` (`user_id`,`status`);

--
-- Índices de tabela `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `fk_user_roles_role` (`role_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `course_images`
--
ALTER TABLE `course_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `roles`
--
ALTER TABLE `roles`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `fk_course_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_course_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `course_images`
--
ALTER TABLE `course_images`
  ADD CONSTRAINT `FK7q8l236yquo9m1xkygw4qhens` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Restrições para tabelas `course_prerequisites`
--
ALTER TABLE `course_prerequisites`
  ADD CONSTRAINT `fk_cp_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cp_prereq` FOREIGN KEY (`prerequisite_course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enrollment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
