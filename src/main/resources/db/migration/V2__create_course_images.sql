CREATE TABLE IF NOT EXISTS course_images (
  id BIGINT NOT NULL AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_course_images_course_id (course_id),
  CONSTRAINT fk_course_images_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);