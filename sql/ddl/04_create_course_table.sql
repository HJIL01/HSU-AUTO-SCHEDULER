CREATE TABLE course (
    semester_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) PRIMARY KEY,
    course_code VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    professor_names VARCHAR(255) NOT NULL,
    delivery_method VARCHAR(255) NOT NULL,
    credit INT NOT NULL,
    day_or_night ENUM('day', 'night', 'both') NOT NULL,
    class_section VARCHAR(255) NOT NULL,
    grade_limit INT,
    online_hour DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    plan_code VARCHAR(255),
    FULLTEXT(course_code, course_name, professor_names),
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id) ON DELETE CASCADE
);