CREATE TABLE course_offering (
    semester_id VARCHAR(255) NOT NULL,
    major_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    professor_id INT NOT NULL,
    PRIMARY KEY (semester_id, major_id, course_id, professor_id),
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id),
    FOREIGN KEY (major_id) REFERENCES major(major_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (professor_id) REFERENCES professor(professor_id)
);
