
DROP DATABASE IF EXISTS plataforma_cursos;
CREATE DATABASE plataforma_cursos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plataforma_cursos;

SET NAMES utf8mb4;
SET time_zone = '+00:00';


CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  foto_url VARCHAR(255),
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE roles (
  id SMALLINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO roles (code) VALUES ('INSTRUTOR'), ('ALUNO');

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id SMALLINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE,
  descricao TEXT
) ENGINE=InnoDB;


CREATE TABLE courses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  descricao TEXT,
  limite_alunos INT NOT NULL DEFAULT 0,
  valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  horario VARCHAR(160),
  category_id INT,
  instructor_id BIGINT,
  status ENUM('rascunho','ativo','encerrado') NOT NULL DEFAULT 'ativo',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_course_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);


CREATE TABLE course_prerequisites (
  course_id BIGINT NOT NULL,
  prerequisite_course_id BIGINT NOT NULL,
  PRIMARY KEY (course_id, prerequisite_course_id),
  CONSTRAINT fk_cp_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_cp_prereq FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT chk_cp_distinct CHECK (course_id <> prerequisite_course_id)
) ENGINE=InnoDB;


CREATE TABLE enrollments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  registration_code VARCHAR(64) NOT NULL UNIQUE,
  status ENUM('ativo','concluido','cancelado','desistente','espera') NOT NULL DEFAULT 'ativo',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  UNIQUE KEY uk_enrollment_user_course (user_id, course_id),
  CONSTRAINT fk_enrollment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_enrollments_course ON enrollments(course_id, status);
CREATE INDEX idx_enrollments_user ON enrollments(user_id, status);


DELIMITER $$

CREATE TRIGGER trg_enrollments_before_insert
BEFORE INSERT ON enrollments FOR EACH ROW
BEGIN
  DECLARE inscritos INT DEFAULT 0;
  DECLARE limite INT DEFAULT NULL;
  DECLARE faltando INT DEFAULT 0;


  IF NEW.registration_code IS NULL OR NEW.registration_code = '' THEN
    SET NEW.registration_code = CONCAT('MAT-', UUID());
  END IF;


  SELECT COUNT(e.id) INTO inscritos
    FROM enrollments e
    WHERE e.course_id = NEW.course_id AND e.status = 'ativo';

  SELECT c.limite_alunos INTO limite FROM courses c WHERE c.id = NEW.course_id;

  IF limite IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Curso inexistente';
  END IF;

  IF inscritos >= limite THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Curso sem vagas';
  END IF;


  SELECT COUNT(*) INTO faltando
  FROM course_prerequisites cp
  LEFT JOIN enrollments e
    ON e.user_id = NEW.user_id
   AND e.course_id = cp.prerequisite_course_id
   AND e.status = 'concluido'
  WHERE cp.course_id = NEW.course_id
    AND e.id IS NULL;

  IF faltando > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pré-requisitos não concluídos';
  END IF;
END$$


CREATE TRIGGER trg_courses_before_insert
BEFORE INSERT ON courses FOR EACH ROW
BEGIN
  IF NEW.instructor_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = NEW.instructor_id AND r.code = 'INSTRUTOR'
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Instrutor precisa do cargo INSTRUTOR';
    END IF;
  END IF;
END$$

CREATE TRIGGER trg_courses_before_update
BEFORE UPDATE ON courses FOR EACH ROW
BEGIN
  IF NEW.instructor_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = NEW.instructor_id AND r.code = 'INSTRUTOR'
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Instrutor precisa do cargo INSTRUTOR';
    END IF;
  END IF;
END$$

DELIMITER ;


CREATE OR REPLACE VIEW vw_curso_vagas AS
SELECT c.id AS course_id, c.nome, c.limite_alunos,
       COUNT(e.id) AS inscritos_ativos,
       (c.limite_alunos - COUNT(e.id)) AS vagas_disponiveis
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'ativo'
GROUP BY c.id, c.nome, c.limite_alunos;

