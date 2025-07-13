CREATE TABLE major_course (
    major_code VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    semester_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (major_code, course_id, semester_id),
    FOREIGN KEY (major_code) REFERENCES major(major_code),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id)
);
