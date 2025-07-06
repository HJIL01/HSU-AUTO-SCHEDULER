create table course_offering (
  semester_id VARCHAR NOT NULL REFERENCES semester(semester_id),
  major_id VARCHAR NOT NULL REFERENCES major(major_id),
  course_id VARCHAR NOT NULL REFERENCES course(course_id),
  professor_id INTEGER NOT NULL REFERENCES professor(professor_id),
  PRIMARY KEY (semester_id, major_id, course_id, professor_id)
);