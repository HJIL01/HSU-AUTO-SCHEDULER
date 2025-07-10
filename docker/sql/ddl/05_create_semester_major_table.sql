CREATE TABLE semester_major (
  semester_id VARCHAR(255) NOT NULL,
  major_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (semester_id, major_id),
  FOREIGN KEY (semester_id) REFERENCES semester(semester_id),
  FOREIGN KEY (major_id) REFERENCES major(major_id)
);
